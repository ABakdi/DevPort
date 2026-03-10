"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"
import { useCardAnimation, useTextAnimation } from "@/lib/use-animations"

const articles = [
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

export function RecentArticles() {
  const { hoverAnimation, glowHoverStyle, cardGlow } = useCardAnimation()
  const { textGlowStyle } = useTextAnimation()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      whileHover={hoverAnimation}
      className="p-6 rounded-xl border theme-bg-background"
      style={{ 
        borderColor: 'var(--theme-surface)',
        ...(cardGlow ? glowHoverStyle : {})
      }}
    >
      <h3 className="text-lg font-black tracking-tighter mb-6 theme-text">RECENT ARTICLES</h3>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <motion.div
            key={article.slug}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + index * 0.1 }}
          >
            <Link
              href={`/blog/${article.slug}`}
              className="block p-4 rounded-lg border border-transparent transition-all group theme-bg-surface"
              style={{ 
                borderColor: 'transparent',
              }}
            >
              <div className="flex justify-between items-start mb-1">
                <h4 
                  className="font-bold theme-text group-hover:theme-text-primary transition-colors"
                  style={textGlowStyle}
                >
                  {article.title}
                </h4>
                <ArrowUpRight className="h-4 w-4 flex-shrink-0 theme-text" style={{ opacity: 0.5 }} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest theme-text" style={{ opacity: 0.5 }}>
                {article.date} • {article.readTime}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
