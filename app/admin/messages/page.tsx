"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, Search, Filter, Mail, Phone, MapPin, Calendar, Send, Star, Trash2, Reply,
  ChevronLeft, ChevronRight, Check, CheckCheck, MoreHorizontal, User, Clock, ArrowLeft
} from "lucide-react"

const mockMessages = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@techcorp.com",
    subject: "Project Collaboration Inquiry",
    message: "Hi there! I came across your portfolio and I'm impressed with your work. We're looking for a skilled developer to help build our next-generation platform. Would you be interested in discussing a potential collaboration?\n\nLooking forward to hearing from you!",
    date: "2024-01-18T14:30:00",
    read: false,
    starred: true,
    reply: true
  },
  {
    id: 2,
    name: "Sarah Johnson",
    email: "sarah@startupio",
    subject: "Freelance Opportunity - E-commerce Platform",
    message: "Hello!\n\nWe're a growing startup looking for a full-stack developer to build our e-commerce platform. The project involves:\n\n- Next.js frontend\n- Node.js API\n- MongoDB database\n- Payment integration\n\nWould you have time for a call this week to discuss the details?",
    date: "2024-01-17T09:15:00",
    read: true,
    starred: false,
    reply: false
  },
  {
    id: 3,
    name: "Mike Williams",
    email: "mike.w@designstudio.com",
    subject: "Bug Report - Portfolio Contact Form",
    message: "Hi!\n\nI noticed a small issue with the contact form on your portfolio - when I try to submit, I get an error message. Just wanted to let you know!\n\nOtherwise, your portfolio looks amazing!",
    date: "2024-01-16T16:45:00",
    read: true,
    starred: false,
    reply: true
  },
]

export default function AdminMessages() {
  const [messages, setMessages] = useState(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState<typeof mockMessages[0] | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "starred">("all")

  const filteredMessages = messages.filter(msg => {
    const matchesSearch = msg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchQuery.toLowerCase())
    
    if (filter === "unread") return matchesSearch && !msg.read
    if (filter === "starred") return matchesSearch && msg.starred
    return matchesSearch
  })

  const markAsRead = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m))
    if (selectedMessage?.id === id) {
      setSelectedMessage({ ...selectedMessage, read: true })
    }
  }

  const toggleStar = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  return (
    <div className="p-6 lg:p-8 h-[calc(100vh-80px)]">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--theme-text)' }}>Messages</h1>
        <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Manage contact form submissions</p>
      </motion.div>

      <div className="flex gap-6 h-[calc(100%-80px)]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-96 flex-shrink-0 flex flex-col border rounded-2xl overflow-hidden"
          style={{ 
            backgroundColor: 'var(--theme-background)',
            borderColor: 'var(--theme-surface)',
          }}
        >
          <div className="p-4 border-b" style={{ borderColor: 'var(--theme-surface)' }}>
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full h-10 pl-10 pr-4 rounded-xl border border-transparent focus:border-[var(--theme-primary)] focus:outline-none transition-all"
                style={{ 
                  backgroundColor: 'var(--theme-surface)',
                  color: 'var(--theme-text)',
                }}
              />
            </div>
            <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--theme-surface)' }}>
              {(["all", "unread", "starred"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all`}
                  style={{
                    background: filter === f ? `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 20%, transparent), transparent)` : 'transparent',
                    color: filter === f ? 'var(--theme-primary)' : 'var(--theme-text)',
                    opacity: filter === f ? 1 : 0.6,
                  }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <AnimatePresence>
              {filteredMessages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <Mail className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--theme-text)', opacity: 0.3 }} />
                  <p style={{ color: 'var(--theme-text)', opacity: 0.6 }}>No messages found</p>
                </motion.div>
              ) : (
                filteredMessages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => {
                      setSelectedMessage(message)
                      markAsRead(message.id)
                    }}
                    className={`p-4 cursor-pointer transition-all border-b ${
                      selectedMessage?.id === message.id
                        ? "border-l-2"
                        : "border-l-2"
                    }`}
                    style={{ 
                      backgroundColor: selectedMessage?.id === message.id 
                        ? `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 10%, transparent), transparent)` 
                        : !message.read ? 'var(--theme-background)' : 'var(--theme-background)',
                      borderColor: selectedMessage?.id === message.id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                      borderLeftColor: selectedMessage?.id === message.id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        message.read 
                          ? "" 
                          : ""
                      }`}
                      style={{
                        backgroundColor: message.read ? 'var(--theme-surface)' : `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 20%, transparent), color-mix(in srgb, var(--theme-secondary) 20%, transparent))`,
                        color: message.read ? 'var(--theme-text)' : 'var(--theme-primary)',
                        opacity: message.read ? 0.6 : 1,
                      }}>
                        {message.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className={`text-sm font-semibold truncate`} style={{ color: message.read ? 'var(--theme-text)' : 'var(--theme-text)', opacity: message.read ? 0.6 : 1 }}>
                            {message.subject}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {message.starred && <Star className="h-3 w-3" style={{ color: 'var(--theme-accent)', fill: 'var(--theme-accent)' }} />}
                            {!message.read && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }} />}
                          </div>
                        </div>
                        <p className="text-xs truncate mb-1" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{message.name}</p>
                        <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.3 }}>{formatDate(message.date)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 border rounded-2xl overflow-hidden hidden md:flex flex-col"
          style={{ 
            backgroundColor: 'var(--theme-background)',
            borderColor: 'var(--theme-surface)',
          }}
        >
          {selectedMessage ? (
            <>
              <div className="p-6 border-b" style={{ borderColor: 'var(--theme-surface)' }}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 rounded-lg md:hidden transition-all"
                      style={{ 
                        backgroundColor: 'var(--theme-surface)', 
                        color: 'var(--theme-text)',
                        opacity: 0.6,
                      }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>{selectedMessage.subject}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(selectedMessage.id)}
                      className={`p-2 rounded-lg transition-all`}
                      style={{
                        backgroundColor: selectedMessage.starred ? 'var(--theme-accent)' : 'var(--theme-surface)',
                        color: selectedMessage.starred ? '#000' : 'var(--theme-text)',
                        opacity: selectedMessage.starred ? 0.2 : 0.6,
                      }}
                    >
                      <Star className={`h-4 w-4 ${selectedMessage.starred ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-2 rounded-lg transition-all" style={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      color: 'var(--theme-text)',
                      opacity: 0.6,
                    }}>
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg transition-all" style={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      color: 'var(--theme-text)',
                      opacity: 0.6,
                    }}>
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg" style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 20%, transparent), color-mix(in srgb, var(--theme-secondary) 20%, transparent))', color: 'var(--theme-primary)' }}>
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--theme-text)' }}>{selectedMessage.name}</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>{selectedMessage.email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(selectedMessage.date)}</span>
                    <span>·</span>
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatTime(selectedMessage.date)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-line leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{selectedMessage.message}</p>
                </div>
              </div>

              <div className="p-6 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                <div className="flex items-center gap-3">
                  <button className="flex-1 py-3 font-semibold rounded-xl transition-opacity flex items-center justify-center gap-2" style={{ 
                    background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                    color: '#000000',
                  }}>
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <MessageSquare className="h-10 w-10" style={{ color: 'var(--theme-text)', opacity: 0.3 }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>Select a message</h3>
                <p style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Choose a message from the list to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
