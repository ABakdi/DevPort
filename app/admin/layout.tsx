"use client"

import { useState } from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { useBackground } from "@/lib/use-animations"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const { backgroundStyles, backgroundVideo } = useBackground()

  return (
    <div 
      className="min-h-screen theme-component admin-bg"
      style={{ ...backgroundStyles }}
    >
      {/* Video background */}
      {backgroundVideo && (
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: -1 }}
        />
      )}
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
