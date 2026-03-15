import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb"
import { Article } from "@/models/article"

export async function GET() {
  try {
    await connectToDatabase()

    const categories = await Article.aggregate([
      { $match: { status: 'published' } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $project: { _id: 0, name: "$_id", count: 1 } }
    ])

    return NextResponse.json(categories)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}
