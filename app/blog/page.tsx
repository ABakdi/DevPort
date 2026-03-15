import { Metadata } from "next"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { Article } from "@/models/article"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog | DevPort',
  description: 'Technical articles, tutorials, and insights from the developer community.',
  openGraph: {
    title: 'Blog | DevPort',
    description: 'Technical articles, tutorials, and insights from the developer community.',
    type: 'website',
  },
}

async function getArticles() {
  await connectToDatabase()
  
  const articles = await Article.find({ status: 'published' })
    .sort({ featured: -1, publishedAt: -1 })
    .select('-content')
    .lean()

  return articles
}

async function getCategories() {
  await connectToDatabase()
  
  const categories = await Article.aggregate([
    { $match: { status: 'published' } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { _id: 0, name: "$_id", count: 1 } }
  ])

  return categories
}

export default async function BlogPage() {
  const [articles, categories] = await Promise.all([
    getArticles(),
    getCategories()
  ])

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)' }}>
      {/* Hero */}
      <div className="py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
            Blog
          </h1>
          <p className="text-lg" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
            Technical articles, tutorials, and insights
          </p>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{ 
              backgroundColor: 'var(--theme-primary)', 
              color: '#000' 
            }}
          >
            All
          </button>
          {categories.map((cat: { name: string; count: number }) => (
            <button
              key={cat.name}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{ 
                backgroundColor: 'var(--theme-surface)', 
                color: 'var(--theme-text)' 
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Articles */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article: any) => (
            <Link key={article._id} href={`/blog/${article.slug}`} className="group">
              <article 
                className="rounded-2xl overflow-hidden h-full transition-all group-hover:scale-[1.02] group-hover:shadow-lg"
                style={{ 
                  backgroundColor: 'var(--theme-surface)',
                  boxShadow: 'var(--theme-shadow)'
                }}
              >
                {article.featuredImage && (
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={article.featuredImage} 
                      alt={article.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span 
                      className="px-2 py-1 rounded-full text-xs font-medium"
                      style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
                    >
                      {article.category}
                    </span>
                    {article.featured && (
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'var(--theme-accent)', color: '#000' }}
                      >
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 
                    className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-[var(--theme-primary)]"
                    style={{ color: 'var(--theme-text)' }}
                  >
                    {article.title}
                  </h2>
                  <p 
                    className="text-sm line-clamp-2 mb-4"
                    style={{ color: 'var(--theme-text)', opacity: 0.7 }}
                  >
                    {article.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                    <span>{article.readingTime || 5} min read</span>
                    <span>
                      {article.publishedAt 
                        ? new Date(article.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                        : ''
                      }
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-16">
            <p style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
              No articles yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
