import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Message } from '@/models/message'

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const search = searchParams.get('search') || ''
    
    let query: any = {}
    
    if (filter === 'unread') {
      query.read = false
    } else if (filter === 'starred') {
      query.starred = true
    } else if (filter === 'replied') {
      query.replied = true
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } }
      ]
    }
    
    const messages = await Message.find(query)
      .sort({ createdAt: -1 })
      .lean()
    
    const total = await Message.countDocuments(query)
    const unread = await Message.countDocuments({ read: false })
    const starred = await Message.countDocuments({ starred: true })
    const replied = await Message.countDocuments({ replied: true })
    
    return NextResponse.json({
      messages: JSON.parse(JSON.stringify(messages)),
      stats: { total, unread, starred, replied }
    })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase()
    
    const body = await request.json()
    const { name, email, subject, message } = body
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }
    
    const newMessage = await Message.create({
      name,
      email,
      subject,
      message
    })
    
    return NextResponse.json(JSON.parse(JSON.stringify(newMessage)), { status: 201 })
  } catch (error) {
    console.error('Error creating message:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
