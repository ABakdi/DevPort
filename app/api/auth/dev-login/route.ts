import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Dev login only available in development" }, { status: 403 })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const MONGODB_URI = process.env.MONGODB_URI
    if (!MONGODB_URI) {
      return NextResponse.json({ error: "MongoDB not configured" }, { status: 500 })
    }

    await mongoose.connect(MONGODB_URI)
    const db = mongoose.connection.db

    if (!db) {
      return NextResponse.json({ error: "Database connection failed" }, { status: 500 })
    }

    let user = await db.collection("users").findOne({ email: email.toLowerCase() })

    if (!user) {
      const result = await db.collection("users").insertOne({
        email: email.toLowerCase(),
        name: email.split("@")[0],
        emailVerified: new Date(),
      })
      user = { _id: result.insertedId, email: email.toLowerCase() }
    }

    return NextResponse.json({ user: { _id: user._id.toString(), email: user.email } })
  } catch (error) {
    console.error("Dev login error:", error)
    return NextResponse.json({ error: "Dev login failed" }, { status: 500 })
  }
}
