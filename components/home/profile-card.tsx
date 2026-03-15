"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, Mail, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCardAnimation } from "@/lib/use-animations"

interface ProfileData {
  name: string
  title: string
  location: string
  timezone: string
  email: string
  skills: string[]
}

interface ProfileCardProps {
  profile: ProfileData
}

function getTimezoneAbbreviation(timezone: string): string {
  const tzMap: Record<string, string> = {
    "Africa/Algiers": "CET", "America/New_York": "EST", "America/Los_Angeles": "PST",
    "Europe/London": "GMT", "Europe/Paris": "CET", "Asia/Tokyo": "JST", "UTC": "UTC",
  }
  return tzMap[timezone] || "UTC"
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [tzAbbr, setTzAbbr] = useState("")
  const [mounted, setMounted] = useState(false)
  const { hoverAnimation, glowHoverStyle, cardGlow } = useCardAnimation()

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      try {
        const tz = profile.timezone || "Africa/Algiers"
        const formatter = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })
        setCurrentTime(formatter.format(new Date()))
        setTzAbbr(getTimezoneAbbreviation(tz))
      } catch { setCurrentTime("--:--:--"); setTzAbbr("UTC") }
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [profile.timezone])

  const initials = profile.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "AB"

  if (!mounted) {
    return (
      <motion.div className="p-8 rounded-xl relative overflow-hidden" style={{ backgroundColor: 'var(--theme-surface)' }}>
        <div className="w-24 h-24 rounded-full" style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.2 }} />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverAnimation}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="p-8 rounded-xl relative overflow-hidden border"
      style={{ 
        backgroundColor: 'var(--theme-surface)',
        borderColor: 'var(--theme-surface)',
        ...(cardGlow ? glowHoverStyle : {})
      }}
    >
      <div className="mb-6 relative w-24 h-24">
        <div className="absolute inset-0 rounded-full blur-lg opacity-20 animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }}></div>
        <div className="w-24 h-24 rounded-full relative z-10 flex items-center justify-center" style={{ backgroundColor: 'var(--theme-surface)' }}>
          <span className="text-3xl font-bold" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>{initials}</span>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Hi, Welcome!</p>
        <h1 className="text-3xl font-black leading-tight" style={{ color: 'var(--theme-text)' }}>{profile.name || "Your Name"}</h1>
        <p className="font-bold" style={{ color: 'var(--theme-primary)' }}>{profile.title || "Your Title"}</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {profile.skills?.map((skill) => (
          <span key={skill} className="px-3 py-1 text-[10px] font-bold rounded-md" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-xs font-medium mb-8" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
        <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />{profile.location || "Location"}</div>
        <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{currentTime || "--:--"} {tzAbbr}</div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="flex-1 py-3 font-bold flex items-center justify-center gap-2" style={{ backgroundColor: 'var(--theme-primary)', color: 'black' }}>
          <Mail className="h-4 w-4" />CONTACT ME
        </Button>
        <Button variant="outline" size="icon" className="p-3" style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
