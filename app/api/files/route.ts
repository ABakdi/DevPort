import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { connectToDatabase } from "@/lib/mongodb"
import { UploadedFile, uploadToGridFS, deleteFromGridFS } from "@/models/uploaded-file"
import mongoose from "mongoose"

export const dynamic = 'force-dynamic'

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

    const allowedTypes = {
      image: ["image/jpeg", "image/png", "image/gif", "image/webp"],
      video: ["video/mp4", "video/webm"],
      general: ["image/jpeg", "image/png", "image/gif", "image/webp", "video/mp4", "video/webm", "application/pdf"],
    }

    const fileType = targetFolder === "theme" || targetFolder === "avatars" || targetFolder === "projects" ? "image" : "general"
    if (!allowedTypes[fileType as keyof typeof allowedTypes].includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type" }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const { db } = await connectToDatabase()
    const { id, url } = await uploadToGridFS(db, buffer, file.name, file.type)

    const uploadedFile = await UploadedFile.create({
      filename: file.name,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      folder: targetFolder,
      gridFSId: id,
      url,
    })

    return NextResponse.json({
      success: true,
      _id: uploadedFile._id,
      filename: uploadedFile.filename,
      folder: uploadedFile.folder,
      url: uploadedFile.url,
      size: uploadedFile.size,
      mimeType: uploadedFile.mimeType,
      createdAt: uploadedFile.createdAt,
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
    const folder = searchParams.get("folder")

    const query: Record<string, unknown> = {}
    if (folder && ["theme", "avatars", "projects", "posts", "general"].includes(folder)) {
      query.folder = folder
    }

    const files = await UploadedFile.find(query).sort({ createdAt: -1 }).lean()

    return NextResponse.json({ files })
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
    const fileId = searchParams.get("id")

    if (!fileId) {
      return NextResponse.json({ error: "Missing file ID" }, { status: 400 })
    }

    const file = await UploadedFile.findById(fileId)
    
    if (!file) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const { db } = await connectToDatabase()
    await deleteFromGridFS(db, file.gridFSId as mongoose.Types.ObjectId)
    
    await UploadedFile.findByIdAndDelete(fileId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting file:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
