"use client"

import { motion } from "framer-motion"

interface FooterProps {
  social?: { twitter: string; github: string; linkedin: string }
  siteVersion?: string
}

export function Footer({ social, siteVersion }: FooterProps) {
  const twitterUrl = social?.twitter ? `https://twitter.com/${social.twitter.replace("@", "")}` : "#"
  const githubUrl = social?.github ? `https://github.com/${social.github}` : "#"
  const linkedinUrl = social?.linkedin ? `https://linkedin.com/in/${social.linkedin}` : "#"

  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="pt-12 pb-8 border-t flex flex-col md:flex-row items-center justify-between gap-6 theme-border-surface"
    >
      <div className="flex gap-4">
        {[ { label: '𝕏', url: twitterUrl }, { label: 'GH', url: githubUrl }, { label: 'in', url: linkedinUrl }].map((item, i) => (
          <a key={i} href={item.url} target="_blank" rel="noopener noreferrer"
            className="w-10 h-10 rounded-lg border flex items-center justify-center font-bold transition-all theme-border-surface theme-text bg-transparent">
            {item.label}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" fill="transparent" r="20" stroke="var(--theme-surface)" strokeWidth="4" />
              <circle cx="24" cy="24" fill="transparent" r="20" stroke="var(--theme-primary)" strokeDasharray="125.6" strokeDashoffset="12.5" strokeWidth="4" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black theme-text">TOP 1%</div>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest theme-text opacity-60">Site Version</p>
            <p className="text-xs font-mono theme-text">{siteVersion || "v2024.1.0"}</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
