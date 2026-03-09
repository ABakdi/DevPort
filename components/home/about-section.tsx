"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface AboutSectionProps {
  bio: string
  achievements: string[]
}

export function AboutSection({ bio, achievements }: AboutSectionProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="p-10 rounded-xl relative theme-bg-surface theme-border-surface border">
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter theme-text">About Me</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full theme-bg-accent opacity-10 border-theme-accent border">
          <span className="w-1.5 h-1.5 rounded-full theme-bg-accent"></span>
          <span className="text-[10px] font-bold uppercase tracking-widest theme-text-accent">Live Feed</span>
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-lg leading-relaxed theme-text opacity-70">{bio}</p>
        <ul className="space-y-4">
          {achievements.map((achievement, i) => (
            <li key={i} className="flex items-start gap-4">
              <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0 theme-text-primary" />
              <span className="theme-text">{achievement}</span>
            </li>
          ))}
        </ul>
        <div className="pt-6 flex items-center gap-6">
          <div className="flex -space-x-3">
            {[{ bg: 'var(--theme-secondary)', txt: 'RB' }, { bg: 'var(--theme-primary)', txt: 'JS' }, { bg: 'var(--theme-accent)', txt: 'AWS' }].map((item, i) => (
              <div key={i} className="w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border-4 theme-border-surface"
                style={{ backgroundColor: item.bg, color: item.bg === 'var(--theme-primary)' || item.bg === 'var(--theme-accent)' ? '#000000' : '#ffffff' }}>
                {item.txt}
              </div>
            ))}
          </div>
          <p className="text-xs italic theme-text opacity-60">Trusted by technical founders globally.</p>
        </div>
      </div>
    </motion.div>
  )
}
