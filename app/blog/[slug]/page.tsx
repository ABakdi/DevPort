import { Metadata } from "next"
import { notFound } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Article } from "@/models/article"
import { BlogPostClient } from "./blog-post-client"

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  await connectToDatabase()
  
  const article = await Article.findOne({ slug, status: 'published' }).lean()
  
  if (!article) {
    return { title: 'Article Not Found' }
  }

  return {
    title: article.seo?.title || article.title,
    description: article.seo?.description || article.excerpt,
    openGraph: {
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt?.toString(),
      authors: [article.author?.name || 'Admin'],
      images: article.featuredImage ? [article.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.seo?.title || article.title,
      description: article.seo?.description || article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  await connectToDatabase()
  
  const article = await Article.findOneAndUpdate(
    { slug, status: 'published' },
    { $inc: { views: 1 } },
    { returnDocument: 'after' }
  ).lean()
  
  if (!article) {
    notFound()
  }

  const relatedArticles = await Article.find({
    _id: { $ne: article._id },
    status: 'published',
    category: article.category
  })
  .limit(3)
  .select('title slug excerpt category publishedAt readingTime')
  .lean()

  return <BlogPostClient 
    article={JSON.parse(JSON.stringify(article))} 
    relatedArticles={JSON.parse(JSON.stringify(relatedArticles || []))} 
  />
}
