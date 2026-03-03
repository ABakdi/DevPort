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
        <h1 className="text-3xl font-black text-white mb-1">Messages</h1>
        <p className="text-slate-400">Manage contact form submissions</p>
      </motion.div>

      <div className="flex gap-6 h-[calc(100%-80px)]">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full md:w-96 flex-shrink-0 flex flex-col bg-[#0D1117] border border-[#1F2937] rounded-2xl overflow-hidden"
        >
          <div className="p-4 border-b border-[#1F2937]">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages..."
                className="w-full h-10 pl-10 pr-4 rounded-xl bg-[#1F2937] border border-transparent text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] transition-all"
              />
            </div>
            <div className="flex gap-1 p-1 bg-[#1F2937] rounded-lg">
              {(["all", "unread", "starred"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    filter === f 
                      ? "bg-[#00E5FF]/20 text-[#00E5FF]" 
                      : "text-slate-400 hover:text-white"
                  }`}
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
                  <Mail className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No messages found</p>
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
                    className={`p-4 border-b border-[#1F2937] cursor-pointer transition-all ${
                      selectedMessage?.id === message.id
                        ? "bg-gradient-to-r from-[#00E5FF]/10 to-transparent border-l-2 border-l-[#00E5FF]"
                        : "hover:bg-[#1F2937]/50 border-l-2 border-l-transparent"
                    } ${!message.read ? "bg-[#0D1117]" : ""}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                        message.read 
                          ? "bg-[#1F2937] text-slate-400" 
                          : "bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 text-[#00E5FF]"
                      }`}>
                        {message.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className={`text-sm font-semibold truncate ${message.read ? "text-slate-300" : "text-white"}`}>
                            {message.subject}
                          </h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            {message.starred && <Star className="h-3 w-3 text-[#F59E0B] fill-[#F59E0B]" />}
                            {!message.read && <span className="w-2 h-2 bg-[#00E5FF] rounded-full" />}
                          </div>
                        </div>
                        <p className="text-xs text-slate-500 truncate mb-1">{message.name}</p>
                        <p className="text-xs text-slate-600">{formatDate(message.date)}</p>
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
          className="flex-1 bg-[#0D1117] border border-[#1F2937] rounded-2xl overflow-hidden hidden md:flex flex-col"
        >
          {selectedMessage ? (
            <>
              <div className="p-6 border-b border-[#1F2937]">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-white hover:bg-[#2a3544] md:hidden"
                    >
                      <ArrowLeft className="h-4 w-4" />
                    </button>
                    <h2 className="text-xl font-bold text-white">{selectedMessage.subject}</h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleStar(selectedMessage.id)}
                      className={`p-2 rounded-lg transition-all ${
                        selectedMessage.starred 
                          ? "bg-[#F59E0B]/20 text-[#F59E0B]" 
                          : "bg-[#1F2937] text-slate-400 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${selectedMessage.starred ? "fill-current" : ""}`} />
                    </button>
                    <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-white hover:bg-[#2a3544]">
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-white hover:bg-[#2a3544]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center text-[#00E5FF] font-bold text-lg">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{selectedMessage.name}</h3>
                    <p className="text-sm text-slate-400">{selectedMessage.email}</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 text-slate-500">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">{formatDate(selectedMessage.date)}</span>
                    <span className="text-slate-600">·</span>
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{formatTime(selectedMessage.date)}</span>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-invert max-w-none">
                  <p className="text-slate-300 whitespace-pre-line leading-relaxed">{selectedMessage.message}</p>
                </div>
              </div>

              <div className="p-6 border-t border-[#1F2937]">
                <div className="flex items-center gap-3">
                  <button className="flex-1 py-3 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Reply className="h-4 w-4" />
                    Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#1F2937] rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-10 w-10 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Select a message</h3>
                <p className="text-slate-500">Choose a message from the list to view details</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
