"use client"

import { motion } from "framer-motion"
import { CheckCircle } from "lucide-react"

interface AboutSectionProps {
  bio: string
  achievements: string[]
  badges?: string[]
}

export function AboutSection({ bio, achievements, badges }: AboutSectionProps) {
  const displayBio = bio || "My passion for engineering goes back to the era of assembly and early web protocols. Today I architect high-performance SaaS solutions that bridge the gap between user experience and system integrity."
  
  const displayAchievements = achievements || []
  const displayBadges = badges || []

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.1 }}
      className="p-10 rounded-xl relative border"
      style={{ 
        backgroundColor: 'var(--theme-surface)',
        borderColor: 'var(--theme-surface)'
      }}
    >
      <div className="flex justify-between items-start mb-8">
        <h2 className="text-2xl font-black uppercase tracking-tighter" style={{ color: 'var(--theme-text)' }}>About Me</h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full" style={{ backgroundColor: 'var(--theme-accent)', opacity: 0.1 }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-accent)' }}></span>
          <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-accent)' }}>Live Feed</span>
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-lg leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>{displayBio}</p>
        
        {displayAchievements.length > 0 && (
          <ul className="space-y-4">
            {displayAchievements.map((achievement, i) => (
              <li key={i} className="flex items-start gap-4">
                <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" style={{ color: '#10B981' }} />
                <span style={{ color: 'var(--theme-text)' }}>{achievement}</span>
              </li>
            ))}
          </ul>
        )}

        {displayBadges.length > 0 && (
          <div className="pt-4 flex flex-wrap gap-2">
            {displayBadges.map((badge, i) => (
              <span 
                key={i}
                className="px-3 py-1 text-[10px] font-bold rounded-md"
                style={{ 
                  backgroundColor: 'var(--theme-background)',
                  color: 'var(--theme-text)',
                  border: '1px solid var(--theme-surface)'
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}
