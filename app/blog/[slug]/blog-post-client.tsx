"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import { motion, AnimatePresence } from "framer-motion"
import { 
  ChevronLeft, ChevronRight, Twitter, Linkedin, Link2, Copy, Check,
  Clock, Calendar, Eye, Share2, MessageCircle, ThumbsUp, ArrowLeft,
  Menu, X
} from "lucide-react"

interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  content: string
  featuredImage: string
  category: string
  tags: string[]
  author: { name: string; avatar: string }
  status: string
  publishedAt: string
  readingTime: number
  views: number
  featured: boolean
  seo: { title: string; description: string; keywords: string[] }
}

interface RelatedArticle {
  _id: string
  title: string
  slug: string
  excerpt: string
  category: string
  publishedAt: string
  readingTime: number
}

export function BlogPostClient({ article, relatedArticles }: { article: Article; relatedArticles: RelatedArticle[] }) {
  const [activeHeading, setActiveHeading] = useState<string>("")
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([])
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Generate headings from article content
  useEffect(() => {
    if (!article.content) {
      setHeadings([])
      return
    }
    
    // Extract h2 and h3 headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm
    const extractedHeadings: { id: string; text: string; level: number }[] = []
    let match
    
    while ((match = headingRegex.exec(article.content)) !== null) {
      const level = match[1].length // 2 for h2, 3 for h3
      const text = match[2].trim()
      const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      extractedHeadings.push({ id, text, level })
    }
    
    setHeadings(extractedHeadings)
  }, [article.content])

  // Track active heading on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (headings.length === 0) return
      
      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        const el = document.getElementById(heading.id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 120) {
            setActiveHeading(heading.id)
            break
          }
        }
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [headings])

  useEffect(() => {
    setMounted(true)
  }, [])

  const formattedDate = article.publishedAt 
    ? new Date(article.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : ''

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://yoursite.com/blog/${article.slug}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/projects", label: "Work" },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)' }}>
      {/* Navigation */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ 
          backgroundColor: 'color-mix(in srgb, var(--theme-background) 80%, transparent)',
          borderColor: 'var(--theme-surface)'
        }}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              D
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ color: 'var(--theme-text)' }}>
              DevPort
            </span>
          </Link>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-[var(--theme-primary)]"
                style={{ color: 'var(--theme-text)', opacity: 0.7 }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ color: 'var(--theme-text)' }}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t overflow-hidden"
              style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'var(--theme-background)' }}
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map(link => (
                  <Link 
                    key={link.href} 
                    href={link.href}
                    className="block py-2 text-sm font-medium"
                    style={{ color: 'var(--theme-text)' }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <div 
        className="relative py-16 md:py-24 overflow-hidden"
        style={{
          background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 5%, var(--theme-background) 50%), color-mix(in srgb, var(--theme-secondary) 5%, var(--theme-background)))`
        }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, var(--theme-text) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
            <Link href="/" className="hover:text-[var(--theme-primary)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[var(--theme-primary)] transition-colors">Blog</Link>
            <span>/</span>
            <span>{article.category}</span>
          </nav>

          {/* Category & Featured */}
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

          {/* Title */}
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 leading-tight"
            style={{ color: 'var(--theme-text)' }}
          >
            {article.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6" style={{ color: 'var(--theme-text)' }}>
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm"
                style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
              >
                {article.author?.name?.[0] || 'A'}
              </div>
              <div>
                <p className="font-medium text-sm">{article.author?.name || 'Admin'}</p>
                <p className="text-xs" style={{ opacity: 0.6 }}>Author</p>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px" style={{ backgroundColor: 'var(--theme-surface)' }} />
            <div className="flex items-center gap-2 text-sm" style={{ opacity: 0.7 }}>
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="hidden sm:block h-8 w-px" style={{ backgroundColor: 'var(--theme-surface)' }} />
            <div className="flex items-center gap-2 text-sm" style={{ opacity: 0.7 }}>
              <Clock className="h-4 w-4" />
              <span>{article.readingTime || 5} min read</span>
            </div>
            <div className="hidden sm:block h-8 w-px" style={{ backgroundColor: 'var(--theme-surface)' }} />
            <div className="flex items-center gap-2 text-sm" style={{ opacity: 0.7 }}>
              <Eye className="h-4 w-4" />
              <span>{article.views || 0} views</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {article.featuredImage && (
        <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
          <img 
            src={article.featuredImage} 
            alt={article.title}
            className="w-full h-64 sm:h-80 md:h-[500px] object-cover rounded-2xl"
          />
        </div>
      )}

      {/* Main Content */}
      <div className="w-full py-12">
        <div className="max-w-7xl mx-auto px-6 flex gap-12">
          {/* Table of Contents - Left Sidebar */}
          <aside className="hidden xl:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <div className="p-4 rounded-xl border" style={{ borderColor: 'var(--theme-surface)' }}>
                <h4 className="font-semibold mb-4 text-sm uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                  On this page
                </h4>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {headings.map((heading, idx) => (
                    <a
                      key={idx}
                      href={`#${heading.id}`}
                      className={`block text-sm py-2 px-3 rounded transition-all ${
                        heading.level === 3 ? 'ml-2 text-xs' : ''
                      }`}
                      style={{ 
                        color: activeHeading === heading.id ? 'var(--theme-primary)' : 'var(--theme-text)',
                        backgroundColor: activeHeading === heading.id ? 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' : 'transparent',
                        opacity: activeHeading === heading.id ? 1 : 0.6
                      }}
                    >
                      {heading.text}
                    </a>
                  ))}
                </nav>
              </div>
            </div>
          </aside>

          {/* Article Content */}
          <article className="flex-1 min-w-0 max-w-4xl">
            {/* Excerpt */}
            {article.excerpt && (
              <p 
                className="text-xl mb-8 leading-relaxed"
                style={{ color: 'var(--theme-text)', opacity: 0.8 }}
              >
                {article.excerpt}
              </p>
            )}

            {/* Share */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b" style={{ borderColor: 'var(--theme-surface)' }}>
              <span className="text-sm font-medium" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Share:</span>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://yoursite.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors hover:scale-110"
                style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://yoursite.com/blog/${article.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg transition-colors hover:scale-110"
                style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg transition-colors hover:scale-110"
                style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Markdown Content */}
            <div 
              className="article-content prose prose-lg max-w-none prose-headings:font-bold prose-a:text-[var(--theme-primary)] prose-img:rounded-xl prose-pre:border-0 prose-pre:m-0 prose-pre:p-0"
              style={{ 
                '--tw-prose-body': 'var(--theme-text)',
                '--tw-prose-headings': 'var(--theme-text)',
                '--tw-prose-links': 'var(--theme-primary)',
                '--tw-prose-code': 'var(--theme-primary)',
                '--tw-prose-pre-bg': '#1e1e1e',
                '--tw-prose-pre-code': 'var(--theme-text)',
              } as React.CSSProperties}
            >
              <ReactMarkdown 
                rehypePlugins={[rehypeHighlight]}
                components={{
                  h2: ({ children }) => {
                    const text = children?.toString() || ''
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    return <h2 id={id} className="scroll-mt-24 text-2xl font-bold mt-12 mb-4 group" style={{ color: 'var(--theme-text)' }}>
                      {children}
                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm" style={{ color: 'var(--theme-primary)' }}>#</a>
                    </h2>
                  },
                  h3: ({ children }) => {
                    const text = children?.toString() || ''
                    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                    return <h3 id={id} className="scroll-mt-24 text-xl font-bold mt-8 mb-3 group" style={{ color: 'var(--theme-text)' }}>
                      {children}
                      <a href={`#${id}`} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-sm" style={{ color: 'var(--theme-primary)' }}>#</a>
                    </h3>
                  },
                  p: ({ children }) => <p className="my-4 leading-7" style={{ color: 'var(--theme-text)' }}>{children}</p>,
                  a: ({ href, children }) => <a href={href} className="text-[var(--theme-primary)] hover:underline" style={{ color: 'var(--theme-primary)' }}>{children}</a>,
                  ul: ({ children }) => <ul className="my-4 list-disc list-inside space-y-2" style={{ color: 'var(--theme-text)' }}>{children}</ul>,
                  ol: ({ children }) => <ol className="my-4 list-decimal list-inside space-y-2" style={{ color: 'var(--theme-text)' }}>{children}</ol>,
                  li: ({ children }) => <li className="leading-7" style={{ color: 'var(--theme-text)' }}>{children}</li>,
                  blockquote: ({ children }) => (
                    <blockquote 
                      className="border-l-4 pl-6 my-6 italic"
                      style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-text)', opacity: 0.8 }}
                    >
                      {children}
                    </blockquote>
                  ),
                  img: ({ src, alt }) => (
                    <img src={src} alt={alt} className="rounded-xl my-8 w-full" />
                  ),
                  pre: ({ children }) => (
                    <pre 
                      className="rounded-lg p-3 my-4 overflow-x-auto text-sm"
                      style={{ backgroundColor: '#1e1e1e' }}
                    >
                      {children}
                    </pre>
                  ),
                  code: ({ className, children, ...props }) => {
                    const match = /language-(\w+)/.exec(className || '')
                    const isInline = !match
                    if (isInline) {
                      return (
                        <code 
                          className="px-1.5 py-0.5 rounded text-sm font-mono"
                          style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-primary)' }}
                          {...props}
                        >
                          {children}
                        </code>
                      )
                    }
                    return (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {article.content}
              </ReactMarkdown>
            </div>

            {/* Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-sm font-medium"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Bio */}
            <div 
              className="mt-12 p-6 rounded-2xl border"
              style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'transparent' }}
            >
              <div className="flex items-start gap-4">
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center font-bold text-xl flex-shrink-0"
                  style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
                >
                  {article.author?.name?.[0] || 'A'}
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>
                    {article.author?.name || 'Admin'}
                  </p>
                  <p className="text-sm mt-1" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
                    Technical writer and developer sharing insights on software engineering, 
                    best practices, and modern web development.
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <div className="py-16 border-t" style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'var(--theme-background)' }}>
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-8" style={{ color: 'var(--theme-text)' }}>
              Related Articles
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedArticles.map(related => (
                <Link
                  key={related._id}
                  href={`/blog/${related.slug}`}
                  className="group"
                >
                  <article 
                    className="rounded-2xl overflow-hidden h-full transition-all group-hover:scale-[1.02]"
                    style={{ 
                      backgroundColor: 'var(--theme-background)',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <div className="p-6">
                      <span 
                        className="text-xs font-medium"
                        style={{ color: 'var(--theme-primary)' }}
                      >
                        {related.category}
                      </span>
                      <h3 
                        className="font-bold mt-2 line-clamp-2 group-hover:text-[var(--theme-primary)]"
                        style={{ color: 'var(--theme-text)' }}
                      >
                        {related.title}
                      </h3>
                      <p 
                        className="text-sm mt-2 line-clamp-2"
                        style={{ color: 'var(--theme-text)', opacity: 0.6 }}
                      >
                        {related.excerpt}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                        <span>{related.readingTime} min read</span>
                        <span>
                          {related.publishedAt 
                            ? new Date(related.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                            : ''
                          }
                        </span>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="py-12 border-t" style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'var(--theme-background)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
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
              {navLinks.map(link => (
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
