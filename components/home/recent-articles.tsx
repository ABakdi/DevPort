"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

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
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#1F2937] p-6 rounded-xl"
    >
      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter mb-6">RECENT ARTICLES</h3>

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
              className="block p-4 bg-slate-50 dark:bg-[#0a0a0a] rounded-lg border border-transparent hover:border-[#00E5FF]/50 transition-all group"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-[#00E5FF] transition-colors">
                  {article.title}
                </h4>
                <ArrowUpRight className="h-4 w-4 text-slate-500 flex-shrink-0" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                {article.date} • {article.readTime}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
