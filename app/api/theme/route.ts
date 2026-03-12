import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Theme } from "@/models/theme"

export const dynamic = 'force-dynamic'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const { backgroundStyle, backgroundImage, backgroundVideo, ...rest } = body

    await connectToDatabase()
    let theme = await Theme.findOne()

    console.log("=== PUT /api/theme ===")
    console.log("PUT - body backgroundImage:", body.backgroundImage)
    console.log("PUT - body backgroundStyle:", body.backgroundStyle)
    
    if (theme) {
      const allowedFields = [
        "name", "primary", "secondary", "accent", "background", "surface", "text",
        "lightPrimary", "lightSecondary", "lightAccent", "lightBackground", "lightSurface", "lightText",
        "fontHeading", "fontBody", "fontSize", "borderRadius", "borderWidth",
        "iconStyle", "layout", "animations", "darkMode", "logo", "favicon",
        "pageStyle", "componentStyle", "cardStyle", "buttonStyle", "inputStyle", "shadowIntensity", "borderStyle",
        "backgroundStyle", "backgroundImage", "backgroundVideo",
        "animationStyle", "textAnimationStyle", "cardGlow", "textGlow",
        "customPalettes", "customLayouts", "customStyles"
      ]
      
      const filteredBody: Record<string, unknown> = {}
      for (const key of allowedFields) {
        if (rest[key] !== undefined) {
          filteredBody[key] = rest[key]
        }
      }

      if (backgroundStyle) {
        filteredBody.backgroundStyle = backgroundStyle
      }

      if (backgroundImage !== undefined) {
        filteredBody.backgroundImage = backgroundImage
      }

      if (backgroundVideo !== undefined) {
        filteredBody.backgroundVideo = backgroundVideo
      }
      
      console.log("PUT - updating theme with _id:", theme._id.toString())
      console.log("PUT - backgroundImage being saved:", filteredBody.backgroundImage)
      
      theme = await Theme.findByIdAndUpdate(
        theme._id,
        { ...filteredBody, updatedAt: new Date() },
        { returnDocument: 'after', runValidators: true }
      )
      console.log("PUT - after update, theme has:", theme?.backgroundStyle, theme?.backgroundImage ? "image" : "no image")
    } else {
      theme = await Theme.create({
        backgroundStyle: backgroundStyle || "gradient",
        backgroundImage: backgroundImage || "",
        backgroundVideo: backgroundVideo || "",
        ...rest,
        updatedAt: new Date()
      })
    }

    return NextResponse.json(theme)
  } catch (error: unknown) {
    console.error("Error updating theme:", error)
    const err = error as Error
    return NextResponse.json({ error: err.message || "Failed to update theme" }, { status: 500 })
  }
}

export async function GET() {
  try {
    await connectToDatabase()
    
    // Debug: count total themes
    const count = await Theme.countDocuments()
    console.log("=== GET /api/theme === Total themes in DB:", count)
    
    // Get ALL themes to see what's there
    const allThemes = await Theme.find({}).sort({ createdAt: 1 }).limit(5)
    console.log("All themes:", allThemes.map(t => ({ _id: t._id.toString(), backgroundImage: t.backgroundImage ? "has" : "empty", backgroundStyle: t.backgroundStyle })))
    
    // Get the first theme
    let theme = await Theme.findOne().sort({ createdAt: 1 })

    if (!theme) {
      theme = await Theme.create({
        name: "Custom Theme",
        primary: "#00E5FF",
        secondary: "#8B5CF6",
        accent: "#F59E0B",
        background: "#0D1117",
        surface: "#1F2937",
        text: "#ffffff",
        fontHeading: "Inter",
        fontBody: "Inter",
        fontSize: 16,
        borderRadius: "rounded-xl",
        borderWidth: 1,
        iconStyle: "rounded",
        layout: "default",
        animations: true,
        darkMode: "dark",
        pageStyle: "default",
        componentStyle: "rounded",
        cardStyle: "default",
        buttonStyle: "default",
        inputStyle: "default",
        shadowIntensity: "medium",
        borderStyle: "solid",
        backgroundStyle: "gradient",
        backgroundImage: "",
        backgroundVideo: "",
        animationStyle: "rattle",
        textAnimationStyle: "none",
        cardGlow: 0,
        textGlow: 0,
      })
    }

    const themeObj = JSON.parse(JSON.stringify(theme))

    return NextResponse.json(themeObj, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    })
  } catch (error) {
    console.error("Error fetching theme:", error)
    return NextResponse.json({ error: "Failed to fetch theme" }, { status: 500 })
  }
}
