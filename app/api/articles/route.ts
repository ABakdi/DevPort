import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Article } from "@/models/article"

export const dynamic = 'force-dynamic'

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const category = searchParams.get('category')
    const featured = searchParams.get('featured')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search')

    await connectToDatabase()

    const query: Record<string, unknown> = {}
    
    if (status === 'published') {
      query.status = 'published'
      query.publishedAt = { $lte: new Date() }
    } else if (status === 'draft') {
      query.status = 'draft'
    }
    
    if (category) {
      query.category = category
    }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (search) {
      query.$text = { $search: search }
    }

    const skip = (page - 1) * limit
    
    const [articles, total] = await Promise.all([
      Article.find(query)
        .sort({ featured: -1, publishedAt: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-content')
        .lean(),
      Article.countDocuments(query)
    ])

    const articlesWithStats = articles.map(article => ({
      ...article,
      readingTime: article.readingTime || calculateReadingTime(article.content || ''),
    }))

    return NextResponse.json({
      articles: articlesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      }
    }, {
      headers: {
        'Cache-Control': 's-maxage=60, stale-while-revalidate',
      },
    })
  } catch (error) {
    console.error("Error fetching articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { title, content, category, tags, excerpt, featuredImage, status, seo, social } = body

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    await connectToDatabase()

    let slug = body.slug || generateSlug(title)
    
    const existingArticle = await Article.findOne({ slug })
    if (existingArticle) {
      slug = `${slug}-${Date.now()}`
    }

    const readingTime = calculateReadingTime(content)

    const article = await Article.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.slice(0, 200) + '...',
      category: category || 'General',
      tags: tags || [],
      featuredImage: featuredImage || '',
      status: status || 'draft',
      publishedAt: status === 'published' ? new Date() : undefined,
      readingTime,
      author: {
        name: session.user?.name || 'Admin',
        avatar: session.user?.image || '',
      },
      seo: seo || {},
      social: social || {},
      featured: body.featured || false,
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error("Error creating article:", error)
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 })
  }
}
