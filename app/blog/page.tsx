import { Metadata } from "next"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { Article } from "@/models/article"
import { Navbar } from "@/components/home/navbar"

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

  const featuredArticle = articles.find((a: any) => a.featured) || articles[0]
  const regularArticles = articles.filter((a: any) => a._id !== featuredArticle?._id)

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)' }}>
      <Navbar />
      
      {/* Hero Section */}
      <div 
        className="relative py-20 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 8%, var(--theme-background) 50%), color-mix(in srgb, var(--theme-secondary) 8%, var(--theme-background)))`
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--theme-text) 1px, transparent 0)`,
              backgroundSize: '32px 32px'
            }}
          />
        </div>

        {/* Glow Effects */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" 
          style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.15 }}
        />
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none" 
          style={{ backgroundColor: 'var(--theme-secondary)', opacity: 0.15 }}
        />

        <div className="relative max-w-6xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
            <Link href="/" className="hover:text-[var(--theme-primary)] transition-colors">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--theme-text)' }}>Blog</span>
          </nav>

          <div className="text-center mb-12">
            <h1 
              className="text-4xl sm:text-5xl md:text-6xl font-black mb-4"
              style={{ color: 'var(--theme-text)' }}
            >
              Blog
            </h1>
            <p 
              className="text-lg md:text-xl max-w-2xl mx-auto"
              style={{ color: 'var(--theme-text)', opacity: 0.7 }}
            >
              Technical articles, tutorials, and insights on software development
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8">
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--theme-primary)' }}>{articles.length}</p>
              <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Articles</p>
            </div>
            <div className="w-px" style={{ backgroundColor: 'var(--theme-surface)' }} />
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--theme-secondary)' }}>{categories.length}</p>
              <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Categories</p>
            </div>
            <div className="w-px" style={{ backgroundColor: 'var(--theme-surface)' }} />
            <div className="text-center">
              <p className="text-3xl font-bold" style={{ color: 'var(--theme-accent)' }}>
                {articles.reduce((acc: number, a: any) => acc + (a.readingTime || 5), 0)}
              </p>
              <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Minutes Read</p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="sticky top-0 z-30 py-4 border-b backdrop-blur-xl" style={{ 
        backgroundColor: 'color-mix(in srgb, var(--theme-background) 80%, transparent)',
        borderColor: 'var(--theme-surface)'
      }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-wrap gap-2">
            <button
              className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
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
                className="px-4 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                style={{ 
                  backgroundColor: 'var(--theme-surface)', 
                  color: 'var(--theme-text)' 
                }}
              >
                {cat.name} ({cat.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Featured Article */}
        {featuredArticle && (
          <section className="mb-16">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <span 
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: 'var(--theme-accent)' }}
              />
              Featured Article
            </h2>
            <Link href={`/blog/${featuredArticle.slug}`} className="group block">
              <article 
                className="rounded-3xl overflow-hidden transition-all group-hover:scale-[1.01] group-hover:shadow-xl"
                style={{ 
                  backgroundColor: 'var(--theme-surface)',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                }}
              >
                <div className="grid md:grid-cols-2 gap-0">
                  {featuredArticle.featuredImage && (
                    <div className="aspect-video md:aspect-auto overflow-hidden">
                      <img 
                        src={featuredArticle.featuredImage} 
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-4">
                      <span 
                        className="px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
                      >
                        {featuredArticle.category}
                      </span>
                      {featuredArticle.featured && (
                        <span 
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{ backgroundColor: 'var(--theme-accent)', color: '#000' }}
                        >
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 
                      className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-[var(--theme-primary)] transition-colors"
                      style={{ color: 'var(--theme-text)' }}
                    >
                      {featuredArticle.title}
                    </h3>
                    <p 
                      className="line-clamp-2 mb-4"
                      style={{ color: 'var(--theme-text)', opacity: 0.7 }}
                    >
                      {featuredArticle.excerpt}
                    </p>
                    <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {featuredArticle.readingTime || 5} min read
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {featuredArticle.publishedAt 
                          ? new Date(featuredArticle.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : ''
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </Link>
          </section>
        )}

        {/* All Articles */}
        <section>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
            <span 
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            />
            All Articles
          </h2>
          
          {regularArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularArticles.map((article: any) => (
                <Link key={article._id} href={`/blog/${article.slug}`} className="group">
                  <article 
                    className="rounded-2xl overflow-hidden h-full transition-all group-hover:scale-[1.02] group-hover:shadow-lg"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    {article.featuredImage && (
                      <div className="aspect-video overflow-hidden relative">
                        <img 
                          src={article.featuredImage} 
                          alt={article.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                    <div className="p-5">
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
                      <h3 
                        className="text-lg font-bold mb-2 line-clamp-2 group-hover:text-[var(--theme-primary)] transition-colors"
                        style={{ color: 'var(--theme-text)' }}
                      >
                        {article.title}
                      </h3>
                      <p 
                        className="text-sm line-clamp-2 mb-4"
                        style={{ color: 'var(--theme-text)', opacity: 0.7 }}
                      >
                        {article.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
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
          ) : (
            <div className="text-center py-16">
              <div 
                className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-surface)' }}
              >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--theme-text)', opacity: 0.4 }}>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <p style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                No articles yet. Check back soon!
              </p>
            </div>
          )}
        </section>

        {/* Newsletter CTA */}
        <section className="mt-16">
          <div 
            className="rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, var(--theme-surface), color-mix(in srgb, var(--theme-primary) 10%, var(--theme-surface)))`
            }}
          >
            <div 
              className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" 
              style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.1 }}
            />
            <div 
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full blur-3xl pointer-events-none" 
              style={{ backgroundColor: 'var(--theme-secondary)', opacity: 0.1 }}
            />
            
            <div className="relative">
              <h3 className="text-2xl font-bold mb-3" style={{ color: 'var(--theme-text)' }}>
                Stay Updated
              </h3>
              <p className="max-w-md mx-auto mb-6" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
                Subscribe to get notified when new articles are published. No spam, unsubscribe anytime.
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl focus:outline-none"
                  style={{ 
                    backgroundColor: 'var(--theme-background)', 
                    color: 'var(--theme-text)'
                  }}
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold transition-transform hover:scale-105"
                  style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'var(--theme-background)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black"
                style={{ backgroundColor: 'var(--theme-primary)' }}
              >
                D
              </div>
              <span className="font-bold" style={{ color: 'var(--theme-text)' }}>DevPort</span>
            </div>
            <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
              &copy; {new Date().getFullYear()} DevPort. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {[
                { href: "/", label: "Home" },
                { href: "/cv", label: "CV" },
                { href: "/blog", label: "Blog" },
                { href: "/about", label: "About" },
                { href: "/projects", label: "Work" },
              ].map(link => (
                <Link 
                  key={link.href} 
                  href={link.href}
                  className="text-sm transition-colors hover:text-[var(--theme-primary)]"
                  style={{ color: 'var(--theme-text)', opacity: 0.6 }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
