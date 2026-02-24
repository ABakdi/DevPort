"use client"

import { motion } from "framer-motion"

const stats = [
  "Experience found: 8+ Years Professional Experience",
  "Languages: Node.js, TypeScript, Python, Go, Rust",
  "Platforms: AWS, GCP, Azure, Kubernetes",
]

const thoughts = [
  { date: "2024-10-12 14:02:00", content: "Exploring temporal database patterns for audit logs.", dateColor: "text-indigo-400" },
  { date: "2024-10-10 09:15:22", content: "Decoupling monolithic architectures in Fintech.", dateColor: "text-rose-400" },
]

export function TerminalSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-[#0d1117] rounded-xl border border-[#1F2937] overflow-hidden font-mono text-sm shadow-2xl"
      style={{ boxShadow: "0 0 20px rgba(0, 229, 255, 0.05)" }}
    >
      <div className="bg-[#1F2937]/50 px-4 py-3 border-b border-[#1F2937] flex items-center justify-between">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500"></div>
          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
          <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
        </div>
        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">interactive-shell --bash</div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
          <span className="text-[10px] text-emerald-500/80 font-bold uppercase">System_Idle</span>
        </div>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-1">
          <p className="flex items-center gap-2">
            <span className="text-emerald-500">bakdi@portfolio:~$</span>
            <span className="text-white">fetch stats --experience</span>
          </p>
          {stats.map((stat, index) => (
            <p key={index} className="text-slate-400">[SUCCESS] {stat}</p>
          ))}
        </div>

        <div className="space-y-2">
          <p className="flex items-center gap-2">
            <span className="text-emerald-500">bakdi@portfolio:~$</span>
            <span className="text-white">tail -f latest_thoughts.log</span>
          </p>
          {thoughts.map((thought, index) => (
            <div key={index} className="bg-[#1F2937]/30 p-4 rounded-lg border border-[#1F2937]/50 space-y-1">
              <p className={`text-[10px] font-bold ${thought.dateColor}`}>{thought.date}</p>
              <p className="text-slate-300">{thought.content}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}
