"use client"

import { motion } from "framer-motion"

interface SocialLink {
  platform: string
  username?: string
  url?: string
  enabled?: boolean
}

interface FooterProps {
  social?: SocialLink[] | { twitter?: string; github?: string; linkedin?: string }
  siteVersion?: string
}

export function Footer({ social, siteVersion }: FooterProps) {
  const getUrl = (platform: string): string => {
    if (Array.isArray(social)) {
      const link = social.find(s => s.platform?.toLowerCase() === platform.toLowerCase() && s.enabled !== false)
      if (link?.url) return link.url
      if (link?.username) {
        if (platform.toLowerCase() === 'twitter') return `https://twitter.com/${link.username.replace('@', '')}`
        if (platform.toLowerCase() === 'github') return `https://github.com/${link.username}`
        if (platform.toLowerCase() === 'linkedin') return `https://linkedin.com/in/${link.username}`
      }
    }
    return "#"
  }

  const socialLinks = [
    { icon: "𝕏", url: getUrl('twitter'), label: 'Twitter' },
    { icon: "GH", url: getUrl('github'), label: 'GitHub' },
    { icon: "in", url: getUrl('linkedin'), label: 'LinkedIn' },
  ]

  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="pt-12 pb-8"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div 
          className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8"
          style={{ borderTop: '1px solid var(--theme-surface)' }}
        >
          <div className="flex gap-4">
            {socialLinks.map((link, i) => (
              <motion.a
                key={i}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                whileHover={{ scale: 1.1, y: -3 }}
                className="w-10 h-10 rounded-lg flex items-center justify-center transition-all font-bold"
                style={{ 
                  border: '1px solid var(--theme-surface)',
                  color: 'var(--theme-text)'
                }}
              >
                {link.icon}
              </motion.a>
            ))}
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12">
                <svg className="w-full h-full transform -rotate-90">
                  <circle 
                    cx="24" cy="24" fill="transparent" r="20" 
                    stroke="var(--theme-surface)" strokeWidth="4"
                  ></circle>
                  <circle 
                    cx="24" cy="24" fill="transparent" r="20" 
                    stroke="var(--theme-primary)" strokeWidth="4"
                    strokeDasharray="125.6" 
                    strokeDashoffset="12.5"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black" style={{ color: 'var(--theme-text)' }}>
                  TOP 1%
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                  Site Version
                </p>
                <p className="text-xs font-mono" style={{ color: 'var(--theme-text)' }}>
                  {siteVersion || "v2024.1.0-alpha"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
