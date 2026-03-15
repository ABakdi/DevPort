"use client"

import { useState, useEffect } from "react"
import {
  Navbar,
  ProfileCard,
  AboutSection,
  FeaturedWork,
  TerminalSection,
  Toolbox,
  RecentArticles,
  Footer,
} from "@/components/home"
import { AnimatedBackground } from "@/components/home/animated-background"
import { HomeSkeleton } from "@/components/home/skeletons"
import { getProfileData } from "@/lib/profile"
import { motion } from "framer-motion"

const defaultProfile: any = {
  name: "",
  title: "",
  location: "",
  timezone: "Africa/Algiers",
  email: "",
  skills: [],
  bio: "",
  achievements: [],
  techStack: [],
  social: { twitter: "", github: "", linkedin: "", youtube: "", instagram: "" },
  siteVersion: "v2024.1.0-alpha",
}

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15
    }
  }
}

export default function Home() {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data: any = await getProfileData()
        if (data) {
          const p: any = {
            ...defaultProfile,
            ...data,
          }
          setProfile(p)
        } else {
          setProfile(defaultProfile)
        }
      } catch (error) {
        console.error("Failed to fetch profile:", error)
        setProfile(defaultProfile)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [])

  if (loading || !profile) {
    return (
      <AnimatedBackground>
        <Navbar />
        <HomeSkeleton />
      </AnimatedBackground>
    )
  }

  const p = profile

  return (
    <AnimatedBackground>
      <Navbar />
      
      <motion.main 
        className="max-w-7xl mx-auto px-6 py-8 space-y-6"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
      >
        {/* Profile Card (4 cols) + About Section (8 cols) */}
        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-4">
            <ProfileCard profile={p} />
          </div>
          <div className="lg:col-span-8">
            <AboutSection bio={p.bio} achievements={p.achievements} badges={p.badges} />
          </div>
        </motion.div>

        {/* Featured Project - Full Width */}
        <motion.section variants={fadeInUp}>
          <FeaturedWork caseStudy={p.caseStudy} />
        </motion.section>

        {/* Terminal (7 cols) + Right Column with Toolbox + Articles (5 cols) */}
        <motion.div 
          variants={fadeInUp}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <div className="lg:col-span-7">
            <TerminalSection />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <Toolbox techStack={p.techStack} />
            <RecentArticles articles={p.articles} />
          </div>
        </motion.div>
      </motion.main>

      {/* Footer with social links */}
      <Footer social={p.socialLinks} siteVersion={p.siteVersion} />
    </AnimatedBackground>
  )
}
