import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { getGridFSBucket } from "@/models/uploaded-file"
import mongoose from "mongoose"

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Missing file ID" }, { status: 400 })
    }

    const { db } = await connectToDatabase()
    const bucket = getGridFSBucket(db)

    if (!bucket) {
      return NextResponse.json({ error: "Storage not available" }, { status: 500 })
    }

    const objectId = new mongoose.Types.ObjectId(id)
    
    const files = await bucket.find({ _id: objectId }).toArray()
    
    if (files.length === 0) {
      return NextResponse.json({ error: "File not found" }, { status: 404 })
    }

    const file = files[0]
    const chunks = []

    for await (const chunk of bucket.openDownloadStream(objectId)) {
      chunks.push(chunk)
    }

    const buffer = Buffer.concat(chunks)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.metadata?.contentType || "application/octet-stream",
        "Content-Disposition": `inline; filename="${file.filename}"`,
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Error serving file:", error)
    return NextResponse.json({ error: "Failed to serve file" }, { status: 500 })
  }
}
