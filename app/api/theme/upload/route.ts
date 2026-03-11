import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { Theme } from "@/models/theme"

export const dynamic = 'force-dynamic'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const type = formData.get("type") as string | null

    if (!file || !type) {
      return NextResponse.json({ error: "Missing file or type" }, { status: 400 })
    }

    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm"],
    }

    if (type === "image" && !allowedTypes.image.includes(file.type)) {
      return NextResponse.json({ error: "Invalid image type" }, { status: 400 })
    }

    if (type === "video" && !allowedTypes.video.includes(file.type)) {
      return NextResponse.json({ error: "Invalid video type" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = `data:${file.type};base64,${buffer.toString("base64")}`

    await connectToDatabase()
    let theme = await Theme.findOne()

    if (!theme) {
      theme = await Theme.create({
        backgroundStyle: "custom-image",
        backgroundImage: type === "image" ? base64 : "",
        backgroundVideo: type === "video" ? base64 : "",
      })
    } else {
      if (type === "image") {
        theme.backgroundStyle = "custom-image"
        theme.backgroundImage = base64
        theme.backgroundVideo = ""
      } else if (type === "video") {
        theme.backgroundStyle = "custom-video"
        theme.backgroundVideo = base64
        theme.backgroundImage = ""
      }
      theme.updatedAt = new Date()
      await theme.save()
    }

    return NextResponse.json({
      success: true,
      backgroundStyle: theme.backgroundStyle,
      backgroundImage: theme.backgroundImage,
      backgroundVideo: theme.backgroundVideo,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get("type")

    await connectToDatabase()
    let theme = await Theme.findOne()

    if (theme) {
      if (type === "image") {
        theme.backgroundImage = ""
        theme.backgroundStyle = "gradient"
      } else if (type === "video") {
        theme.backgroundVideo = ""
        theme.backgroundStyle = "gradient"
      }
      theme.updatedAt = new Date()
      await theme.save()
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
