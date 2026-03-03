"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface AboutSectionProps {
  bio: string
  achievements: string[]
}

export function AboutSection({ bio, achievements }: AboutSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#1F2937] p-10 rounded-xl relative"
    >
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
          About Me
        </h2>
        <div className="flex items-center gap-2 bg-[#FF2D55]/10 px-3 py-1 rounded-full border border-[#FF2D55]/20">
          <span className="w-1.5 h-1.5 bg-[#FF2D55] rounded-full"></span>
          <span className="text-[10px] font-bold text-[#FF2D55] uppercase tracking-widest">Live Feed</span>
        </div>
      </div>

      <div className="space-y-6">
        <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
          {bio}
        </p>

        <ul className="space-y-4">
          {achievements.map((achievement, index) => (
            <li key={index} className="flex items-start gap-4">
              <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
              <span className="text-slate-600 dark:text-slate-300">{achievement}</span>
            </li>
          ))}
        </ul>

        <div className="pt-6 flex items-center gap-6">
          <div className="flex -space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-[10px] font-bold text-white ring-4 ring-white dark:ring-[#0D1117]">
              RB
            </div>
            <div className="w-10 h-10 rounded-full bg-[#00E5FF] flex items-center justify-center text-[10px] font-bold text-black ring-4 ring-white dark:ring-[#0D1117]">
              JS
            </div>
            <div className="w-10 h-10 rounded-full bg-[#FF2D55] flex items-center justify-center text-[10px] font-bold text-white ring-4 ring-white dark:ring-[#0D1117]">
              AWS
            </div>
          </div>
          <p className="text-xs italic text-slate-500">Trusted by technical founders globally.</p>
        </div>
      </div>
    </motion.div>
  )
}
