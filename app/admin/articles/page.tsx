"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Plus, Search, Edit, Trash2, Eye, MoreHorizontal, 
  FileText, Calendar, Clock, TrendingUp, Star, ChevronLeft, ChevronRight
} from "lucide-react"

interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  publishedAt?: string
  readingTime: number
  views: number
  featured: boolean
  createdAt: string
  updatedAt: string
}

export default function AdminArticles() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', page.toString())
      params.set('limit', '10')
      if (statusFilter !== 'all') {
        params.set('status', statusFilter)
      }
      if (searchQuery) {
        params.set('search', searchQuery)
      }

      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      
      setArticles(data.articles || [])
      setTotalPages(data.pagination?.pages || 1)
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchArticles()
  }, [page, statusFilter])

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (page === 1) {
        fetchArticles()
      } else {
        setPage(1)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    
    setDeleting(id)
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error("Failed to delete article:", error)
    } finally {
      setDeleting(null)
    }
  }

  const toggleFeatured = async (id: string, featured: boolean) => {
    try {
      await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featured: !featured })
      })
      fetchArticles()
    } catch (error) {
      console.error("Failed to toggle featured:", error)
    }
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--theme-text)' }}>Articles</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
            Manage your blog articles
          </p>
        </div>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all"
          style={{ 
            background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
            color: '#000000'
          }}
        >
          <Plus className="h-4 w-4" />
          New Article
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }} />
          <input
            type="text"
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2"
            style={{ 
              backgroundColor: 'var(--theme-surface)',
              borderColor: 'var(--theme-surface)',
              color: 'var(--theme-text)'
            }}
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 rounded-xl border focus:outline-none"
          style={{ 
            backgroundColor: 'var(--theme-surface)',
            borderColor: 'var(--theme-surface)',
            color: 'var(--theme-text)'
          }}
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl border overflow-hidden" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
        {loading ? (
          <div className="p-8 text-center" style={{ color: 'var(--theme-text)' }}>
            Loading...
          </div>
        ) : articles.length === 0 ? (
          <div className="p-8 text-center" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
            No articles found. Create your first article!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Article</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Category</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Status</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Views</th>
                  <th className="text-left px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Date</th>
                  <th className="text-right px-4 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--theme-surface)' }}>
                {articles.map((article) => (
                  <motion.tr
                    key={article._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="group"
                    style={{ backgroundColor: 'var(--theme-background)' }}
                  >
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => toggleFeatured(article._id, article.featured)}
                          className="flex-shrink-0"
                        >
                          <Star 
                            className="h-4 w-4" 
                            style={{ 
                              color: article.featured ? 'var(--theme-accent)' : 'var(--theme-text)',
                              opacity: article.featured ? 1 : 0.3
                            }}
                            fill={article.featured ? 'var(--theme-accent)' : 'none'}
                          />
                        </button>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--theme-text)' }}>
                            {article.title}
                          </p>
                          <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                            {article.readingTime} min read
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span 
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      >
                        {article.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span 
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          article.status === 'published' 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-yellow-500/20 text-yellow-400'
                        }`}
                      >
                        {article.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1" style={{ color: 'var(--theme-text)' }}>
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-sm">{article.views || 0}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                        <Calendar className="h-3 w-3" />
                        <span className="text-sm">
                          {article.publishedAt 
                            ? new Date(article.publishedAt).toLocaleDateString()
                            : new Date(article.createdAt).toLocaleDateString()
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {article.status === 'published' && (
                          <Link
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
                            style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-surface)' }}
                          >
                            <Eye className="h-4 w-4" />
                          </Link>
                        )}
                        <Link
                          href={`/admin/articles/${article._id}/edit`}
                          className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
                          style={{ color: 'var(--theme-text)', backgroundColor: 'var(--theme-surface)' }}
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(article._id)}
                          disabled={deleting === article._id}
                          className="p-2 rounded-lg transition-colors hover:bg-opacity-10"
                          style={{ color: '#EF4444', backgroundColor: 'var(--theme-surface)' }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-2 rounded-lg transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
