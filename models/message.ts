import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage extends Document {
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  starred: boolean
  replied: boolean
  replyText?: string
  repliedAt?: Date
  createdAt: Date
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  starred: {
    type: Boolean,
    default: false
  },
  replied: {
    type: Boolean,
    default: false
  },
  replyText: {
    type: String,
    trim: true
  },
  repliedAt: {
    type: Date
  }
}, {
  timestamps: true
})

export const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', MessageSchema)
