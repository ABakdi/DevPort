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
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/content", label: "Content", icon: FileText },
  { href: "/admin/profile", label: "Profile", icon: User },
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
      className="fixed left-0 top-0 h-screen z-40 flex flex-col"
      style={{
        background: "linear-gradient(180deg, #0D1117 0%, #0a0e14 100%)",
        boxShadow: "4px 0 30px rgba(0, 229, 255, 0.03)",
      }}
    >
      <div className="h-20 flex items-center justify-between px-5 border-b border-[#1F2937]/50">
        <AnimatePresence mode="wait">
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF] via-[#8B5CF6] to-[#F59E0B] rounded-xl flex items-center justify-center text-black font-black text-lg shadow-lg shadow-[#00E5FF]/20">
                  D
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0D1117] animate-pulse" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">DevPort</span>
                <p className="text-[10px] text-slate-500 -mt-0.5">Admin Panel</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {collapsed && (
          <div className="w-10 h-10 mx-auto bg-gradient-to-br from-[#00E5FF] via-[#8B5CF6] to-[#F59E0B] rounded-xl flex items-center justify-center text-black font-black shadow-lg shadow-[#00E5FF]/20">
            D
          </div>
        )}
      </div>

      <div className="px-3 py-4">
        <div className={`mb-6 ${collapsed ? "px-2" : "px-3"}`}>
          {!collapsed && (
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Menu</p>
          )}
          <ul className="space-y-1.5">
            {navItems.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== "/admin" && pathname.startsWith(item.href))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 relative overflow-hidden",
                      isActive
                        ? "bg-gradient-to-r from-[#00E5FF]/10 to-transparent text-[#00E5FF]"
                        : "text-slate-400 hover:text-white hover:bg-[#1F2937]/50"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#00E5FF] to-[#8B5CF6] rounded-r-full"
                      />
                    )}
                    <div className={cn(
                      "relative z-10 flex items-center gap-3 min-w-0",
                      collapsed ? "justify-center" : ""
                    )}>
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 flex-shrink-0",
                        isActive 
                          ? "bg-[#00E5FF]/20 shadow-lg shadow-[#00E5FF]/20" 
                          : "bg-[#1F2937] group-hover:bg-[#2a3544]"
                      )}>
                        <item.icon className={cn(
                          "h-4 w-4 transition-all duration-300",
                          isActive ? "text-[#00E5FF]" : "text-slate-400 group-hover:text-white"
                        )} />
                      </div>
                      {!collapsed && (
                        <span className={cn(
                          "font-medium text-sm truncate",
                          isActive ? "text-white" : ""
                        )}>
                          {item.label}
                        </span>
                      )}
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute right-3"
                      >
                        <Zap className="h-3 w-3 text-[#00E5FF] animate-pulse" />
                      </motion.div>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <div className="mt-auto p-3 border-t border-[#1F2937]/50">
        {!collapsed && (
          <div className="px-3 mb-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Actions</p>
          </div>
        )}
        <div className="space-y-1.5">
          <Link
            href="/"
            className={cn(
              "group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-[#1F2937]/50 transition-all",
              collapsed && "justify-center"
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-[#1F2937] group-hover:bg-[#2a3544] flex items-center justify-center transition-all">
              <Sparkles className="h-4 w-4" />
            </div>
            {!collapsed && <span className="font-medium text-sm">View Site</span>}
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className={cn(
              "w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-[#1F2937]/50 transition-all",
              collapsed && "justify-center"
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-[#1F2937] group-hover:bg-[#2a3544] flex items-center justify-center transition-all">
              <LogOut className="h-4 w-4" />
            </div>
            {!collapsed && <span className="font-medium text-sm">Sign Out</span>}
          </button>
          <button
            onClick={onToggle}
            className={cn(
              "w-full group flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-[#1F2937]/50 transition-all",
              collapsed && "justify-center"
            )}
          >
            <div className="w-9 h-9 rounded-lg bg-[#1F2937] group-hover:bg-[#2a3544] flex items-center justify-center transition-all">
              {collapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </div>
            {!collapsed && <span className="font-medium text-sm">Collapse</span>}
          </button>
        </div>

        {!collapsed && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 mx-3 p-3 rounded-xl bg-gradient-to-br from-[#1F2937] to-[#0D1117] border border-[#1F2937]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-slate-400">System Status</span>
            </div>
            <p className="text-xs text-slate-500">All services operational</p>
          </motion.div>
        )}
      </div>
    </motion.aside>
  )
}
