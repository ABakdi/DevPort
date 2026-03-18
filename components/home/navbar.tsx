"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Download, LogIn, Sun, Moon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useThemeConfig } from "@/lib/theme-context"
import { CVDownloadButton } from "./cv-download-button"

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/cv", label: "CV" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/projects", label: "Work" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, updateTheme } = useThemeConfig()
  const [isDark, setIsDark] = useState(true)

  useEffect(() => {
    setMounted(true)
    setIsDark(theme.darkMode !== 'light')
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [theme.darkMode])

  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark'
    updateTheme({ darkMode: newMode })
    setIsDark(!isDark)
  }

  if (!mounted) {
    return (
      <header className="sticky top-0 z-50 backdrop-blur-md" style={{ backgroundColor: 'var(--theme-background)' }}>
        <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black" style={{ backgroundColor: 'var(--theme-primary)' }}>D</div>
            <span className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>DevPort</span>
          </div>
        </nav>
      </header>
    )
  }

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 backdrop-blur-md transition-all duration-300"
      style={{ 
        backgroundColor: isScrolled ? 'var(--theme-background)' : 'transparent'
      }}
    >
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black" style={{ backgroundColor: 'var(--theme-primary)' }}>
            D
          </div>
          <span className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>DevPort</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:opacity-80 transition-colors"
              style={{ color: 'var(--theme-text)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full transition-colors"
            style={{ color: 'var(--theme-text)' }}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          <Button variant="ghost" size="sm" asChild className="hidden lg:flex" style={{ color: 'var(--theme-text)' }}>
            <Link href="/login">
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Link>
          </Button>
          <CVDownloadButton />
        </div>

        <button
          className="md:hidden p-2"
          style={{ color: 'var(--theme-text)' }}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium"
                  style={{ color: 'var(--theme-text)' }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
