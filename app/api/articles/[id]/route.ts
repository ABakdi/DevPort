import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Article } from "@/models/article"

function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectToDatabase()

    const article = await Article.findOne({
      $or: [
        { _id: id },
        { slug: id }
      ]
    }).lean()

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    if (article.status === 'draft') {
      const session = await getServerSession(authOptions)
      if (!session) {
        return NextResponse.json({ error: "Article not found" }, { status: 404 })
      }
    }

    if (article.status === 'published') {
      await Article.findByIdAndUpdate(article._id, { $inc: { views: 1 } })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error fetching article:", error)
    return NextResponse.json({ error: "Failed to fetch article" }, { status: 500 })
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    
    const { title, content, slug, category, tags, excerpt, featuredImage, status, seo, social, featured } = body

    await connectToDatabase()

    const updateData: Record<string, unknown> = {
      ...(title && { title }),
      ...(content && { content, readingTime: calculateReadingTime(content) }),
      ...(slug && { slug }),
      ...(category && { category }),
      ...(tags && { tags }),
      ...(excerpt !== undefined && { excerpt }),
      ...(featuredImage !== undefined && { featuredImage }),
      ...(status && { 
        status,
        publishedAt: status === 'published' ? new Date() : undefined
      }),
      ...(seo && { seo }),
      ...(social && { social }),
      ...(featured !== undefined && { featured }),
    }

    if (title && !slug) {
      updateData.slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const article = await Article.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    )

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json(article)
  } catch (error) {
    console.error("Error updating article:", error)
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    await connectToDatabase()

    const article = await Article.findByIdAndDelete(id)

    if (!article) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Article deleted successfully" })
  } catch (error) {
    console.error("Error deleting article:", error)
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 })
  }
}
