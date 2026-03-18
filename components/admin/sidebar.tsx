"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LayoutDashboard,
  FileText,
  Folder,
  User,
  MessageSquare,
  Palette,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  FileTextIcon,
} from "lucide-react"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/profile", label: "Profile", icon: User },
  { href: "/admin/cv", label: "CV Builder", icon: FileTextIcon },
  { href: "/admin/theme", label: "Theme", icon: Palette },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/settings", label: "Settings", icon: Settings },
]

interface AdminSidebarProps {
  collapsed?: boolean
  onToggle?: () => void
}

export function AdminSidebar({ collapsed = false, onToggle }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={false}
      animate={{ width: collapsed ? 80 : 280 }}
      className="fixed left-0 top-0 h-screen z-40 flex flex-col admin-sidebar"
      style={{
        background: "linear-gradient(180deg, var(--theme-background) 0%, var(--theme-surface) 100%)",
        borderRadius: '0px',
        boxShadow: '4px 0 24px rgba(0,0,0,0.15)',
      }}
    >
      {/* Logo Section */}
      <div className="h-20 flex items-center justify-between px-5 border-b flex-shrink-0" style={{ borderColor: 'var(--theme-surface)' }}>
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-lg"
                  style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))' }}
                >
                  D
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2" style={{ borderColor: 'var(--theme-background)' }} />
              </div>
              <div>
                <span className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>DevPort</span>
                <p className="text-[10px]" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div 
            className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center text-black font-black"
            style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))' }}
          >
            D
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ overflowY: 'auto', overflowX: 'hidden' }}>
        <div className={`mb-6 ${collapsed ? "px-2" : "px-3"}`}>
          {!collapsed && (
            <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Menu</p>
          )}
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 relative"
                    style={{
                      background: isActive ? `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 12%, transparent), transparent)` : 'transparent',
                      color: 'var(--theme-text)',
                    }}
                  >
                    {/* Left indicator - rounded to hug the item */}
                    {isActive && (
                      <motion.div
                        layoutId="sidebarActiveIndicator"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute left-0 top-2 bottom-2 w-[3px]"
                        style={{ 
                          background: 'var(--theme-primary)',
                          borderRadius: '0 6px 6px 0',
                        }}
                      />
                    )}
                    {/* Icon - always visible, just changes color */}
                    <div 
                      className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 relative z-10"
                    >
                      <item.icon 
                        className="h-4 w-4 transition-colors duration-200" 
                        style={{ 
                          color: isActive ? 'var(--theme-primary)' : 'var(--theme-text)', 
                          opacity: isActive ? 1 : 0.7 
                        }} 
                      />
                    </div>
                    {!collapsed && (
                      <span 
                        className="font-medium text-sm truncate relative z-10"
                        style={{ 
                          color: isActive ? 'var(--theme-text)' : 'var(--theme-text)',
                          opacity: isActive ? 1 : 0.7 
                        }}
                      >
                        {item.label}
                      </span>
                    )}
                    {/* Zap icon on active */}
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="absolute right-3"
                      >
                        <Zap className="h-3 w-3" style={{ color: 'var(--theme-primary)' }} />
                      </motion.div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-auto p-3 border-t flex-shrink-0" style={{ borderColor: 'var(--theme-surface)' }}>
        {!collapsed && (
          <div className="px-3 mb-3">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Actions</p>
          </div>
        )}
        <div className="space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
            style={{ color: 'var(--theme-text)', opacity: 0.7 }}
          >
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center" 
              style={{ backgroundColor: 'var(--theme-surface)' }}
            >
              <Sparkles className="h-4 w-4" style={{ color: 'var(--theme-text)', opacity: 0.7 }} />
            </div>
            {!collapsed && <span className="font-medium text-sm">View Site</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="sidebar-btn w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
            style={{ color: 'var(--theme-text)', opacity: 0.7 }}
          >
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center" 
              style={{ backgroundColor: 'var(--theme-surface)' }}
            >
              <LogOut className="h-4 w-4" style={{ color: 'var(--theme-text)', opacity: 0.7 }} />
            </div>
            {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
          </button>
          <button
            onClick={onToggle}
            className="sidebar-btn w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
            style={{ color: 'var(--theme-text)', opacity: 0.7 }}
          >
            <div 
              className="w-9 h-9 rounded-lg flex items-center justify-center" 
              style={{ backgroundColor: 'var(--theme-surface)' }}
            >
              {collapsed ? (
                <ChevronRight className="h-4 w-4" style={{ color: 'var(--theme-text)', opacity: 0.7 }} />
              ) : (
                <ChevronLeft className="h-4 w-4" style={{ color: 'var(--theme-text)', opacity: 0.7 }} />
              )}
            </div>
            {!collapsed && <span className="font-medium text-sm">Collapse</span>}
          </button>
        </div>

        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 mx-3 p-3 rounded-xl"
            style={{ 
              background: 'var(--theme-surface)',
              border: '1px solid var(--theme-surface)',
              opacity: 0.6,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>System Status</span>
            </div>
            <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>All services operational</p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}
