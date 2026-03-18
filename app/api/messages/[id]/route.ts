import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '@/lib/mongodb'
import { Message } from '@/models/message'
import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectToDatabase()
    
    const message = await Message.findById(id).lean()
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    
    if (!message.read) {
      await Message.findByIdAndUpdate(id, { read: true })
    }
    
    return NextResponse.json(JSON.parse(JSON.stringify(message)))
  } catch (error) {
    console.error('Error fetching message:', error)
    return NextResponse.json({ error: 'Failed to fetch message' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    await connectToDatabase()
    
    const allowedFields = ['read', 'starred', 'replied', 'replyText']
    const updateData: any = {}
    
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field]
      }
    }
    
    if (body.replyText && body.replied) {
      updateData.repliedAt = new Date()
    }
    
    const message = await Message.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).lean()
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    
    if (body.replyText && body.sendEmail !== false) {
      const originalMessage = await Message.findById(id).lean()
      
      if (originalMessage && resend) {
        const ownerEmail = process.env.OWNER_EMAIL || 'admin@example.com'
        
        await resend.emails.send({
          from: 'DevPort <onboarding@resend.dev>',
          to: originalMessage.email,
          subject: `Re: ${originalMessage.subject}`,
          html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a0a0a; color: #ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #0a0a0a; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; background-color: #111111; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="padding: 32px; background: linear-gradient(135deg, #00E5FF 0%, #8B5CF6 100%);">
              <h1 style="margin: 0; font-size: 24px; color: #000000;">DevPort</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; color: #888888; font-size: 14px;">
                Reply to your message on DevPort
              </p>
              
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
                <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #00E5FF;">Your original message:</strong>
                </p>
                <p style="margin: 0; color: #aaaaaa; font-size: 14px; font-style: italic;">
                  "${originalMessage.message}"
                </p>
              </div>
              
              <div style="background-color: #1a1a1a; border-radius: 12px; padding: 20px; border-left: 3px solid #00E5FF;">
                <p style="margin: 0 0 12px 0; color: #ffffff; font-size: 14px;">
                  <strong style="color: #00E5FF;">Reply:</strong>
                </p>
                <p style="margin: 0; color: #ffffff; font-size: 14px; white-space: pre-wrap;">${body.replyText}</p>
              </div>
              
              <p style="margin: 24px 0 0 0; color: #666666; font-size: 12px;">
                Sent via DevPort Contact Form
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 24px; background-color: #0a0a0a; text-align: center;">
              <p style="margin: 0; color: #666666; font-size: 12px;">
                &copy; ${new Date().getFullYear()} DevPort. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
          `
        })
      }
    }
    
    return NextResponse.json(JSON.parse(JSON.stringify(message)))
  } catch (error) {
    console.error('Error updating message:', error)
    return NextResponse.json({ error: 'Failed to update message' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectToDatabase()
    
    const message = await Message.findByIdAndDelete(id)
    
    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting message:', error)
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 })
  }
}
