import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Profile } from "@/models/profile"

export const dynamic = 'force-dynamic'

const defaultProfile = {
  name: "Your Name",
  title: "Your Title",
  bio: "",
  location: "",
  timezone: "Africa/Algiers",
  email: "",
  phone: "",
  skills: [],
  achievements: [],
  badges: [],
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

export async function GET() {
  try {
    await connectToDatabase()
    let profile = await Profile.findOne()

    if (!profile) {
      profile = await Profile.create(defaultProfile)
    }

    const profileObj = JSON.parse(JSON.stringify(profile))
    
    // Ensure section fields are always present in response
    const sectionFields = ['showHero', 'showProfileCard', 'showAbout', 'showTerminal', 'showToolbox', 'showFeaturedProjects', 'showRecentArticles', 'showFooter']
    sectionFields.forEach(field => {
      if (profileObj[field] === undefined) {
        profileObj[field] = true
      }
    })

    return NextResponse.json(profileObj, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    
    console.log("PUT /api/profile - received body:", JSON.stringify({
      showHero: body.showHero,
      showFeaturedProjects: body.showFeaturedProjects,
      showProfileCard: body.showProfileCard,
      showAbout: body.showAbout,
      showTerminal: body.showTerminal,
      showToolbox: body.showToolbox,
      showRecentArticles: body.showRecentArticles,
      showFooter: body.showFooter,
    }))
    
    // Validate required fields
    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 })
    }
    if (!body.title || !body.title.trim()) {
      return NextResponse.json({ error: "Title is required" }, { status: 400 })
    }
    
    // Validate email format if provided
    if (body.email && !/^\S+@\S+\.\S+$/.test(body.email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }
    
    // Validate lengths
    if (body.name?.length > 100) {
      return NextResponse.json({ error: "Name cannot exceed 100 characters" }, { status: 400 })
    }
    if (body.title?.length > 100) {
      return NextResponse.json({ error: "Title cannot exceed 100 characters" }, { status: 400 })
    }
    if (body.bio?.length > 1000) {
      return NextResponse.json({ error: "Bio cannot exceed 1000 characters" }, { status: 400 })
    }

    await connectToDatabase()

    let profile = await Profile.findOne()

    if (profile) {
      // Filter out invalid fields
      const allowedFields = [
        "name", "title", "bio", "location", "timezone", "email", "phone",
        "skills", "achievements", "badges", "techStack", "socialLinks", "siteVersion",
      ]
      
      const filteredBody: Record<string, unknown> = {}
      for (const key of allowedFields) {
        if (body[key] !== undefined) {
          filteredBody[key] = body[key]
        }
      }
      
      // Explicitly handle section toggle fields
      const sectionFields = ['showHero', 'showProfileCard', 'showAbout', 'showTerminal', 'showToolbox', 'showFeaturedProjects', 'showRecentArticles', 'showFooter']
      sectionFields.forEach(field => {
        if (body[field] !== undefined) {
          filteredBody[field] = body[field]
        }
      })
      
      profile = await Profile.findByIdAndUpdate(
        profile._id,
        { ...filteredBody, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
      
      console.log("PUT /api/profile - saved profile:", JSON.stringify({
        showHero: profile?.showHero,
        showFeaturedProjects: profile?.showFeaturedProjects,
        showProfileCard: profile?.showProfileCard,
        showAbout: profile?.showAbout,
        showTerminal: profile?.showTerminal,
        showToolbox: profile?.showToolbox,
        showRecentArticles: profile?.showRecentArticles,
        showFooter: profile?.showFooter,
      }))
    } else {
      profile = await Profile.create({ ...defaultProfile, ...body, updatedAt: new Date() })
    }

    return NextResponse.json(profile)
  } catch (error: unknown) {
    console.error("Error updating profile:", error)
    const err = error as Error
    return NextResponse.json({ error: err.message || "Failed to update profile" }, { status: 500 })
  }
}
