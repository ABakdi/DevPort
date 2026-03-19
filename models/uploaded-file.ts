import mongoose, { Schema, models, model } from "mongoose"
import { GridFSBucket } from "mongodb"

const UploadedFileSchema = new Schema({
  filename: {
    type: String,
    required: true,
  },
  originalName: {
    type: String,
    required: true,
  },
  mimeType: {
    type: String,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  folder: {
    type: String,
    required: true,
    enum: ["theme", "avatars", "projects", "posts", "general", "cv"],
    default: "general",
  },
  gridFSId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export const UploadedFile = models.UploadedFile || model("UploadedFile", UploadedFileSchema)

let gridFSBucket: GridFSBucket | null = null

export function getGridFSBucket(connection: mongoose.Mongoose | mongoose.Connection) {
  const db = (connection as any).db || (connection as any).connection?.db
  if (!gridFSBucket && db) {
    gridFSBucket = new GridFSBucket(db, {
      bucketName: "files",
    })
  }
  return gridFSBucket
}

export async function uploadToGridFS(
  connection: mongoose.Mongoose | mongoose.Connection,
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<{ id: mongoose.Types.ObjectId; url: string }> {
  const bucket = getGridFSBucket(connection)
  
  if (!bucket) {
    throw new Error("GridFS bucket not initialized")
  }
  
  const timestamp = Date.now()
  const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
  const gridFilename = `${timestamp}-${safeName}`

  const uploadStream = bucket.openUploadStream(gridFilename, {
    metadata: {
      contentType: mimeType,
      originalName: filename,
    },
  })

  uploadStream.end(buffer)

  return new Promise((resolve, reject) => {
    uploadStream.on("finish", () => {
      const url = `/api/files/serve?id=${uploadStream.id.toString()}`
      resolve({ id: uploadStream.id as mongoose.Types.ObjectId, url })
    })
    uploadStream.on("error", reject)
  })
}

export async function deleteFromGridFS(
  connection: mongoose.Mongoose | mongoose.Connection,
  fileId: mongoose.Types.ObjectId
): Promise<void> {
  const bucket = getGridFSBucket(connection)
  if (bucket) {
    await bucket.delete(fileId as any)
  }
}
