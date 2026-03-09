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
    <div 
      className="min-h-screen theme-component"
      style={{ backgroundColor: 'var(--theme-background)' }}
    >
      <AdminSidebar collapsed={collapsed} onToggle={() => setCollapsed(!collapsed)} />
      <main
        className={`transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-[280px]"
        }`}
      >
        <div className="relative">
          <div 
            className="fixed top-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" 
            style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.05 }} 
          />
          <div 
            className="fixed top-1/2 right-0 w-[400px] h-[400px] rounded-full blur-[100px] pointer-events-none" 
            style={{ backgroundColor: 'var(--theme-secondary)', opacity: 0.05 }} 
          />
          {children}
        </div>
      </main>
    </div>
  )
}
