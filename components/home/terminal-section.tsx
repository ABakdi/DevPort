"use client"

import { motion } from "framer-motion"

const stats = [
  "Experience found: 8+ Years Professional Experience",
  "Languages: Node.js, TypeScript, Python, Go, Rust",
  "Platforms: AWS, GCP, Azure, Kubernetes",
]

const thoughts = [
  { date: "2024-10-12 14:02:00", content: "Exploring temporal database patterns for audit logs.", dateColor: "var(--theme-secondary)" },
  { date: "2024-10-10 09:15:22", content: "Decoupling monolithic architectures in Fintech.", dateColor: "var(--theme-accent)" },
]

export function TerminalSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl border overflow-hidden font-mono text-sm theme-bg-background"
      style={{ 
        borderColor: 'var(--theme-surface)',
        boxShadow: 'var(--theme-shadow)',
      }}
    >
      <div className="px-4 py-3 border-b flex items-center justify-between theme-bg-surface" style={{ borderColor: 'var(--theme-surface)' }}>
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <div className="text-[10px] font-bold uppercase tracking-widest theme-text opacity-50">interactive-shell --bash</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span className="text-[10px] text-emerald-500/80 font-bold uppercase">System_Idle</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="flex items-center gap-2">
            <span className="text-emerald-500">bakdi@portfolio:~$</span>
            <span className="theme-text">fetch stats --experience</span>
          </p>
          {stats.map((stat, index) => (
            <p key={index} className="theme-text opacity-60">[SUCCESS] {stat}</p>
          ))}
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <span className="text-emerald-500">bakdi@portfolio:~$</span>
            <span className="theme-text">tail -f latest_thoughts.log</span>
          </p>
          {thoughts.map((thought, index) => (
            <div key={index} className="p-4 rounded-lg border space-y-1" style={{ 
              backgroundColor: 'var(--theme-surface)', 
              opacity: 0.3,
              borderColor: 'var(--theme-surface)' 
            }}>
              <p className="text-[10px] font-bold" style={{ color: thought.dateColor }}>{thought.date}</p>
              <p className="theme-text opacity-80">{thought.content}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
