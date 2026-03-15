"use server"

import { connectToDatabase } from "@/lib/mongodb"
import { Profile } from "@/models/profile"

export async function getProfileData() {
  try {
    await connectToDatabase()
    const profile = await Profile.findOne()

    if (!profile) {
      return null
    }

    const profileObj = JSON.parse(JSON.stringify(profile))
    
    return {
      name: profileObj.name ?? "",
      title: profileObj.title ?? "",
      bio: profileObj.bio ?? "",
      location: profileObj.location ?? "",
      timezone: profileObj.timezone ?? "Africa/Algiers",
      email: profileObj.email ?? "",
      phone: profileObj.phone ?? "",
      skills: profileObj.skills ?? [],
      achievements: profileObj.achievements ?? [],
      badges: profileObj.badges ?? [],
      techStack: profileObj.techStack ?? [],
      socialLinks: profileObj.socialLinks ?? [],
      social: profileObj.socialLinks ?? [],
      articles: profileObj.articles ?? [],
      siteVersion: profileObj.siteVersion ?? "v2024.1.0-alpha",
      caseStudy: profileObj.caseStudy,
      showHero: profileObj.showHero ?? true,
      showProfileCard: profileObj.showProfileCard ?? true,
      showAbout: profileObj.showAbout ?? true,
      showTerminal: profileObj.showTerminal ?? true,
      showToolbox: profileObj.showToolbox ?? true,
      showFeaturedProjects: profileObj.showFeaturedProjects ?? true,
      showRecentArticles: profileObj.showRecentArticles ?? true,
      showFooter: profileObj.showFooter ?? true,
    }
  } catch (error) {
    console.error("Error fetching profile:", error)
    return null
  }
}
