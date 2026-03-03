"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Save, Plus, X, Loader2, Twitter, Github, Linkedin, Youtube, Instagram, Globe, Check, Search, User, MapPin, Mail, Phone, FileText, Wrench, Award, Code, Layout, Sparkles, Crown, Zap, CheckCircle2, AlertTriangle, ArrowDown, Briefcase, FolderKanban, MessageSquare
} from "lucide-react"
import { cn } from "@/lib/utils"

const TIMEZONES = [
  { value: "Africa/Algiers", label: "Algiers (GMT+1)" },
  { value: "Africa/Cairo", label: "Cairo (GMT+2)" },
  { value: "Africa/Lagos", label: "Lagos (GMT+1)" },
  { value: "Africa/Johannesburg", label: "Johannesburg (GMT+2)" },
  { value: "America/New_York", label: "New York (EST)" },
  { value: "America/Chicago", label: "Chicago (CST)" },
  { value: "America/Denver", label: "Denver (MST)" },
  { value: "America/Los_Angeles", label: "Los Angeles (PST)" },
  { value: "America/Sao_Paulo", label: "São Paulo (GMT-3)" },
  { value: "America/Mexico_City", label: "Mexico City (CST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Asia/Kolkata", label: "Mumbai/India (IST)" },
  { value: "Asia/Bangkok", label: "Bangkok (ICT)" },
  { value: "Asia/Singapore", label: "Singapore (SGT)" },
  { value: "Asia/Hong_Kong", label: "Hong Kong (HKT)" },
  { value: "Asia/Tokyo", label: "Tokyo (JST)" },
  { value: "Asia/Seoul", label: "Seoul (KST)" },
  { value: "Europe/London", label: "London (GMT)" },
  { value: "Europe/Paris", label: "Paris (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Europe/Moscow", label: "Moscow (MSK)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Australia/Melbourne", label: "Melbourne (AEST)" },
  { value: "Pacific/Auckland", label: "Auckland (NZST)" },
  { value: "UTC", label: "UTC" },
]

const SOCIAL_PLATFORMS = [
  { key: "twitter", label: "Twitter/X", icon: Twitter, placeholder: "@username", color: "#1DA1F2" },
  { key: "github", label: "GitHub", icon: Github, placeholder: "username", color: "#ffffff" },
  { key: "linkedin", label: "LinkedIn", icon: Linkedin, placeholder: "username", color: "#0A66C2" },
  { key: "youtube", label: "YouTube", icon: Youtube, placeholder: "channel name", color: "#FF0000" },
  { key: "instagram", label: "Instagram", icon: Instagram, placeholder: "username", color: "#E4405F" },
  { key: "custom", label: "Custom Link", icon: Globe, placeholder: "https://...", color: "#8B5CF6" },
]

interface SocialLink {
  platform: string
  username: string
  url: string
  enabled: boolean
  icon: string
}

interface ProfileData {
  _id?: string
  name: string
  title: string
  bio: string
  location: string
  timezone: string
  email: string
  phone: string
  skills: string[]
  achievements: string[]
  techStack: string[]
  socialLinks: SocialLink[]
  siteVersion: string
  showHero: boolean
  showProfileCard: boolean
  showAbout: boolean
  showTerminal: boolean
  showToolbox: boolean
  showFeaturedProjects: boolean
  showRecentArticles: boolean
  showFooter: boolean
}

const defaultProfile: ProfileData = {
  name: "",
  title: "",
  bio: "",
  location: "",
  timezone: "Africa/Algiers",
  email: "",
  phone: "",
  skills: [],
  achievements: [],
  techStack: [],
  socialLinks: [],
  siteVersion: "v2024.1.0-alpha",
  showHero: true,
  showProfileCard: true,
  showAbout: true,
  showTerminal: true,
  showToolbox: true,
  showFeaturedProjects: true,
  showRecentArticles: true,
  showFooter: true,
}

interface ValidationErrors {
  name?: string
  title?: string
  bio?: string
  email?: string
  phone?: string
  [key: string]: string | undefined
}

const sections = [
  { id: "basic", label: "Basic Info", icon: User },
  { id: "bio", label: "Bio", icon: FileText },
  { id: "social", label: "Social Links", icon: Globe },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "achievements", label: "Achievements", icon: Award },
  { id: "techstack", label: "Tech Stack", icon: Code },
  { id: "sections", label: "Page Sections", icon: Layout },
]

export default function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [newSkill, setNewSkill] = useState("")
  const [newAchievement, setNewAchievement] = useState("")
  const [newTech, setNewTech] = useState("")
  const [timezoneSearch, setTimezoneSearch] = useState("")
  const [activeSection, setActiveSection] = useState("basic")
  
  const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          const sectionFields = ['showHero', 'showProfileCard', 'showAbout', 'showTerminal', 'showToolbox', 'showFeaturedProjects', 'showRecentArticles', 'showFooter']
          const processedData: Partial<ProfileData> = { ...data }
          
          sectionFields.forEach(field => {
            if (processedData[field as keyof ProfileData] === undefined) {
              (processedData as Record<string, unknown>)[field] = true
            }
          })
          
          setProfile({ 
            ...defaultProfile, 
            ...processedData, 
            socialLinks: data.socialLinks || [],
            social: undefined,
          } as ProfileData)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const sectionIds = sections.map(s => s.id)
      const scrollPosition = window.scrollY + window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i]
        const element = sectionRefs.current[id]
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          
          if (i === sectionIds.length - 1) {
            if (elementTop <= window.scrollY + 150 || scrollPosition >= documentHeight - 100) {
              setActiveSection(id)
              return
            }
          } else if (rect.top <= 150 && rect.bottom >= 100) {
            setActiveSection(id)
            return
          }
        }
      }
      
      for (const id of sectionIds) {
        const element = sectionRefs.current[id]
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 150) {
            setActiveSection(id)
            return
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("resize", handleScroll, { passive: true })
    handleScroll()
    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleScroll)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = sectionRefs.current[sectionId]
    if (element) {
      const offset = 100
      const top = element.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  const validate = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    if (!profile.name.trim()) {
      newErrors.name = "Name is required"
    } else if (profile.name.length > 100) {
      newErrors.name = "Name cannot exceed 100 characters"
    }
    
    if (!profile.title.trim()) {
      newErrors.title = "Title is required"
    } else if (profile.title.length > 100) {
      newErrors.title = "Title cannot exceed 100 characters"
    }
    
    if (profile.bio.length > 1000) {
      newErrors.bio = "Bio cannot exceed 1000 characters"
    }
    
    if (profile.email && !/^\S+@\S+\.\S+$/.test(profile.email)) {
      newErrors.email = "Please enter a valid email"
    }
    
    if (profile.phone && profile.phone.length > 20) {
      newErrors.phone = "Phone number cannot exceed 20 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    
    setSaving(true)
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      })

      if (res.ok) {
        setSaved(true)
        setErrors({})
        setTimeout(() => setSaved(false), 3000)
      } else {
        const data = await res.json()
        setErrors({ name: data.error || "Failed to save" })
      }
    } catch {
      setErrors({ name: "Failed to save profile" })
    }
    setSaving(false)
  }

  const addSkill = () => {
    if (newSkill.trim() && profile.skills.length < 20 && newSkill.length <= 50) {
      if (!profile.skills.includes(newSkill.trim())) {
        setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] })
      }
      setNewSkill("")
    }
  }

  const removeSkill = (skill: string) => {
    setProfile({ ...profile, skills: profile.skills.filter((s) => s !== skill) })
  }

  const addAchievement = () => {
    if (newAchievement.trim() && profile.achievements.length < 10 && newAchievement.length <= 300) {
      setProfile({ ...profile, achievements: [...profile.achievements, newAchievement.trim()] })
      setNewAchievement("")
    }
  }

  const removeAchievement = (achievement: string) => {
    setProfile({ ...profile, achievements: profile.achievements.filter((a) => a !== achievement) })
  }

  const addTech = () => {
    if (newTech.trim() && profile.techStack.length < 30 && newTech.length <= 30) {
      if (!profile.techStack.includes(newTech.trim())) {
        setProfile({ ...profile, techStack: [...profile.techStack, newTech.trim()] })
      }
      setNewTech("")
    }
  }

  const removeTech = (tech: string) => {
    setProfile({ ...profile, techStack: profile.techStack.filter((t) => t !== tech) })
  }

  const addSocialLink = (platform: string) => {
    if (!profile.socialLinks.find(s => s.platform === platform)) {
      setProfile({
        ...profile,
        socialLinks: [...profile.socialLinks, { platform, username: "", url: "", enabled: true, icon: platform }]
      })
    }
  }

  const removeSocialLink = (platform: string) => {
    setProfile({
      ...profile,
      socialLinks: profile.socialLinks.filter(s => s.platform !== platform)
    })
  }

  const updateSocialLink = (platform: string, field: keyof SocialLink, value: string | boolean) => {
    setProfile({
      ...profile,
      socialLinks: profile.socialLinks.map(s => 
        s.platform === platform ? { ...s, [field]: value } : s
      )
    })
  }

  const toggleSection = (section: string) => {
    setProfile({ ...profile, [section]: !profile[section as keyof ProfileData] })
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#1F2937] border-t-[#00E5FF] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-[#00E5FF] animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400">Loading profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 pb-32">
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/50 text-emerald-400 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/20 backdrop-blur-xl"
          >
            <CheckCircle2 className="h-5 w-5" />
            <span className="font-semibold">Profile saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-black text-white">Profile Settings</h1>
            <div className="px-2 py-0.5 bg-gradient-to-r from-[#00E5FF]/20 to-[#8B5CF6]/20 border border-[#00E5FF]/30 rounded-full">
              <span className="text-xs font-medium text-[#00E5FF]">Admin</span>
            </div>
          </div>
          <p className="text-slate-400">Manage your public profile and portfolio information</p>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-64 flex-shrink-0"
        >
          <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-3 sticky top-24">
            <div className="mb-3 px-3">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sections</p>
            </div>
            <nav className="space-y-1">
              {sections.map((section) => {
                const isActive = activeSection === section.id
                return (
                  <motion.button
                    key={section.id}
                    onClick={() => scrollToSection(section.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-[#00E5FF]/10 to-transparent text-[#00E5FF]"
                        : "text-slate-400 hover:text-white hover:bg-[#1F2937]/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00E5FF] to-[#8B5CF6] rounded-r-full"
                      />
                    )}
                    <section.icon className={cn("h-4 w-4", isActive ? "text-[#00E5FF]" : "")} />
                    <span className={cn("font-medium text-sm", isActive ? "text-white" : "")}>
                      {section.label}
                    </span>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="ml-auto"
                      >
                        <Zap className="h-3 w-3 text-[#00E5FF] animate-pulse" />
                      </motion.div>
                    )}
                  </motion.button>
                )
              })}
            </nav>
            <div className="mt-4 pt-4 border-t border-[#1F2937] space-y-2">
              <motion.button
                onClick={handleSave}
                disabled={saving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full group relative px-4 py-3 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-black font-bold rounded-xl shadow-lg shadow-[#00E5FF]/20 hover:shadow-[#00E5FF]/40 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : saved ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Save className="h-4 w-4 group-hover:scale-110 transition-transform" />
                )}
                <span className="text-sm">{saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}</span>
              </motion.button>
              <button
                onClick={() => scrollToSection("sections")}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs text-slate-500 hover:text-white transition-colors"
              >
                <ArrowDown className="h-3 w-3" />
                Scroll to bottom
              </button>
            </div>
          </div>
        </motion.div>

        <div className="flex-1 space-y-6">
          <motion.div 
            id="basic"
            ref={(el) => { sectionRefs.current["basic"] = el }}
            className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#F59E0B]" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                <User className="h-5 w-5 text-[#00E5FF]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Basic Information</h2>
                <p className="text-sm text-slate-400">Your public identity</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Crown className="h-3 w-3 text-[#F59E0B]" /> Full Name *
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  maxLength={100}
                  className={cn(
                    "w-full h-12 px-4 rounded-xl bg-[#1F2937] border-2 transition-all focus:outline-none",
                    errors.name 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-transparent focus:border-[#00E5FF]',
                    "text-white placeholder-slate-500"
                  )}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" /> {errors.name}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Award className="h-3 w-3 text-[#8B5CF6]" /> Title *
                </label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  maxLength={100}
                  className={cn(
                    "w-full h-12 px-4 rounded-xl bg-[#1F2937] border-2 transition-all focus:outline-none",
                    errors.title 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-transparent focus:border-[#00E5FF]',
                    "text-white placeholder-slate-500"
                  )}
                  placeholder="Full Stack Developer"
                />
                {errors.title && (
                  <motion.p 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-xs flex items-center gap-1"
                  >
                    <AlertTriangle className="h-3 w-3" /> {errors.title}
                  </motion.p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-[#FF2D55]" /> Location
                </label>
                <input
                  type="text"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  maxLength={100}
                  className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border-2 border-transparent focus:border-[#00E5FF] text-white placeholder-slate-500 focus:outline-none transition-all"
                  placeholder="San Francisco, CA"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Globe className="h-3 w-3 text-[#10B981]" /> Timezone
                </label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 z-10" />
                  <input
                    type="text"
                    value={timezoneSearch}
                    onChange={(e) => setTimezoneSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full h-12 pl-11 pr-4 rounded-xl bg-[#1F2937] border-2 border-transparent focus:border-[#00E5FF] text-white placeholder-slate-500 focus:outline-none transition-all"
                  />
                </div>
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border-2 border-transparent focus:border-[#00E5FF] text-white focus:outline-none transition-all"
                >
                  {TIMEZONES.filter(tz => 
                    tz.label.toLowerCase().includes(timezoneSearch.toLowerCase()) ||
                    tz.value.toLowerCase().includes(timezoneSearch.toLowerCase())
                  ).map((tz) => (
                    <option key={tz.value} value={tz.value}>{tz.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Mail className="h-3 w-3 text-[#00E5FF]" /> Email
                </label>
                <input
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className={cn(
                    "w-full h-12 px-4 rounded-xl bg-[#1F2937] border-2 transition-all focus:outline-none",
                    errors.email 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-transparent focus:border-[#00E5FF]',
                    "text-white placeholder-slate-500"
                  )}
                  placeholder="john@example.com"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <Phone className="h-3 w-3 text-[#F59E0B]" /> Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  maxLength={20}
                  className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border-2 border-transparent focus:border-[#00E5FF] text-white placeholder-slate-500 focus:outline-none transition-all"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            id="bio"
            ref={(el) => { sectionRefs.current["bio"] = el }}
            className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] via-[#00E5FF] to-[#8B5CF6]" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#10B981]/20 to-[#00E5FF]/20 rounded-xl flex items-center justify-center">
                  <FileText className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Bio & Story</h2>
                  <p className="text-sm text-slate-400">Tell visitors about yourself</p>
                </div>
              </div>
              <div className="px-3 py-1.5 bg-[#1F2937] rounded-lg">
                <span className={`text-sm font-mono ${profile.bio.length > 900 ? 'text-red-400' : 'text-slate-400'}`}>
                  {profile.bio.length}/1000
                </span>
              </div>
            </div>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value.slice(0, 1000) })}
              rows={8}
              maxLength={1000}
              className={cn(
                "w-full px-5 py-4 rounded-2xl bg-[#1F2937] border-2 transition-all focus:outline-none resize-none",
                errors.bio 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-transparent focus:border-[#10B981]',
                "text-white placeholder-slate-500"
              )}
              placeholder="Write your bio... Tell visitors who you are, what you do, and what makes you unique."
            />
            {errors.bio && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-xs mt-2 flex items-center gap-1"
              >
                <AlertTriangle className="h-3 w-3" /> {errors.bio}
              </motion.p>
            )}
            <div className="mt-4 flex flex-wrap gap-2">
              {["Open to work", "Freelance available", "Remote only", "Full-time"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    if (!profile.bio.includes(tag)) {
                      setProfile({ ...profile, bio: profile.bio + (profile.bio ? " " : "") + tag })
                    }
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-slate-400 bg-[#1F2937] rounded-full hover:bg-[#2a3544] hover:text-white transition-all"
                >
                  + {tag}
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div 
            id="social"
            ref={(el) => { sectionRefs.current["social"] = el }}
            className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#FF2D55]" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                <Globe className="h-5 w-5 text-[#00E5FF]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Social Links</h2>
                <p className="text-sm text-slate-400">Connect your social profiles</p>
              </div>
            </div>
            <div className="space-y-3">
              {SOCIAL_PLATFORMS.map((platform) => {
                const existingLink = profile.socialLinks.find(s => s.platform === platform.key)
                const isCustom = platform.key === "custom"
                return (
                  <motion.div
                    key={platform.key}
                    layout
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl transition-all",
                      existingLink 
                        ? "bg-gradient-to-r from-[#1F2937] to-transparent border border-[#1F2937]" 
                        : "bg-[#0D1117] border border-[#1F2937]/50"
                    )}
                  >
                    {existingLink ? (
                      <>
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: `${platform.color}20` }}
                        >
                          <platform.icon className="h-5 w-5" style={{ color: platform.color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-white mb-2">{platform.label}</p>
                          {isCustom ? (
                            <input
                              type="url"
                              value={existingLink.url}
                              onChange={(e) => updateSocialLink(platform.key, "url", e.target.value)}
                              placeholder="https://yourwebsite.com"
                              className="w-full h-10 px-4 rounded-lg bg-[#0D1117] border border-[#1F2937] text-white text-sm focus:outline-none focus:border-[#00E5FF]"
                            />
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="text-slate-500 text-sm">@</span>
                              <input
                                type="text"
                                value={existingLink.username}
                                onChange={(e) => updateSocialLink(platform.key, "username", e.target.value)}
                                placeholder={platform.placeholder}
                                className="flex-1 h-10 px-3 rounded-lg bg-[#0D1117] border border-[#1F2937] text-white text-sm focus:outline-none focus:border-[#00E5FF]"
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeSocialLink(platform.key)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-[#1F2937]">
                          <platform.icon className="h-5 w-5 text-slate-500" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-400">{platform.label}</p>
                        </div>
                        <button
                          onClick={() => addSocialLink(platform.key)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center bg-[#00E5FF]/10 text-[#00E5FF] hover:bg-[#00E5FF]/20 transition-all"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          <motion.div 
            id="skills"
            ref={(el) => { sectionRefs.current["skills"] = el }}
            className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#FF2D55]" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B]/20 to-[#FF2D55]/20 rounded-xl flex items-center justify-center">
                  <Wrench className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Skills</h2>
                  <p className="text-sm text-slate-400">Your professional skills ({profile.skills.length}/20)</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {profile.skills.map((skill) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1F2937] to-[#2a3544] rounded-full text-sm text-white group hover:from-[#F59E0B]/20 hover:to-[#FF2D55]/20 transition-all"
                >
                  <span className="w-1.5 h-1.5 bg-[#F59E0B] rounded-full" />
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="ml-1 text-slate-500 hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value.slice(0, 50))}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="Add a skill... (max 50 chars)"
                disabled={profile.skills.length >= 20}
                className="flex-1 h-12 px-4 rounded-xl bg-[#1F2937] border-2 border-transparent focus:border-[#F59E0B] text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={addSkill}
                disabled={profile.skills.length >= 20 || !newSkill.trim()}
                className="px-6 h-12 bg-[#F59E0B]/20 text-[#F59E0B] font-semibold rounded-xl hover:bg-[#F59E0B]/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </motion.div>

          <motion.div 
            id="achievements"
            ref={(el) => { sectionRefs.current["achievements"] = el }}
            className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] via-[#F59E0B] to-[#FF2D55]" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#F59E0B]/20 rounded-xl flex items-center justify-center">
                  <Award className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Achievements</h2>
                  <p className="text-sm text-slate-400">Your accomplishments ({profile.achievements.length}/10)</p>
                </div>
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {profile.achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3 p-4 bg-gradient-to-r from-[#1F2937]/50 to-transparent rounded-xl border border-[#1F2937]"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#8B5CF6]/20 to-[#FF2D55]/20 rounded-lg flex items-center justify-center text-[#8B5CF6] font-bold text-sm">
                    {index + 1}
                  </div>
                  <p className="flex-1 text-slate-300 text-sm">{achievement}</p>
                  <button 
                    onClick={() => removeAchievement(achievement)} 
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-all"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value.slice(0, 300))}
                onKeyDown={(e) => e.key === "Enter" && addAchievement()}
                placeholder="Add an achievement... (max 300 chars)"
                disabled={profile.achievements.length >= 10}
                className="flex-1 h-12 px-4 rounded-xl bg-[#1F2937] border-2 border-transparent focus:border-[#8B5CF6] text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={addAchievement}
                disabled={profile.achievements.length >= 10 || !newAchievement.trim()}
                className="px-6 h-12 bg-[#8B5CF6]/20 text-[#8B5CF6] font-semibold rounded-xl hover:bg-[#8B5CF6]/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </motion.div>

          <motion.div 
            id="techstack"
            ref={(el) => { sectionRefs.current["techstack"] = el }}
            className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF]" />
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#00E5FF]/20 rounded-xl flex items-center justify-center">
                  <Code className="h-5 w-5 text-[#8B5CF6]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Tech Stack</h2>
                  <p className="text-sm text-slate-400">Technologies you work with ({profile.techStack.length}/30)</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
              {profile.techStack.map((tech) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#1F2937] to-[#2a3544] rounded-full text-sm text-white group hover:from-[#8B5CF6]/20 hover:to-[#00E5FF]/20 transition-all"
                >
                  <Zap className="h-3 w-3 text-[#8B5CF6]" />
                  {tech}
                  <button onClick={() => removeTech(tech)} className="ml-1 text-slate-500 hover:text-red-400">
                    <X className="h-3 w-3" />
                  </button>
                </motion.span>
              ))}
            </div>
            <div className="flex gap-3">
              <input
                type="text"
                value={newTech}
                onChange={(e) => setNewTech(e.target.value.slice(0, 30))}
                onKeyDown={(e) => e.key === "Enter" && addTech()}
                placeholder="Add a technology... (max 30 chars)"
                disabled={profile.techStack.length >= 30}
                className="flex-1 h-12 px-4 rounded-xl bg-[#1F2937] border-2 border-transparent focus:border-[#8B5CF6] text-white placeholder-slate-500 focus:outline-none transition-all disabled:opacity-50"
              />
              <button
                onClick={addTech}
                disabled={profile.techStack.length >= 30 || !newTech.trim()}
                className="px-6 h-12 bg-[#8B5CF6]/20 text-[#8B5CF6] font-semibold rounded-xl hover:bg-[#8B5CF6]/30 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add
              </button>
            </div>
          </motion.div>

          <motion.div 
            id="sections"
            ref={(el) => { sectionRefs.current["sections"] = el }}
            className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF2D55] via-[#8B5CF6] to-[#00E5FF]" />
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D55]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                <Layout className="h-5 w-5 text-[#FF2D55]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-white">Home Page Sections</h2>
                <p className="text-sm text-slate-400">Toggle which sections to display</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "showHero", label: "Hero Section", desc: "Greeting, typing animation, bio & CTA buttons", icon: Briefcase, color: "#00E5FF" },
                { key: "showProfileCard", label: "Profile Card", desc: "Avatar, name, skills, contact CTA", icon: User, color: "#8B5CF6" },
                { key: "showAbout", label: "About Section", desc: "Bio & achievements", icon: FileText, color: "#10B981" },
                { key: "showTerminal", label: "Terminal Stats", desc: "Interactive stats display with typing effect", icon: Zap, color: "#F59E0B" },
                { key: "showToolbox", label: "Tech Toolbox", desc: "Technology icons grid with hover effects", icon: Code, color: "#FF2D55" },
                { key: "showFeaturedProjects", label: "Featured Projects", desc: "Project cards with thumbnails & links", icon: FolderKanban, color: "#06B6D4" },
                { key: "showRecentArticles", label: "Recent Articles", desc: "Latest blog posts with excerpts", icon: MessageSquare, color: "#8B5CF6" },
                { key: "showFooter", label: "Footer", desc: "Social links & copyright info", icon: Globe, color: "#6B7280" },
              ].map((item) => {
                const isActive = profile[item.key as keyof ProfileData] as boolean
                return (
                  <motion.button
                    key={item.key}
                    onClick={() => toggleSection(item.key)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "relative p-5 rounded-2xl border-2 transition-all duration-300 text-left",
                      isActive
                        ? "border-transparent bg-gradient-to-br from-[#1F2937] to-[#0D1117]"
                        : "border-[#1F2937] bg-[#0D1117] opacity-60"
                    )}
                    style={{
                      boxShadow: isActive ? `0 0 30px ${item.color}15, inset 0 0 30px ${item.color}05` : "none"
                    }}
                  >
                    {isActive && (
                      <div 
                        className="absolute top-3 right-3 w-6 h-6 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${item.color}20` }}
                      >
                        <Check className="h-4 w-4" style={{ color: item.color }} />
                      </div>
                    )}
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ backgroundColor: `${item.color}15` }}
                    >
                      <item.icon className="h-5 w-5" style={{ color: item.color }} />
                    </div>
                    <p className={cn("font-semibold mb-1", isActive ? "text-white" : "text-slate-400")}>
                      {item.label}
                    </p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </motion.button>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
