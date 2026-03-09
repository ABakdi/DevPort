"use client"

import { useEffect, useState } from "react"

interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  fontHeading: string
  fontBody: string
  fontSize: number
  borderRadius: string
  borderWidth: number
  iconStyle: string
  animations: boolean
  darkMode: string
}

const defaultTheme: ThemeConfig = {
  primary: "#00E5FF",
  secondary: "#8B5CF6",
  accent: "#F59E0B",
  background: "#0D1117",
  surface: "#1F2937",
  text: "#ffffff",
  fontHeading: "Inter",
  fontBody: "Inter",
  fontSize: 16,
  borderRadius: "0.75rem",
  borderWidth: 1,
  iconStyle: "rounded",
  animations: true,
  darkMode: "dark",
}

function applyTheme(theme: ThemeConfig) {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  const body = document.body
  
  root.style.setProperty('--theme-primary', theme.primary)
  root.style.setProperty('--theme-secondary', theme.secondary)
  root.style.setProperty('--theme-accent', theme.accent)
  root.style.setProperty('--theme-background', theme.background)
  root.style.setProperty('--theme-surface', theme.surface)
  root.style.setProperty('--theme-text', theme.text)
  root.style.setProperty('--theme-font-heading', theme.fontHeading || 'Inter')
  root.style.setProperty('--theme-font-body', theme.fontBody || 'Inter')
  root.style.setProperty('--theme-font-size', `${theme.fontSize || 16}px`)
  root.style.setProperty('--theme-border-radius', theme.borderRadius || '0.75rem')
  root.style.setProperty('--theme-border-width', `${theme.borderWidth || 1}px`)
  root.style.setProperty('--theme-icon-style', theme.iconStyle || 'rounded')
  
  body.style.backgroundColor = theme.background
  body.style.color = theme.text
  body.style.fontFamily = `${theme.fontBody || 'Inter'}, system-ui, sans-serif`
  body.style.fontSize = `${theme.fontSize || 16}px`
  
  if (theme.animations === false) {
    body.classList.add('no-animations')
  } else {
    body.classList.remove('no-animations')
  }
  
  if (theme.darkMode === 'dark') {
    root.classList.add('dark')
  } else if (theme.darkMode === 'light') {
    root.classList.remove('dark')
  }
}

export function ThemeLoader({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Try localStorage first for instant load
    const stored = localStorage.getItem('theme-current')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        applyTheme(parsed)
        
        // Then fetch from API to ensure we have latest
        fetch('/api/theme')
          .then(res => res.json())
          .then(theme => {
            if (theme && theme.primary) {
              applyTheme(theme)
              localStorage.setItem('theme-current', JSON.stringify(theme))
            }
          })
          .catch(console.error)
      } catch (e) {
        // Fetch from API
        fetch('/api/theme')
          .then(res => res.json())
          .then(theme => {
            if (theme && theme.primary) {
              applyTheme(theme)
              localStorage.setItem('theme-current', JSON.stringify(theme))
            }
          })
          .catch(console.error)
      }
    } else {
      // Fetch from API
      fetch('/api/theme')
        .then(res => res.json())
        .then(theme => {
          if (theme && theme.primary) {
            applyTheme(theme)
            localStorage.setItem('theme-current', JSON.stringify(theme))
          }
        })
        .catch(console.error)
    }

    // Listen for theme change events
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeConfig>
      applyTheme(customEvent.detail)
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'theme-current' && e.newValue) {
        try {
          const theme = JSON.parse(e.newValue)
          applyTheme(theme)
        } catch (err) {
          console.error('Failed to apply theme from storage:', err)
        }
      }
    }

    window.addEventListener('theme-changed', handleThemeChange)
    window.addEventListener('storage', handleStorageChange)
    
    return () => {
      window.removeEventListener('theme-changed', handleThemeChange)
      window.removeEventListener('storage', handleStorageChange)
    }
  }, [])

  return <>{children}</>
}
