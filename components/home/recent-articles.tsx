"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useCardAnimation, useTextAnimation } from "@/lib/use-animations"

interface Article {
  title: string
  date: string
  readTime: string
  slug: string
}

interface RecentArticlesProps {
  articles?: Article[]
}

const defaultArticles = [
  {
    title: "Designing resilient Event-Driven systems",
    date: "OCT 12, 2024",
    readTime: "8 MIN READ",
    slug: "designing-resilient-event-driven-systems",
  },
  {
    title: "Why your Microservices are failing at scale",
    date: "SEP 28, 2024",
    readTime: "12 MIN READ",
    slug: "microservices-failing-at-scale",
  },
  {
    title: "TypeScript 5.x features for Architects",
    date: "SEP 15, 2024",
    readTime: "5 MIN READ",
    slug: "typescript-5x-features-architects",
  },
]

export function RecentArticles({ articles }: RecentArticlesProps) {
  const { hoverAnimation, glowHoverStyle, cardGlow } = useCardAnimation()
  const { textGlowStyle } = useTextAnimation()
  
  const displayArticles = articles && articles.length > 0 
    ? articles.map(a => ({
        title: a.title,
        date: a.date.toUpperCase(),
        readTime: a.readTime.toUpperCase(),
        slug: a.slug
      }))
    : defaultArticles

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileHover={hoverAnimation}
      className="p-6 rounded-xl"
      style={{ 
        backgroundColor: 'var(--theme-surface)',
        ...(cardGlow ? glowHoverStyle : {})
      }}
    >
      <h3 className="text-lg font-black tracking-tighter mb-6" style={{ color: 'var(--theme-text)' }}>RECENT ARTICLES</h3>

      <div className="space-y-4">
        {displayArticles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <Link
              href={`/blog/${article.slug}`}
              className="block p-4 rounded-lg transition-all group"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 
                  className="font-bold transition-colors"
                  style={{ 
                    color: 'var(--theme-text)',
                    ...textGlowStyle
                  }}
                >
                  {article.title}
                </h4>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0" style={{ color: 'var(--theme-text)', opacity: 0.5 }} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                {article.date} • {article.readTime}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
