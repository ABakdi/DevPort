"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  FileText, Folder, MessageSquare, Plus, Search, MoreHorizontal, Eye, Edit, Trash2, Copy, Check,
  TrendingUp, Clock, Calendar, Send, Star, ArrowUpRight, Filter, Grid3X3, List
} from "lucide-react"

const articles = [
  { id: 1, title: "Building Scalable APIs with Node.js", status: "published", category: "Backend", views: 2341, date: "2024-01-15", readTime: "12 min" },
  { id: 2, title: "React Server Components Guide", status: "published", category: "Frontend", views: 1892, date: "2024-01-12", readTime: "8 min" },
  { id: 3, title: "TypeScript Best Practices 2024", status: "published", category: "TypeScript", views: 1654, date: "2024-01-10", readTime: "10 min" },
  { id: 4, title: "Docker for Frontend Developers", status: "draft", category: "DevOps", views: 0, date: "2024-01-18", readTime: "6 min" },
  { id: 5, title: "GraphQL vs REST: A Complete Comparison", status: "published", category: "Backend", views: 1208, date: "2024-01-08", readTime: "15 min" },
]

const projects = [
  { id: 1, title: "Enterprise Data Lake Engine", status: "published", category: "Full Stack", year: 2024, demo: true, github: true },
  { id: 2, title: "Real-time Collaboration Platform", status: "published", category: "Full Stack", year: 2023, demo: true, github: true },
  { id: 3, title: "AI-Powered Code Review Tool", status: "draft", category: "AI/ML", year: 2024, demo: false, github: true },
  { id: 4, title: "E-commerce Dashboard", status: "published", category: "Frontend", year: 2023, demo: true, github: false },
]

const messages = [
  { id: 1, name: "John Smith", email: "john@example.com", subject: "Project Inquiry", date: "2024-01-18", read: false },
  { id: 2, name: "Sarah Johnson", email: "sarah@company.com", subject: "Collaboration opportunity", date: "2024-01-17", read: true },
  { id: 3, name: "Mike Williams", email: "mike@startup.io", subject: "Bug report on portfolio", date: "2024-01-16", read: true },
]

export default function AdminContent() {
  const [activeTab, setActiveTab] = useState("articles")
  const [viewMode, setViewMode] = useState<"grid" | "list">("list")
  const [searchQuery, setSearchQuery] = useState("")

  const tabs = [
    { id: "articles", label: "Articles", icon: FileText, count: 12, color: "#00E5FF" },
    { id: "projects", label: "Projects", icon: Folder, count: 8, color: "#8B5CF6" },
    { id: "messages", label: "Messages", icon: MessageSquare, count: 3, color: "#F59E0B" },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Content Management</h1>
          <p className="text-slate-400">Manage your articles, projects, and messages</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="group px-5 py-3 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-black font-bold rounded-xl shadow-lg shadow-[#00E5FF]/20 hover:shadow-[#00E5FF]/40 transition-all flex items-center gap-2"
        >
          <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform" />
          New {activeTab === "articles" ? "Article" : activeTab === "projects" ? "Project" : "Message"}
        </motion.button>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div className="flex gap-2 p-1 bg-[#0D1117] rounded-xl border border-[#1F2937] w-fit">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all ${
                activeTab === tab.id
                  ? "bg-gradient-to-r from-[#00E5FF]/20 to-[#8B5CF6]/20 text-white"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <tab.icon className="h-4 w-4" style={{ color: activeTab === tab.id ? tab.color : undefined }} />
              <span className="font-medium text-sm">{tab.label}</span>
              <span 
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  activeTab === tab.id 
                    ? "bg-[#1F2937] text-white" 
                    : "bg-[#1F2937]/50 text-slate-500"
                }`}
              >
                {tab.count}
              </span>
            </motion.button>
          ))}
        </div>

        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="h-10 pl-10 pr-4 rounded-xl bg-[#0D1117] border border-[#1F2937] text-white placeholder-slate-500 focus:outline-none focus:border-[#00E5FF] w-48 lg:w-64 transition-all"
            />
          </div>
          <div className="flex gap-1 p-1 bg-[#0D1117] rounded-xl border border-[#1F2937]">
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-[#1F2937] text-white" : "text-slate-500 hover:text-white"}`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-[#1F2937] text-white" : "text-slate-500 hover:text-white"}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "articles" && (
          <motion.div
            key="articles"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-3"
          >
            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <div className="col-span-6">Title</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Views</div>
              <div className="col-span-2">Date</div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {articles.map((article) => (
                <motion.div
                  key={article.id}
                  variants={itemVariants}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-[#0D1117] border border-[#1F2937] rounded-xl hover:border-[#00E5FF]/30 hover:bg-[#0D1117]/80 transition-all"
                >
                  <div className="lg:col-span-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 rounded-lg flex items-center justify-center">
                      <FileText className="h-5 w-5 text-[#00E5FF]" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-[#00E5FF] transition-colors">{article.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="px-2 py-0.5 bg-[#1F2937] rounded text-xs text-slate-400">{article.category}</span>
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Clock className="h-3 w-3" /> {article.readTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      article.status === "published" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {article.status}
                    </span>
                  </div>
                  <div className="lg:col-span-2 flex items-center gap-2 text-slate-400">
                    <TrendingUp className="h-4 w-4 text-[#00E5FF]" />
                    <span className="font-mono">{article.views.toLocaleString()}</span>
                  </div>
                  <div className="lg:col-span-2 flex items-center justify-between">
                    <span className="text-slate-400 text-sm">{article.date}</span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-white hover:bg-[#2a3544]">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-white hover:bg-[#2a3544]">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-red-400 hover:bg-red-400/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "projects" && (
          <motion.div
            key="projects"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <div className="hidden lg:grid grid-cols-12 gap-4 px-4 py-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
              <div className="col-span-5">Project</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Category</div>
              <div className="col-span-2">Year</div>
              <div className="col-span-1">Links</div>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  variants={itemVariants}
                  className="group grid grid-cols-1 lg:grid-cols-12 gap-4 p-4 bg-[#0D1117] border border-[#1F2937] rounded-xl hover:border-[#8B5CF6]/30 hover:bg-[#0D1117]/80 transition-all"
                >
                  <div className="lg:col-span-5 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#F59E0B]/20 rounded-lg flex items-center justify-center">
                      <Folder className="h-5 w-5 text-[#8B5CF6]" />
                    </div>
                    <h3 className="font-semibold text-white truncate group-hover:text-[#8B5CF6] transition-colors">{project.title}</h3>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === "published" 
                        ? "bg-emerald-500/20 text-emerald-400" 
                        : "bg-amber-500/20 text-amber-400"
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <span className="px-2 py-1 bg-[#1F2937] rounded text-xs text-slate-400">{project.category}</span>
                  </div>
                  <div className="lg:col-span-2 flex items-center">
                    <Calendar className="h-4 w-4 text-slate-500 mr-2" />
                    <span className="text-slate-400">{project.year}</span>
                  </div>
                  <div className="lg:col-span-1 flex items-center gap-2">
                    {project.demo && (
                      <a href="#" className="p-1.5 rounded-lg bg-[#1F2937] text-slate-400 hover:text-[#00E5FF] hover:bg-[#00E5FF]/10">
                        <ArrowUpRight className="h-4 w-4" />
                      </a>
                    )}
                    {project.github && (
                      <a href="#" className="p-1.5 rounded-lg bg-[#1F2937] text-slate-400 hover:text-white hover:bg-[#2a3544]">
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                        </svg>
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}

        {activeTab === "messages" && (
          <motion.div
            key="messages"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-2"
          >
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-2"
            >
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  variants={itemVariants}
                  className={`group p-4 bg-[#0D1117] border rounded-xl transition-all cursor-pointer ${
                    message.read 
                      ? "border-[#1F2937] hover:border-[#F59E0B]/30" 
                      : "border-l-4 border-l-[#F59E0B] border-[#1F2937] hover:border-[#F59E0B]/50"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold ${
                      message.read 
                        ? "bg-[#1F2937] text-slate-400" 
                        : "bg-gradient-to-br from-[#F59E0B]/20 to-[#FF2D55]/20 text-[#F59E0B]"
                    }`}>
                      {message.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold truncate ${message.read ? "text-slate-300" : "text-white"}`}>
                          {message.subject}
                        </h3>
                        {!message.read && (
                          <span className="w-2 h-2 bg-[#F59E0B] rounded-full animate-pulse" />
                        )}
                      </div>
                      <p className="text-sm text-slate-500 truncate">{message.name} · {message.email}</p>
                      <p className="text-xs text-slate-600 mt-2">{message.date}</p>
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-[#F59E0B] hover:bg-[#F59E0B]/10">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-emerald-400 hover:bg-emerald-400/10">
                        <Send className="h-4 w-4" />
                      </button>
                      <button className="p-2 rounded-lg bg-[#1F2937] text-slate-400 hover:text-red-400 hover:bg-red-400/10">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
