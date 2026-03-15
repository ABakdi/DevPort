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

    // Extract font fields explicitly
    const { fontHeading, fontBody, fontSize, backgroundStyle, backgroundImage, backgroundVideo, animationStyle, textAnimationStyle, cardGlow, textGlow, ...rest } = body

    console.log("=== PUT /api/theme ===")
    console.log("PUT - body fontHeading:", fontHeading)
    console.log("PUT - body fontBody:", fontBody)
    console.log("PUT - body fontSize:", fontSize)
    console.log("PUT - body backgroundImage:", body.backgroundImage)
    console.log("PUT - body backgroundStyle:", body.backgroundStyle)
    console.log("PUT - body animationStyle:", body.animationStyle)
    console.log("PUT - body cardGlow:", body.cardGlow)
    
    await connectToDatabase()
    let theme = await Theme.findOne()
    
    if (theme) {
      // Build the update object with ALL fields explicitly including fonts
      const updateData: Record<string, unknown> = {
        ...rest,
        fontHeading: fontHeading,
        fontBody: fontBody,
        fontSize: fontSize,
        backgroundStyle: backgroundStyle,
        backgroundImage: backgroundImage,
        backgroundVideo: backgroundVideo,
        animationStyle: animationStyle,
        textAnimationStyle: textAnimationStyle,
        cardGlow: cardGlow,
        textGlow: textGlow,
        updatedAt: new Date()
      }

      console.log("PUT - updateData being sent to MongoDB:", JSON.stringify(updateData))
      
      theme = await Theme.findByIdAndUpdate(
        theme._id,
        updateData,
        { returnDocument: 'after', runValidators: true }
      )
      console.log("PUT - after update, theme has:", JSON.stringify({ backgroundStyle: theme?.backgroundStyle, animationStyle: theme?.animationStyle, cardGlow: theme?.cardGlow }))
    } else {
      theme = await Theme.create({
        backgroundStyle: backgroundStyle || "gradient",
        backgroundImage: backgroundImage || "",
        backgroundVideo: backgroundVideo || "",
        animationStyle: animationStyle || "rattle",
        textAnimationStyle: textAnimationStyle || "none",
        cardGlow: cardGlow || 0,
        textGlow: textGlow || 0,
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

    console.log("GET - theme from DB:", { fontHeading: theme?.fontHeading, fontBody: theme?.fontBody, fontSize: theme?.fontSize })

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
