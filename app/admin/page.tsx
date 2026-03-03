"use client"

import { useState } from "react"
import Link from "next/link"
import {
  FileText,
  Folder,
  MessageSquare,
  Users,
  Eye,
  Download,
  Mail,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Calendar,
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const stats = [
  { label: "Total Visitors", value: "12,458", change: "+12.5%", trend: "up", icon: Eye },
  { label: "Article Reads", value: "8,234", change: "+8.2%", trend: "up", icon: FileText },
  { label: "CV Downloads", value: "1,205", change: "+24.1%", trend: "up", icon: Download },
  { label: "Subscribers", value: "456", change: "+15.3%", trend: "up", icon: Mail },
]

const trafficData = [
  { date: "Mon", visitors: 1200 },
  { date: "Tue", visitors: 1800 },
  { date: "Wed", visitors: 1400 },
  { date: "Thu", visitors: 2100 },
  { date: "Fri", visitors: 1900 },
  { date: "Sat", visitors: 900 },
  { date: "Sun", visitors: 1100 },
]

const topArticles = [
  { title: "Building Scalable APIs with Node.js", views: 2341, reads: "12 min" },
  { title: "React Server Components Guide", views: 1892, reads: "8 min" },
  { title: "TypeScript Best Practices 2024", views: 1654, reads: "10 min" },
  { title: "Docker for Frontend Developers", views: 1423, reads: "6 min" },
  { title: "GraphQL vs REST: A Complete Comparison", views: 1208, reads: "15 min" },
]

const trafficSources = [
  { name: "Direct", value: 35, color: "#00E5FF" },
  { name: "Google", value: 30, color: "#8B5CF6" },
  { name: "Twitter", value: 15, color: "#F59E0B" },
  { name: "GitHub", value: 12, color: "#10B981" },
  { name: "Other", value: 8, color: "#6B7280" },
]

const dateRanges = ["7 Days", "30 Days", "90 Days", "1 Year"]

export default function AdminDashboard() {
  const [selectedRange, setSelectedRange] = useState("7 Days")
  const today = new Date()
  const greeting = today.getHours() < 12 ? "Good morning" : today.getHours() < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-black text-white mb-1">
            {greeting}, Admin
          </h1>
          <div className="flex items-center gap-2 text-slate-400">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">
              {today.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          {dateRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all ${
                selectedRange === range
                  ? "bg-[#00E5FF] text-black"
                  : "bg-[#1F2937] text-slate-400 hover:text-white hover:bg-[#2a3544]"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group bg-[#0D1117] border border-[#1F2937] rounded-2xl p-5 lg:p-6 hover:border-[#00E5FF]/30 transition-all duration-300 hover:shadow-lg hover:shadow-[#00E5FF]/5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-11 h-11 bg-gradient-to-br from-[#00E5FF]/20 to-[#00E5FF]/5 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <stat.icon className="h-5 w-5 text-[#00E5FF]" />
              </div>
              <div className={`flex items-center gap-1 text-xs font-bold ${
                stat.trend === "up" ? "text-emerald-400" : "text-red-400"
              }`}>
                {stat.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {stat.change}
              </div>
            </div>
            <p className="text-2xl lg:text-3xl font-black text-white mb-1">{stat.value}</p>
            <p className="text-sm text-slate-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Traffic Overview</h2>
              <p className="text-sm text-slate-400">Visitor trends over time</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-sm text-emerald-400">
                <TrendingUp className="h-4 w-4" />
                +12.5%
              </span>
            </div>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trafficData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
                <XAxis
                  dataKey="date"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value / 1000}k`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  }}
                  labelStyle={{ color: "#9CA3AF" }}
                  itemStyle={{ color: "#00E5FF" }}
                />
                <Line
                  type="monotone"
                  dataKey="visitors"
                  stroke="#00E5FF"
                  strokeWidth={3}
                  dot={{ fill: "#00E5FF", strokeWidth: 2, r: 4, stroke: "#0D1117" }}
                  activeDot={{ r: 6, stroke: "#00E5FF", strokeWidth: 2, fill: "#0D1117" }}
                  fill="url(#colorVisitors)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Traffic Sources</h2>
            <p className="text-sm text-slate-400">Where your visitors come from</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={trafficSources}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {trafficSources.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1F2937",
                    border: "none",
                    borderRadius: "12px",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                  }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {trafficSources.map((source) => (
              <div key={source.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: source.color }} />
                  <span className="text-sm text-slate-300">{source.name}</span>
                </div>
                <span className="text-sm font-medium text-white">{source.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-white">Top Articles</h2>
              <p className="text-sm text-slate-400">Most read this month</p>
            </div>
            <Link
              href="/admin/content"
              className="text-sm text-[#00E5FF] hover:text-[#00E5FF]/80 flex items-center gap-1 transition-colors"
            >
              View all <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {topArticles.map((article, index) => (
              <div
                key={article.title}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#1F2937]/50 transition-colors group cursor-pointer"
              >
                <span className="text-lg font-black text-slate-600 group-hover:text-[#00E5FF] transition-colors">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate group-hover:text-[#00E5FF] transition-colors">
                    {article.title}
                  </p>
                  <p className="text-xs text-slate-500">
                    {article.views.toLocaleString()} views · {article.reads} read
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-white">Quick Actions</h2>
            <p className="text-sm text-slate-400">Frequently used features</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/admin/content"
              className="group p-4 bg-[#1F2937] rounded-xl hover:bg-[#2a3544] hover:border-[#00E5FF]/20 border border-transparent transition-all"
            >
              <div className="w-10 h-10 bg-[#00E5FF]/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FileText className="h-5 w-5 text-[#00E5FF]" />
              </div>
              <p className="font-semibold text-white group-hover:text-[#00E5FF] transition-colors">New Article</p>
              <p className="text-xs text-slate-500 mt-1">Create blog post</p>
            </Link>
            <Link
              href="/admin/profile"
              className="group p-4 bg-[#1F2937] rounded-xl hover:bg-[#2a3544] hover:border-[#8B5CF6]/20 border border-transparent transition-all"
            >
              <div className="w-10 h-10 bg-[#8B5CF6]/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Users className="h-5 w-5 text-[#8B5CF6]" />
              </div>
              <p className="font-semibold text-white group-hover:text-[#8B5CF6] transition-colors">Edit Profile</p>
              <p className="text-xs text-slate-500 mt-1">Update your info</p>
            </Link>
            <Link
              href="/admin/theme"
              className="group p-4 bg-[#1F2937] rounded-xl hover:bg-[#2a3544] hover:border-[#F59E0B]/20 border border-transparent transition-all"
            >
              <div className="w-10 h-10 bg-[#F59E0B]/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Folder className="h-5 w-5 text-[#F59E0B]" />
              </div>
              <p className="font-semibold text-white group-hover:text-[#F59E0B] transition-colors">Customize Theme</p>
              <p className="text-xs text-slate-500 mt-1">Colors & fonts</p>
            </Link>
            <Link
              href="/admin/messages"
              className="group p-4 bg-[#1F2937] rounded-xl hover:bg-[#2a3544] hover:border-[#10B981]/20 border border-transparent transition-all"
            >
              <div className="w-10 h-10 bg-[#10B981]/10 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <MessageSquare className="h-5 w-5 text-[#10B981]" />
              </div>
              <p className="font-semibold text-white group-hover:text-[#10B981] transition-colors">View Messages</p>
              <p className="text-xs text-slate-500 mt-1">Contact inbox</p>
            </Link>
          </div>

          <div className="mt-6 pt-6 border-t border-[#1F2937]">
            <Link
              href="/"
              className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-black font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <ArrowUpRight className="h-4 w-4" />
              View Live Site
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
