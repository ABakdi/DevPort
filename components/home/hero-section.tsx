"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { MapPin, Clock, Mail, ArrowRight, Github, Linkedin, Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCardAnimation, useTextAnimation } from "@/lib/use-animations"

interface ProfileData {
  name: string
  title: string
  location: string
  timezone: string
  email: string
  skills: string[]
  bio: string
  achievements: string[]
  social: { twitter?: string; github?: string; linkedin?: string; youtube?: string; instagram?: string }
}

interface HeroSectionProps {
  profile: ProfileData
  showProfileCard?: boolean
  showAbout?: boolean
}

function getTimezoneAbbreviation(timezone: string): string {
  const tzMap: Record<string, string> = {
    "Africa/Algiers": "CET", "America/New_York": "EST", "America/Los_Angeles": "PST",
    "Europe/London": "GMT", "Europe/Paris": "CET", "Asia/Tokyo": "JST", "UTC": "UTC",
  }
  return tzMap[timezone] || "UTC"
}

export function HeroSection({ profile, showProfileCard, showAbout }: HeroSectionProps) {
  const [currentTime, setCurrentTime] = useState("")
  const [tzAbbr, setTzAbbr] = useState("")
  const [mounted, setMounted] = useState(false)
  const { hoverAnimation, glowStyle, glowHoverStyle, cardGlow, animationStyle } = useCardAnimation()
  const { textGlowStyle, textAnimationStyle, textAnimationVariants, charVariants } = useTextAnimation()

  const nameChars = (profile.name || 'Your Name').split('')
  const titleChars = (profile.title || 'Your Professional Title').split('')

  useEffect(() => {
    setMounted(true)
    const updateTime = () => {
      try {
        const tz = profile.timezone || "Africa/Algiers"
        const formatter = new Intl.DateTimeFormat("en-US", { timeZone: tz, hour: "2-digit", minute: "2-digit", hour12: false })
        setCurrentTime(formatter.format(new Date()))
        setTzAbbr(getTimezoneAbbreviation(tz))
      } catch { setCurrentTime("--:--"); setTzAbbr("UTC") }
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [profile.timezone])

  const initials = profile.name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "AB"

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start"
    >
      <motion.div variants={itemVariants} className="lg:col-span-7 lg:pt-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
          style={{ 
            backgroundColor: 'var(--theme-surface)',
            border: '1px solid var(--theme-surface)'
          }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: 'var(--theme-primary)' }}></span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-primary)' }}>
            Available for work
          </span>
        </motion.div>

        <motion.h1 
          initial="hidden"
          animate="visible"
          variants={textAnimationStyle === "typewriter" || textAnimationStyle === "fade" || textAnimationStyle === "slide" ? textAnimationVariants : undefined}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 leading-tight"
          style={{ 
            color: 'var(--theme-text)',
            fontFamily: 'var(--theme-font-heading)',
            ...textGlowStyle
          }}
        >
          Hi, I'm{' '}
          {textAnimationStyle === "typewriter" ? (
            <motion.span style={{ color: 'var(--theme-primary)', display: 'inline-block' }}>
              {nameChars.map((char, i) => (
                <motion.span
                  key={i}
                  variants={charVariants}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.span>
          ) : (
            <span style={{ color: 'var(--theme-primary)', ...textGlowStyle }}>{profile.name || 'Your Name'}</span>
          )}
        </motion.h1>

        <motion.p 
          initial="hidden"
          animate="visible"
          variants={textAnimationStyle === "typewriter" || textAnimationStyle === "fade" || textAnimationStyle === "slide" ? textAnimationVariants : undefined}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl font-medium mb-6"
          style={{ 
            color: 'var(--theme-text)',
            opacity: 0.8,
            ...textGlowStyle
          }}
        >
          {textAnimationStyle === "typewriter" ? (
            <span>
              {titleChars.map((char, i) => (
                <motion.span
                  key={i}
                  variants={charVariants}
                  style={{ display: 'inline-block' }}
                >
                  {char}
                </motion.span>
              ))}
            </span>
          ) : (
            profile.title || 'Your Professional Title'
          )}
        </motion.p>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-lg leading-relaxed mb-8 max-w-2xl"
          style={{ 
            color: 'var(--theme-text)',
            opacity: 0.6 
          }}
        >
          {profile.bio || 'Your professional bio goes here. Describe your expertise, passion, and what makes you unique in your field.'}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap gap-2 mb-8"
        >
          {profile.skills?.slice(0, 6).map((skill) => (
            <span 
              key={skill} 
              className="px-4 py-2 text-sm font-medium rounded-lg"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
                color: 'var(--theme-text)',
                border: '1px solid var(--theme-surface)'
              }}
            >
              {skill}
            </span>
          ))}
          {profile.skills?.length > 6 && (
            <span 
              className="px-4 py-2 text-sm font-medium rounded-lg"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
                color: 'var(--theme-primary)',
                border: '1px solid var(--theme-surface)'
              }}
            >
              +{profile.skills.length - 6} more
            </span>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center gap-4"
        >
          <Button 
            className="group px-6 py-3 font-bold text-sm flex items-center gap-2"
            style={{ 
              backgroundColor: 'var(--theme-primary)',
              color: '#000000'
            }}
          >
            <Mail className="h-4 w-4" />
            Get In Touch
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>

          <div className="flex items-center gap-3">
            {profile.social?.github && (
              <a 
                href={profile.social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)'
                }}
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {profile.social?.linkedin && (
              <a 
                href={profile.social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)'
                }}
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {profile.social?.twitter && (
              <a 
                href={profile.social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2.5 rounded-lg transition-colors hover:opacity-80"
                style={{ 
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)'
                }}
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>

          {mounted && (
            <div 
              className="flex items-center gap-2 text-sm ml-auto"
              style={{ color: 'var(--theme-text)', opacity: 0.5 }}
            >
              <MapPin className="h-4 w-4" />
              <span>{profile.location || 'Location'}</span>
              <span>•</span>
              <Clock className="h-4 w-4" />
              <span>{currentTime || '--:--'} {tzAbbr}</span>
            </div>
          )}
        </motion.div>
      </motion.div>

        {(showProfileCard || showAbout) && (
        <motion.div variants={itemVariants} className="lg:col-span-5 space-y-6">
          {showProfileCard && (
            <motion.div
              whileHover={hoverAnimation}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="p-6 rounded-2xl cursor-pointer"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
                border: '1px solid var(--theme-surface)',
                ...(cardGlow ? glowHoverStyle : {})
              }}
            >
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="w-16 h-16 rounded-xl flex items-center justify-center text-2xl font-black"
                  style={{ 
                    backgroundColor: 'var(--theme-primary)',
                    color: '#000000'
                  }}
                >
                  {initials}
                </div>
                <div>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>
                    {profile.name || 'Your Name'}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--theme-primary)' }}>
                    {profile.title || 'Your Title'}
                  </p>
                </div>
              </div>
              <p 
                className="text-sm leading-relaxed mb-4"
                style={{ color: 'var(--theme-text)', opacity: 0.7 }}
              >
                {(profile.bio || 'Your bio goes here...').slice(0, 120)}...
              </p>
              {profile.achievements && profile.achievements.length > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                    Key Achievement
                  </p>
                  <p className="text-sm font-medium" style={{ color: 'var(--theme-accent)' }}>
                    {profile.achievements[0]}
                  </p>
                </div>
              )}
            </motion.div>
          )}

          {showAbout && profile.achievements && profile.achievements.length > 0 && (
            <motion.div
              whileHover={hoverAnimation}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="p-6 rounded-2xl cursor-pointer"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
                border: '1px solid var(--theme-surface)',
                ...(cardGlow ? glowHoverStyle : {})
              }}
            >
              <h3 className="font-bold mb-4" style={{ color: 'var(--theme-text)' }}>
                What I Bring
              </h3>
              <ul className="space-y-3">
                {profile.achievements.slice(0, 3).map((achievement, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span 
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: 'var(--theme-primary)', color: '#000000' }}
                    >
                      <span className="text-xs font-bold">{i + 1}</span>
                    </span>
                    <span className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>
                      {achievement}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </motion.div>
      )}
    </motion.section>
  )
}
