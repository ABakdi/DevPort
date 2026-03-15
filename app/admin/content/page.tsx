"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, Folder, MessageSquare, Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Copy, Check,
  TrendingUp, Clock, Calendar, Send, Star, ArrowUpRight, Filter, Grid3X3, List, X, Save, Loader2
} from "lucide-react"

interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
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

interface Project {
  id: string
  title: string
  status: string
  category: string
  year: number
}

interface Message {
  id: string
  name: string
  email: string
  subject: string
  date: string
  read: boolean
}

export default function AdminContent() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("articles")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>([])
  const [articlesLoading, setArticlesLoading] = useState(true)
  const [articlesCount, setArticlesCount] = useState({ all: 0, published: 0, draft: 0 })
  
  // Auto-save state
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null)
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const fetchArticles = useCallback(async () => {
    setArticlesLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('limit', '50')
      
      const res = await fetch(`/api/articles?${params}`)
      const data = await res.json()
      
      if (data.articles) {
        setArticles(data.articles)
        const all = data.articles.length
        const published = data.articles.filter((a: Article) => a.status === 'published').length
        const draft = data.articles.filter((a: Article) => a.status === 'draft').length
        setArticlesCount({ all, published, draft })
      }
    } catch (error) {
      console.error("Failed to fetch articles:", error)
    } finally {
      setArticlesLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [fetchArticles])

  // Auto-save effect
  useEffect(() => {
    if (!autoSaveEnabled || !editingArticle) return

    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }

    autoSaveTimeoutRef.current = setTimeout(async () => {
      await saveArticle(editingArticle, false)
    }, 3000) // Auto-save after 3 seconds of inactivity

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [editingArticle, autoSaveEnabled])

  const saveArticle = async (article: Article, showNotification: boolean = true) => {
    setAutoSaveStatus('saving')
    try {
      const res = await fetch(`/api/articles/${article._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(article)
      })
      
      if (res.ok) {
        setAutoSaveStatus('saved')
        setTimeout(() => setAutoSaveStatus('idle'), 2000)
        fetchArticles()
      } else {
        setAutoSaveStatus('error')
      }
    } catch (error) {
      console.error("Auto-save failed:", error)
      setAutoSaveStatus('error')
    }
  }

  const handleDeleteArticle = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return
    
    try {
      const res = await fetch(`/api/articles/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchArticles()
      }
    } catch (error) {
      console.error("Failed to delete article:", error)
    }
  }

  const handleToggleStatus = async (article: Article) => {
    const newStatus = article.status === 'published' ? 'draft' : 'published'
    try {
      await fetch(`/api/articles/${article._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      fetchArticles()
    } catch (error) {
      console.error("Failed to toggle status:", error)
    }
  }

  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const tabs = [
    { id: "articles", label: "Articles", icon: FileText, count: articlesCount.all, published: articlesCount.published, draft: articlesCount.draft, color: "var(--theme-primary)" },
    { id: "projects", label: "Projects", icon: Folder, count: 0, color: "var(--theme-secondary)" },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 0, color: "var(--theme-accent)" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--theme-text)' }}>Content Management</h1>
          <p style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Manage your articles, projects, and messages</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/admin/articles/new')}
          className="group px-5 py-3 font-bold rounded-xl transition-all flex items-center gap-2"
          style={{ 
            background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
            color: '#000000',
            boxShadow: '0 0 20px color-mix(in srgb, var(--theme-primary) 20%, transparent)',
          }}
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
          New {activeTab === "articles" ? "Article" : activeTab === "projects" ? "Project" : "Message"}
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div className="flex gap-2 p-1 border w-fit" style={{ 
          backgroundColor: 'var(--theme-background)',
          borderColor: 'var(--theme-surface)',
          borderRadius: 'var(--theme-button-radius)',
        }}>
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-4 py-2.5 transition-all"
              style={{
                background: activeTab === tab.id ? `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 20%, transparent), color-mix(in srgb, var(--theme-secondary) 20%, transparent))` : 'transparent',
                color: 'var(--theme-text)',
                borderRadius: 'var(--theme-button-radius)',
              }}
            >
              <tab.icon className="h-4 w-4" style={{ color: activeTab === tab.id ? tab.color : 'var(--theme-text)', opacity: activeTab === tab.id ? 1 : 0.6 }} />
              <span className="font-medium text-sm">{tab.label}</span>
              {tab.id === 'articles' && (
                <div className="flex gap-1">
                  <span 
                    className="px-2 py-0.5 rounded-full text-xs font-medium"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)',
                      color: 'var(--theme-text)',
                      opacity: activeTab === tab.id ? 1 : 0.6,
                    }}
                  >
                    {tab.count}
                  </span>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-10 pl-10 pr-4 rounded-xl border text-sm w-48 lg:w-64 transition-all"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
                borderColor: 'var(--theme-surface)',
                color: 'var(--theme-text)',
              }}
            />
          </div>
          <div className="flex gap-1 p-1 border" style={{ 
            backgroundColor: 'var(--theme-background)',
            borderColor: 'var(--theme-surface)',
            borderRadius: 'var(--theme-button-radius)',
          }}>
            <button
              onClick={() => setViewMode("list")}
              className="p-2 transition-all"
              style={{ 
                backgroundColor: viewMode === "list" ? 'var(--theme-surface)' : 'transparent',
                color: 'var(--theme-text)',
                opacity: viewMode === "list" ? 1 : 0.6,
                borderRadius: 'var(--theme-component-radius)',
              }}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className="p-2 transition-all"
              style={{ 
                backgroundColor: viewMode === "grid" ? 'var(--theme-surface)' : 'transparent',
                color: 'var(--theme-text)',
                opacity: viewMode === "grid" ? 1 : 0.6,
                borderRadius: 'var(--theme-component-radius)',
              }}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "articles" && (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            {articlesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--theme-primary)' }} />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center py-12" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                {searchQuery ? "No articles found matching your search." : "No articles yet. Create your first article!"}
              </div>
            ) : (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-2"}
              >
                {filteredArticles.map((article) => (
                  <motion.div
                    key={article._id}
                    variants={itemVariants}
                    className={`group rounded-xl hover:border transition-all cursor-pointer ${
                      viewMode === 'grid' ? 'p-0' : 'p-4'
                    }`}
                    style={{ 
                      backgroundColor: 'var(--theme-background)',
                      borderColor: 'var(--theme-surface)',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--theme-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--theme-surface)'}
                    onClick={() => router.push(`/admin/articles/${article._id}/edit`)}
                  >
                    {viewMode === "grid" ? (
                      // Grid view
                      <div className="h-full flex flex-col">
                        <div className="aspect-video relative overflow-hidden rounded-t-xl" style={{ backgroundColor: 'var(--theme-surface)' }}>
                          {article.featured ? (
                            <div className="absolute top-2 right-2 z-10">
                              <Star className="h-5 w-5" style={{ color: 'var(--theme-accent)', fill: 'var(--theme-accent)' }} />
                            </div>
                          ) : null}
                        </div>
                        <div className="p-4 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <span 
                              className="px-2 py-0.5 rounded text-xs font-medium"
                              style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                            >
                              {article.category}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              article.status === 'published' 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-amber-500/20 text-amber-400"
                            }`}>
                              {article.status}
                            </span>
                          </div>
                          <h3 className="font-semibold line-clamp-2 mb-2" style={{ color: 'var(--theme-text)' }}>
                            {article.title}
                          </h3>
                          <div className="mt-auto flex items-center justify-between text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" /> {article.readingTime} min
                            </span>
                            <span>{article.views} views</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // List view
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6 flex items-center gap-4">
                          <div className="w-10 h-10 bg-gradient-to-br from-[var(--theme-primary)]/20 to-[var(--theme-secondary)]/20 rounded-lg flex items-center justify-center">
                            <FileText className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold truncate transition-colors" style={{ color: 'var(--theme-text)' }}>
                                {article.title}
                              </h3>
                              {article.featured && (
                                <Star className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--theme-accent)', fill: 'var(--theme-accent)' }} />
                              )}
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded text-xs" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)', opacity: 0.6 }}>{article.category}</span>
                              <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                                <Clock className="h-3 w-3" /> {article.readingTime} min
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center">
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleToggleStatus(article); }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${
                              article.status === 'published' 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-amber-500/20 text-amber-400"
                            }`}
                          >
                            {article.status}
                          </button>
                        </div>
                        <div className="col-span-2 flex items-center gap-2" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                          <TrendingUp className="h-4 w-4" style={{ color: 'var(--theme-primary)' }} />
                          <span className="font-mono">{article.views.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                          <span className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                            {article.publishedAt 
                              ? new Date(article.publishedAt).toLocaleDateString()
                              : new Date(article.createdAt).toLocaleDateString()
                            }
                          </span>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {article.status === 'published' && (
                              <a 
                                href={`/blog/${article.slug}`}
                                target="_blank"
                                onClick={(e) => e.stopPropagation()}
                                className="p-2 rounded-lg transition-colors"
                                style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)', opacity: 0.6 }}
                              >
                                <Eye className="h-4 w-4" />
                              </a>
                            )}
                            <button 
                              onClick={(e) => { e.stopPropagation(); router.push(`/admin/articles/${article._id}/edit`); }}
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)', opacity: 0.6 }}
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleDeleteArticle(article._id); }}
                              className="p-2 rounded-lg transition-colors"
                              style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444', opacity: 0.6 }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
            style={{ color: 'var(--theme-text)', opacity: 0.6 }}
          >
            <Folder className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Projects management coming soon</p>
          </motion.div>
        )}

        {activeTab === "messages" && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-12"
            style={{ color: 'var(--theme-text)', opacity: 0.6 }}
          >
            <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Messages management coming soon</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
