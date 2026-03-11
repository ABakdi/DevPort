import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import path from "path"
import fs from "fs"

export const dynamic = 'force-dynamic'

const UPLOAD_DIR = path.join(process.cwd(), "public", "files")

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null
    const folder = formData.get("folder") as string | null

    if (!file) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 })
    }

    const allowedFolders = ["theme", "avatars", "projects", "posts", "general"]
    const targetFolder = allowedFolders.includes(folder || "") ? folder! : "general"

    const targetDir = path.join(UPLOAD_DIR, targetFolder)
    ensureDir(targetDir)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
    const filename = `${timestamp}-${originalName}`
    const filepath = path.join(targetDir, filename)

    fs.writeFileSync(filepath, buffer)

    const fileUrl = `/files/${targetFolder}/${filename}`

    return NextResponse.json({
      success: true,
      filename,
      folder: targetFolder,
      url: fileUrl,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const folder = searchParams.get("folder") || "general"

    const allowedFolders = ["theme", "avatars", "projects", "posts", "general"]
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 })
    }

    const targetDir = path.join(UPLOAD_DIR, folder)
    
    if (!fs.existsSync(targetDir)) {
      return NextResponse.json({ files: [] })
    }

    const files = fs.readdirSync(targetDir)
    const fileList = files.map(filename => {
      const filepath = path.join(targetDir, filename)
      const stats = fs.statSync(filepath)
      return {
        filename,
        url: `/files/${folder}/${filename}`,
        size: stats.size,
        created: stats.birthtime,
      }
    })

    return NextResponse.json({ files: fileList })
  } catch (error) {
    console.error("Error listing files:", error)
    return NextResponse.json({ error: "Failed to list files" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const filename = searchParams.get("filename")
    const folder = searchParams.get("folder") || "general"

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 })
    }

    const allowedFolders = ["theme", "avatars", "projects", "posts", "general"]
    if (!allowedFolders.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 })
    }

    const filepath = path.join(UPLOAD_DIR, folder, filename)

    if (!fs.existsSync(filepath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    fs.unlinkSync(filepath)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
