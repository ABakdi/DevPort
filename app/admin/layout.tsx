"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-[#05070a]">
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-[280px]"
        }`}
      >
        <div className="relative">
          <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-[#00E5FF]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="fixed top-1/2 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/5 rounded-full blur-[100px] pointer-events-none" />
          {children}
        </div>
      </main>
    </div>
  )
}
