"use client"

import { useThemeConfig } from "@/lib/theme-context"
import { useEffect, useState } from "react"

export function useTheme() {
  const { theme, loading } = useThemeConfig()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Return default values during SSR/loading to prevent hydration errors
  if (loading || !mounted) {
    return {
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
      animations: true,
    }
  }

  return theme
}
