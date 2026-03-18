"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  MessageSquare, Search, Mail, Star, Trash2, Reply,
  ArrowLeft, Check, CheckCheck, Loader2, X, Send
} from "lucide-react"

interface Message {
  _id: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  starred: boolean
  replied: boolean
  replyText?: string
  repliedAt?: string
  createdAt: string
}

interface MessageStats {
  total: number
  unread: number
  starred: number
  replied: number
}

export default function AdminMessages() {
  const [messages, setMessages] = useState<Message[]>([])
  const [stats, setStats] = useState<MessageStats>({ total: 0, unread: 0, starred: 0, replied: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "starred" | "replied">("all")
  const [showReplyModal, setShowReplyModal] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [sendingReply, setSendingReply] = useState(false)

  const fetchMessages = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== "all") params.set('filter', filter)
      if (searchQuery) params.set('search', searchQuery)
      
      const res = await fetch(`/api/messages?${params}`)
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages)
        setStats(data.stats)
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMessages()
  }, [filter])

  useEffect(() => {
    const delaySearch = setTimeout(() => {
      fetchMessages()
    }, 300)
    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      })
      
      if (!res.ok) throw new Error('Failed to mark as read')
      
      setMessages(messages.map(m => m._id === id ? { ...m, read: true } : m))
      setStats({ ...stats, unread: Math.max(0, stats.unread - 1) })
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, read: true })
      }
    } catch (error) {
      console.error("Failed to mark as read:", error)
    }
  }

  const toggleStar = async (id: string) => {
    const message = messages.find(m => m._id === id)
    if (!message) return
    
    const newStarred = !message.starred
    
    try {
      const res = await fetch(`/api/messages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ starred: newStarred })
      })
      
      if (!res.ok) throw new Error('Failed to toggle star')
      
      setMessages(messages.map(m => m._id === id ? { ...m, starred: newStarred } : m))
      setStats({
        ...stats,
        starred: newStarred ? stats.starred + 1 : stats.starred - 1
      })
      if (selectedMessage?._id === id) {
        setSelectedMessage({ ...selectedMessage, starred: newStarred })
      }
    } catch (error) {
      console.error("Failed to toggle star:", error)
    }
  }

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return
    
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete')
      
      setMessages(messages.filter(m => m._id !== id))
      if (selectedMessage?._id === id) {
        setSelectedMessage(null)
      }
      fetchMessages()
    } catch (error) {
      console.error("Failed to delete message:", error)
    }
  }

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return
    
    setSendingReply(true)
    try {
      await fetch(`/api/messages/${selectedMessage._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          replied: true, 
          replyText: replyText,
          sendEmail: true
        })
      })
      
      setMessages(messages.map(m => 
        m._id === selectedMessage._id 
          ? { ...m, replied: true, replyText, repliedAt: new Date().toISOString() }
          : m
      ))
      setShowReplyModal(false)
      setReplyText("")
      fetchMessages()
    } catch (error) {
      console.error("Failed to send reply:", error)
    } finally {
      setSendingReply(false)
    }
  }

  const handleSelectMessage = (message: Message) => {
    setSelectedMessage(message)
    if (!message.read) {
      markAsRead(message._id)
    }
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--theme-primary)' }} />
      </div>
    )
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

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'var(--theme-primary)' },
          { label: 'Unread', value: stats.unread, color: 'var(--theme-secondary)' },
          { label: 'Starred', value: stats.starred, color: 'var(--theme-accent)' },
          { label: 'Replied', value: stats.replied, color: '#10B981' },
        ].map((stat) => (
          <div 
            key={stat.label}
            className="p-4 rounded-xl"
            style={{ backgroundColor: 'var(--theme-surface)' }}
          >
            <p className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
            <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-6 h-[calc(100%-180px)]">
        {/* Messages List */}
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
              {(["all", "unread", "starred", "replied"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all`}
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
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-8 text-center"
                >
                  <Mail className="h-12 w-12 mx-auto mb-3" style={{ color: 'var(--theme-text)', opacity: 0.3 }} />
                  <p style={{ color: 'var(--theme-text)', opacity: 0.6 }}>No messages found</p>
                </motion.div>
              ) : (
                messages.map((message, index) => (
                  <motion.div
                    key={message._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleSelectMessage(message)}
                    className={`p-4 cursor-pointer transition-all border-b border-l-2`}
                    style={{ 
                      backgroundColor: selectedMessage?._id === message._id 
                        ? `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 10%, transparent), transparent)` 
                        : 'var(--theme-background)',
                      borderColor: selectedMessage?._id === message._id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                      borderLeftColor: selectedMessage?._id === message._id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                        style={{
                          backgroundColor: message.read ? 'var(--theme-surface)' : `linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 20%, transparent), color-mix(in srgb, var(--theme-secondary) 20%, transparent))`,
                          color: message.read ? 'var(--theme-text)' : 'var(--theme-primary)',
                          opacity: message.read ? 0.6 : 1,
                        }}
                      >
                        {message.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 
                            className="text-sm font-semibold truncate" 
                            style={{ 
                              color: 'var(--theme-text)',
                              opacity: message.read ? 0.6 : 1 
                            }}
                          >
                            {message.subject}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {message.starred && <Star className="h-3 w-3" style={{ color: 'var(--theme-accent)', fill: 'var(--theme-accent)' }} />}
                            {message.replied && <CheckCheck className="h-3 w-3" style={{ color: '#10B981' }} />}
                            {!message.read && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }} />}
                          </div>
                        </div>
                        {message.replied && message.replyText && (
                          <p className="text-xs truncate mb-1" style={{ color: '#10B981', opacity: 0.8 }}>
                            ↳ {message.replyText.slice(0, 50)}...
                          </p>
                        )}
                        <p className="text-xs truncate" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{message.name}</p>
                        <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.3 }}>{formatDate(message.createdAt)}</p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Message Detail */}
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
                      }}
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>{selectedMessage.subject}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(selectedMessage._id)}
                      className="p-2 rounded-lg transition-all"
                      style={{
                        backgroundColor: selectedMessage.starred ? 'var(--theme-accent)' : 'var(--theme-surface)',
                        color: selectedMessage.starred ? '#000' : 'var(--theme-text)',
                      }}
                    >
                      <Star className={`h-4 w-4 ${selectedMessage.starred ? "fill-current" : ""}`} />
                    </button>
                    <button 
                      onClick={() => deleteMessage(selectedMessage._id)}
                      className="p-2 rounded-lg transition-all"
                      style={{ 
                        backgroundColor: 'var(--theme-surface)', 
                        color: '#EF4444',
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg"
                    style={{ 
                      background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))', 
                      color: '#000' 
                    }}
                  >
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--theme-text)' }}>{selectedMessage.name}</h3>
                    <a 
                      href={`mailto:${selectedMessage.email}`} 
                      className="text-sm hover:underline"
                      style={{ color: 'var(--theme-text)', opacity: 0.6 }}
                    >
                      {selectedMessage.email}
                    </a>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                    <span>{formatDate(selectedMessage.createdAt)}</span>
                    <span>·</span>
                    <span>{formatTime(selectedMessage.createdAt)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                {selectedMessage.replyText && (
                  <div className="mb-6 rounded-xl overflow-hidden" style={{ backgroundColor: '#10B98110', border: '1px solid #10B98130' }}>
                    <div className="px-4 py-2 flex items-center gap-2" style={{ backgroundColor: '#10B98120' }}>
                      <CheckCheck className="h-4 w-4" style={{ color: '#10B981' }} />
                      <p className="text-xs font-semibold" style={{ color: '#10B981' }}>YOUR REPLY</p>
                    </div>
                    <div className="p-4">
                      <p className="text-sm whitespace-pre-line" style={{ color: 'var(--theme-text)' }}>{selectedMessage.replyText}</p>
                      <p className="text-xs mt-3 pt-3 border-t" style={{ color: 'var(--theme-text)', opacity: 0.5, borderColor: '#10B98130' }}>
                        Sent {selectedMessage.repliedAt ? formatDate(selectedMessage.repliedAt) : ''}
                      </p>
                    </div>
                  </div>
                )}
                <div className="prose prose-invert max-w-none">
                  <p className="whitespace-pre-line leading-relaxed" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{selectedMessage.message}</p>
                </div>
              </div>

              <div className="p-6 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                {selectedMessage.replied ? (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl" style={{ backgroundColor: '#10B98120' }}>
                    <CheckCheck className="h-5 w-5" style={{ color: '#10B981' }} />
                    <span className="font-semibold" style={{ color: '#10B981' }}>Reply Sent</span>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowReplyModal(true)}
                    className="flex-1 py-3 font-semibold rounded-xl transition-opacity flex items-center justify-center gap-2" 
                    style={{ 
                      background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                      color: '#000000',
                    }}
                  >
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div 
                  className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4" 
                  style={{ backgroundColor: 'var(--theme-surface)' }}
                >
                  <MessageSquare className="h-10 w-10" style={{ color: 'var(--theme-text)', opacity: 0.3 }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>Select a message</h3>
                <p style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Choose a message from the list to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Reply Modal */}
      <AnimatePresence>
        {showReplyModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowReplyModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-lg rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--theme-background)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b" style={{ borderColor: 'var(--theme-surface)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Reply to {selectedMessage?.name}</h2>
                  <button
                    onClick={() => setShowReplyModal(false)}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm mt-1" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                  Replying to: {selectedMessage?.email}
                </p>
              </div>
              
              <div className="p-6">
                {selectedMessage?.message && (
                  <div className="mb-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--theme-surface)' }}>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Original message:</p>
                    <p className="text-sm line-clamp-3" style={{ color: 'var(--theme-text)' }}>{selectedMessage.message}</p>
                  </div>
                )}
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write your reply..."
                  rows={6}
                  className="w-full p-4 rounded-xl resize-none focus:outline-none"
                  style={{ 
                    backgroundColor: 'var(--theme-surface)',
                    color: 'var(--theme-text)'
                  }}
                />
              </div>

              <div className="p-6 border-t flex gap-3" style={{ borderColor: 'var(--theme-surface)' }}>
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="flex-1 py-3 rounded-xl font-medium"
                  style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSendReply}
                  disabled={!replyText.trim() || sendingReply}
                  className="flex-1 py-3 rounded-xl font-medium flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ 
                    background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                    color: '#000'
                  }}
                >
                  {sendingReply ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send Reply
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
