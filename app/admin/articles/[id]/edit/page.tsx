"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import { 
  ArrowLeft, Save, Eye, EyeOff, Calendar, Clock, 
  Tag, Image as ImageIcon, Link as LinkIcon, Search, X,
  Bold, Italic, Heading2, Code, List, ListOrdered,
  Quote, ImagePlus, Link2, Minus, Loader2, Check, 
  AlertCircle, Upload, Maximize2, Minimize2, PanelLeft,
  Settings
} from "lucide-react"

interface Article {
  _id?: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  status: 'draft' | 'published'
  publishedAt?: string
  readingTime?: number
  featured: boolean
  seo: {
    title: string
    description: string
    keywords: string[]
  }
}

const defaultArticle: Article = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  featuredImage: "",
  category: "General",
  tags: [],
  status: "draft",
  featured: false,
  seo: {
    title: "",
    description: "",
    keywords: []
  }
}

const categories = [
  "General", "Frontend", "Backend", "Full Stack", 
  "DevOps", "AI/ML", "Mobile", "Security", "Database"
]

export default function ArticleEditor() {
  const router = useRouter()
  const params = useParams()
  const isNew = params.id === 'new'
  const [article, setArticle] = useState<Article>(defaultArticle)
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [showMetadata, setShowMetadata] = useState(false)
  const [tagInput, setTagInput] = useState("")
  const [keywordInput, setKeywordInput] = useState("")
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write")
  const [fullscreenPreview, setFullscreenPreview] = useState(false)
  const [uploading, setUploading] = useState(false)
  
  // Auto-save state
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  // Fetch article on mount
  useEffect(() => {
    if (!isNew && params.id) {
      fetchArticle(params.id as string)
    }
  }, [isNew, params.id])

  // Auto-fill SEO from article content
  useEffect(() => {
    if (!article.title && !article.content) return
    
    const seoTitle = article.seo.title || article.title
    let seoDescription = article.seo.description || article.excerpt
    
    if (!seoDescription && article.content) {
      const firstParagraph = article.content
        .split('\n\n')
        .find(p => p.trim().length > 0 && !p.startsWith('#')) || ''
      seoDescription = firstParagraph.slice(0, 160)
    }
    
    const existingKeywords = article.seo.keywords || []
    const newKeywords: string[] = []
    
    if (article.category && article.category !== 'General') {
      newKeywords.push(article.category)
    }
    
    article.tags.forEach(tag => {
      if (!existingKeywords.includes(tag) && newKeywords.length < 5) {
        newKeywords.push(tag)
      }
    })
    
    const allKeywords = [...existingKeywords.slice(0, 8 - newKeywords.length), ...newKeywords].slice(0, 8)
    
    setArticle(prev => ({
      ...prev,
      seo: {
        title: seoTitle,
        description: seoDescription.slice(0, 160),
        keywords: allKeywords
      }
    }))
  }, [article.title, article.content])

  // Auto-save effect (disabled for published articles)
  useEffect(() => {
    if (loading || isNew || saving || !article._id || article.status === 'published') return
    
    const currentContent = JSON.stringify(article)
    if (currentContent === lastSavedRef.current) return
    
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current)
    }
    
    autoSaveTimeoutRef.current = setTimeout(async () => {
      setAutoSaveStatus('saving')
      try {
        const res = await fetch(`/api/articles/${article._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...article, status: 'draft' })
        })
        
        if (res.ok) {
          const data = await res.json()
          setArticle(prev => ({ ...prev, ...data }))
          lastSavedRef.current = JSON.stringify(data)
          setAutoSaveStatus('saved')
          setTimeout(() => setAutoSaveStatus('idle'), 2000)
        } else {
          setAutoSaveStatus('error')
        }
      } catch (error) {
        console.error("Auto-save failed:", error)
        setAutoSaveStatus('error')
      }
    }, 2000)
    
    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }
    }
  }, [article, loading, isNew, saving])

  // Warn before leaving for published articles with unsaved changes
  const hasUnsavedChanges = article.status === 'published' && 
    JSON.stringify(article) !== lastSavedRef.current

  useEffect(() => {
    if (!hasUnsavedChanges) return

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
      return ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  // Block navigation for published articles with unsaved changes
  useEffect(() => {
    if (!hasUnsavedChanges) return

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault()
      const confirmLeave = window.confirm('You have unsaved changes to this published article. They will be discarded. Are you sure you want to leave?')
      if (confirmLeave) {
        window.removeEventListener('popstate', handlePopState)
        router.back()
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [hasUnsavedChanges])

  const fetchArticle = async (id: string) => {
    try {
      const res = await fetch(`/api/articles/${id}`)
      if (res.ok) {
        const data = await res.json()
        setArticle({
          ...data,
          tags: data.tags || [],
          seo: data.seo || { title: "", description: "", keywords: [] }
        })
        lastSavedRef.current = JSON.stringify(data)
      }
    } catch (error) {
      console.error("Failed to fetch article:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (publish: boolean = false) => {
    setSaving(true)
    try {
      const payload = {
        ...article,
        status: publish ? 'published' : article.status,
        publishedAt: publish ? new Date() : article.publishedAt
      }

      const url = isNew ? '/api/articles' : `/api/articles/${params.id}`
      const method = isNew ? 'POST' : 'PUT'

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        const data = await res.json()
        if (isNew) {
          router.push(`/admin/articles/${data._id}/edit`)
        } else {
          setArticle({ ...article, ...data })
          lastSavedRef.current = JSON.stringify(data)
          setAutoSaveStatus('saved')
          setTimeout(() => setAutoSaveStatus('idle'), 2000)
        }
      }
    } catch (error) {
      console.error("Failed to save article:", error)
    } finally {
      setSaving(false)
    }
  }

  const generateSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  const handleTitleChange = (title: string) => {
    setArticle(prev => ({
      ...prev,
      title,
      slug: prev.slug || generateSlug(title)
    }))
  }

  const addTag = () => {
    if (tagInput.trim() && !article.tags.includes(tagInput.trim())) {
      setArticle(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setArticle(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !article.seo.keywords.includes(keywordInput.trim())) {
      setArticle(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          keywords: [...prev.seo.keywords, keywordInput.trim()]
        }
      }))
      setKeywordInput("")
    }
  }

  const removeKeyword = (keyword: string) => {
    setArticle(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: prev.seo.keywords.filter(k => k !== keyword)
      }
    }))
  }

  const insertMarkdown = (prefix: string, suffix: string = "") => {
    const textarea = document.getElementById('content-editor') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = article.content
    const selectedText = text.substring(start, end)

    const newText = text.substring(0, start) + prefix + selectedText + suffix + text.substring(end)
    setArticle(prev => ({ ...prev, content: newText }))
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        insertMarkdown(`![${file.name}](${data.url})`, "")
      } else {
        const data = await res.json()
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (res.ok) {
        const data = await res.json()
        setArticle(prev => ({ ...prev, featuredImage: data.url }))
      } else {
        const data = await res.json()
        alert(data.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed')
    } finally {
      setUploading(false)
      if (coverInputRef.current) coverInputRef.current.value = ''
    }
  }

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), title: 'Bold (Ctrl+B)' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), title: 'Italic (Ctrl+I)' },
    { icon: Heading2, action: () => insertMarkdown('\n## ', '\n'), title: 'Heading 2' },
    { icon: Code, action: () => insertMarkdown('`', '`'), title: 'Inline Code' },
    { icon: List, action: () => insertMarkdown('\n- ', '\n'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => insertMarkdown('\n1. ', '\n'), title: 'Numbered List' },
    { icon: Quote, action: () => insertMarkdown('\n> ', '\n'), title: 'Quote' },
    { icon: Minus, action: () => insertMarkdown('\n---\n', ''), title: 'Divider' },
    { icon: Link2, action: () => insertMarkdown('[', '](url)'), title: 'Link' },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: 'var(--theme-primary)' }} />
      </div>
    )
  }

  const PreviewContent = ({ fullscreen = false }: { fullscreen?: boolean }) => (
    <div 
      className={`${fullscreen ? 'fixed inset-0 z-50 overflow-auto' : 'h-full'} bg-[var(--theme-background)]`}
    >
      {fullscreen && (
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-3 border-b" style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'var(--theme-background)' }}>
          <span className="font-medium" style={{ color: 'var(--theme-text)' }}>Preview Mode</span>
          <button
            onClick={() => setFullscreenPreview(false)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm"
            style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
          >
            <Minimize2 className="h-4 w-4" />
            Exit Preview
          </button>
        </div>
      )}
      <div className={fullscreen ? 'pt-0' : ''}>
        {/* Hero */}
        <div 
          className="relative py-16 md:py-20"
          style={{
            background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 5%, var(--theme-background) 50%), color-mix(in srgb, var(--theme-secondary) 5%, var(--theme-background)))`
          }}
        >
          <div className="max-w-4xl mx-auto px-6">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span 
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
              >
                {article.category}
              </span>
              {article.featured && (
                <span 
                  className="px-3 py-1 rounded-full text-sm font-medium"
                  style={{ backgroundColor: 'var(--theme-accent)', color: '#000' }}
                >
                  Featured
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight" style={{ color: 'var(--theme-text)' }}>
              {article.title || 'Untitled Article'}
            </h1>
            <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--theme-text)' }}>
              <div className="flex items-center gap-2" style={{ opacity: 0.7 }}>
                <Calendar className="h-4 w-4" />
                <span>{article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : 'Not published'}</span>
              </div>
              <div className="flex items-center gap-2" style={{ opacity: 0.7 }}>
                <Clock className="h-4 w-4" />
                <span>{article.readingTime || 5} min read</span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {article.featuredImage && (
          <div className="max-w-5xl mx-auto px-6 -mt-6 relative z-10">
            <img 
              src={article.featuredImage} 
              alt={article.title}
              className="w-full h-64 sm:h-80 md:h-96 object-cover rounded-2xl"
            />
          </div>
        )}

        {/* Content */}
        <div className="max-w-4xl mx-auto px-6 py-12">
          {article.excerpt && (
            <p className="text-xl mb-8 leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
              {article.excerpt}
            </p>
          )}
          
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown 
              rehypePlugins={[rehypeHighlight]}
              components={{
                h2: ({ children }) => {
                  const text = children?.toString() || ''
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  return <h2 id={id} className="scroll-mt-24 text-2xl font-bold mt-12 mb-4" style={{ color: 'var(--theme-text)' }}>{children}</h2>
                },
                h3: ({ children }) => {
                  const text = children?.toString() || ''
                  const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                  return <h3 id={id} className="scroll-mt-24 text-xl font-bold mt-8 mb-3" style={{ color: 'var(--theme-text)' }}>{children}</h3>
                },
                p: ({ children }) => <p className="my-4 leading-7" style={{ color: 'var(--theme-text)' }}>{children}</p>,
                a: ({ href, children }) => <a href={href} className="text-[var(--theme-primary)] hover:underline">{children}</a>,
                ul: ({ children }) => <ul className="my-4 list-disc list-inside space-y-2" style={{ color: 'var(--theme-text)' }}>{children}</ul>,
                ol: ({ children }) => <ol className="my-4 list-decimal list-inside space-y-2" style={{ color: 'var(--theme-text)' }}>{children}</ol>,
                li: ({ children }) => <li className="leading-7" style={{ color: 'var(--theme-text)' }}>{children}</li>,
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 pl-6 my-6 italic" style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-text)', opacity: 0.8 }}>
                    {children}
                  </blockquote>
                ),
                img: ({ src, alt }) => <img src={src} alt={alt} className="rounded-xl my-8 w-full" />,
                pre: ({ children }) => (
                  <pre className="rounded-lg p-3 my-4 overflow-x-auto text-sm" style={{ backgroundColor: '#1e1e1e' }}>
                    {children}
                  </pre>
                ),
                code: ({ className, children, ...props }) => {
                  const match = /language-(\w+)/.exec(className || '')
                  const isInline = !match
                  if (isInline) {
                    return (
                      <code className="px-1.5 py-0.5 rounded text-sm font-mono" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-primary)' }} {...props}>
                        {children}
                      </code>
                    )
                  }
                  return <code className={className} {...props}>{children}</code>
                },
              }}
            >
              {article.content || '*No content yet...*'}
            </ReactMarkdown>
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
              <div className="flex flex-wrap gap-2">
                {article.tags.map(tag => (
                  <span key={tag} className="px-3 py-1.5 rounded-full text-sm font-medium" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-[calc(100vh-2rem)] flex flex-col" style={{ backgroundColor: 'var(--theme-background)' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--theme-surface)' }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (hasUnsavedChanges) {
                if (window.confirm('You have unsaved changes. They will be discarded. Are you sure you want to leave?')) {
                  router.push('/admin/articles')
                }
              } else {
                router.push('/admin/articles')
              }
            }}
            className="p-2 rounded-lg transition-colors"
            style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="font-bold text-base" style={{ color: 'var(--theme-text)' }}>
              {isNew ? 'New Article' : 'Edit Article'}
            </h1>
            <div className="flex items-center gap-2">
              <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                {article.status === 'published' ? 'Published' : 'Draft'} • {article.readingTime || 5} min read
              </p>
              {article.status === 'published' && hasUnsavedChanges && (
                <span className="text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                  Unsaved changes
                </span>
              )}
              {article.status === 'published' && !hasUnsavedChanges && (
                <span className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                  Auto-save disabled
                </span>
              )}
              {!isNew && article._id && article.status !== 'published' && (
                <div className="flex items-center gap-1">
                  {autoSaveStatus === 'saving' && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                      <Loader2 className="h-3 w-3 animate-spin" />Saving...
                    </span>
                  )}
                  {autoSaveStatus === 'saved' && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#10B981' }}>
                      <Check className="h-3 w-3" />Saved
                    </span>
                  )}
                  {autoSaveStatus === 'error' && (
                    <span className="flex items-center gap-1 text-xs" style={{ color: '#EF4444' }}>
                      <AlertCircle className="h-3 w-3" />Failed
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMetadata(!showMetadata)}
            className={`p-2 rounded-lg text-sm transition-colors`}
            style={{ 
              backgroundColor: showMetadata ? 'var(--theme-primary)' : 'var(--theme-surface)',
              color: showMetadata ? '#000' : 'var(--theme-text)'
            }}
          >
            <Settings className="h-4 w-4" />
          </button>
          <button
            onClick={() => setActiveTab(activeTab === 'write' ? 'preview' : 'write')}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ 
              backgroundColor: activeTab === 'preview' ? 'var(--theme-primary)' : 'var(--theme-surface)',
              color: activeTab === 'preview' ? '#000' : 'var(--theme-text)'
            }}
          >
            {activeTab === 'write' ? (
              <>
                <Eye className="h-4 w-4" />
                Preview
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4" />
                Edit
              </>
            )}
          </button>
          <button
            onClick={() => handleSave(false)}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
            style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
          >
            <Save className="h-4 w-4" />
            {saving ? '...' : 'Save'}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ 
              background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))',
              color: '#000'
            }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Eye className="h-4 w-4" />}
            Publish
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Editor */}
        {activeTab === 'write' ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Title */}
            <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--theme-surface)' }}>
              <input
                type="text"
                value={article.title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Article title..."
                className="w-full text-2xl font-bold bg-transparent border-none focus:outline-none"
                style={{ color: 'var(--theme-text)' }}
              />
              <div className="flex items-center gap-3 mt-1">
                <div className="flex items-center gap-1.5">
                  <LinkIcon className="h-3.5 w-3.5" style={{ color: 'var(--theme-text)', opacity: 0.4 }} />
                  <input
                    type="text"
                    value={article.slug}
                    onChange={(e) => setArticle(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="article-slug"
                    className="bg-transparent border-none focus:outline-none text-xs"
                    style={{ color: 'var(--theme-text)', opacity: 0.6 }}
                  />
                </div>
                <select
                  value={article.category}
                  onChange={(e) => setArticle(prev => ({ ...prev, category: e.target.value }))}
                  className="px-2 py-1 rounded text-xs border-none focus:outline-none"
                  style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Toolbar */}
            <div className="px-4 py-2 border-b flex items-center gap-1 flex-wrap" style={{ borderColor: 'var(--theme-surface)' }}>
              {toolbarButtons.map((btn, i) => (
                <button
                  key={i}
                  onClick={btn.action}
                  title={btn.title}
                  className="p-1.5 rounded transition-colors"
                  style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                >
                  <btn.icon className="h-4 w-4" />
                </button>
              ))}
              
              <div className="h-4 w-px mx-1" style={{ backgroundColor: 'var(--theme-surface)' }} />
              
              {/* Image Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload Image"
                className="p-1.5 rounded transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
              >
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImagePlus className="h-4 w-4" />}
              </button>
              
              <div className="flex-1" />
              
              {/* Word count */}
              <span className="text-xs px-2 py-1 rounded" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)', opacity: 0.6 }}>
                {article.content.split(/\s+/).filter(Boolean).length} words
              </span>
            </div>

            {/* Content */}
            <textarea
              id="content-editor"
              value={article.content}
              onChange={(e) => setArticle(prev => ({ ...prev, content: e.target.value }))}
              placeholder="Write your article in Markdown..."
              className="flex-1 w-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              style={{ 
                backgroundColor: 'var(--theme-background)',
                color: 'var(--theme-text)'
              }}
            />
          </div>
        ) : (
          /* Preview Tab */
          <div className="flex-1 overflow-auto relative">
            <button
              onClick={() => setFullscreenPreview(true)}
              className="absolute top-4 right-4 z-10 p-2 rounded-lg shadow-lg"
              style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
            >
              <Maximize2 className="h-4 w-4" />
            </button>
            <PreviewContent />
          </div>
        )}

        {/* Metadata Panel */}
        <AnimatePresence>
          {showMetadata && (
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 300, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              className="border-l overflow-y-auto"
              style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'var(--theme-background)' }}
            >
              <div className="p-4 space-y-5">
                {/* Cover Image */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                    Cover Image
                  </h3>
                  <input
                    type="file"
                    ref={coverInputRef}
                    onChange={handleCoverUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div 
                    className="border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors"
                    style={{ borderColor: 'var(--theme-surface)' }}
                    onClick={() => coverInputRef.current?.click()}
                  >
                    {article.featuredImage ? (
                      <div className="relative">
                        <img src={article.featuredImage} alt="Cover" className="w-full h-32 object-cover rounded-lg" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setArticle(prev => ({ ...prev, featuredImage: '' })) }}
                          className="absolute top-1 right-1 p-1 rounded-full"
                          style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4">
                        <ImageIcon className="h-8 w-8 mx-auto mb-2" style={{ opacity: 0.4 }} />
                        <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                          {uploading ? 'Uploading...' : 'Click to upload cover'}
                        </p>
                        <p className="text-xs mt-1" style={{ color: 'var(--theme-text)', opacity: 0.4 }}>
                          Optional • JPG, PNG, GIF
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    type="text"
                    value={article.featuredImage}
                    onChange={(e) => setArticle(prev => ({ ...prev, featuredImage: e.target.value }))}
                    placeholder="Or paste URL..."
                    className="w-full mt-2 px-3 py-1.5 rounded-lg text-xs"
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                    Excerpt
                  </h3>
                  <textarea
                    value={article.excerpt}
                    onChange={(e) => setArticle(prev => ({ ...prev, excerpt: e.target.value }))}
                    placeholder="Brief description for article cards..."
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                  />
                </div>

                {/* Tags */}
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {article.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                        style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
                      >
                        {tag}
                        <button onClick={() => removeTag(tag)}><X className="h-3 w-3" /></button>
                      </span>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag + Enter"
                    className="w-full px-3 py-1.5 rounded-lg text-sm"
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                  />
                </div>

                {/* SEO */}
                <div className="pt-2 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                  <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                    SEO
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>SEO Title</label>
                      <input
                        type="text"
                        value={article.seo.title}
                        onChange={(e) => setArticle(prev => ({ ...prev, seo: { ...prev.seo, title: e.target.value } }))}
                        placeholder={article.title}
                        className="w-full px-3 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Meta Description</label>
                      <textarea
                        value={article.seo.description}
                        onChange={(e) => setArticle(prev => ({ ...prev, seo: { ...prev.seo, description: e.target.value } }))}
                        rows={2}
                        className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Keywords</label>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {article.seo.keywords.map(kw => (
                          <span 
                            key={kw} 
                            className="flex items-center gap-1 px-2 py-1 rounded-full text-xs"
                            style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                          >
                            {kw}
                            <button onClick={() => removeKeyword(kw)}><X className="h-3 w-3" /></button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                        placeholder="Add keyword + Enter"
                        className="w-full px-3 py-1.5 rounded-lg text-sm"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                  <input
                    type="checkbox"
                    id="featured"
                    checked={article.featured}
                    onChange={(e) => setArticle(prev => ({ ...prev, featured: e.target.checked }))}
                    className="rounded"
                  />
                  <label htmlFor="featured" className="text-sm" style={{ color: 'var(--theme-text)' }}>
                    Featured article
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
