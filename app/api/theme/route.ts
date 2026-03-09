import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Theme } from "@/models/theme"

export const dynamic = 'force-dynamic'

const defaultTheme = {
  name: "Custom Theme",
  primary: "#00E5FF",
  secondary: "#8B5CF6",
  accent: "#F59E0B",
  background: "#0D1117",
  surface: "#1F2937",
  text: "#ffffff",
  lightPrimary: "#0891B2",
  lightSecondary: "#7C3AED",
  lightAccent: "#D97706",
  lightBackground: "#F8FAFC",
  lightSurface: "#FFFFFF",
  lightText: "#0F172A",
  fontHeading: "Inter",
  fontBody: "Inter",
  fontSize: 16,
  borderRadius: "rounded-xl",
  borderWidth: 1,
  iconStyle: "rounded",
  layout: "default",
  animations: true,
  darkMode: "dark",
  logo: "",
  favicon: "",
  pageStyle: "default",
  componentStyle: "rounded",
  cardStyle: "default",
  buttonStyle: "default",
  inputStyle: "default",
  shadowIntensity: "medium",
  borderStyle: "solid",
  customPalettes: [],
  customLayouts: [],
  customStyles: [],
}

export async function GET() {
  try {
    await connectToDatabase()
    let theme = await Theme.findOne()

    if (!theme) {
      theme = await Theme.create(defaultTheme)
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

export async function PUT(req: Request) {
  try {
    const body = await req.json()

    await connectToDatabase()

    let theme = await Theme.findOne()

    if (theme) {
      const allowedFields = [
        "name", "primary", "secondary", "accent", "background", "surface", "text",
        "lightPrimary", "lightSecondary", "lightAccent", "lightBackground", "lightSurface", "lightText",
        "fontHeading", "fontBody", "fontSize", "borderRadius", "borderWidth",
        "iconStyle", "layout", "animations", "darkMode", "logo", "favicon",
        "pageStyle", "componentStyle", "cardStyle", "buttonStyle", "inputStyle", "shadowIntensity", "borderStyle",
        "customPalettes", "customLayouts", "customStyles"
      ]
      
      const filteredBody: Record<string, unknown> = {}
      for (const key of allowedFields) {
        if (body[key] !== undefined) {
          filteredBody[key] = body[key]
        }
      }
      
      theme = await Theme.findByIdAndUpdate(
        theme._id,
        { ...filteredBody, updatedAt: new Date() },
        { new: true, runValidators: true }
      )
    } else {
      theme = await Theme.create({ ...defaultTheme, ...body, updatedAt: new Date() })
    }

    return NextResponse.json(theme)
  } catch (error: unknown) {
    console.error("Error updating theme:", error)
    const err = error as Error
    return NextResponse.json({ error: err.message || "Failed to update theme" }, { status: 500 })
  }
}
