"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Palette, Type, Layout, Sparkles, Download, RotateCcw, Check, Moon, Sun, Monitor,
  Palette as PaletteIcon, Layers, Eye, Plus, X, Save, Loader2, Trash2, Undo2
} from "lucide-react"
import { useThemeConfig } from "@/lib/theme-context"
import { cn } from "@/lib/utils"

const defaultThemeConfig = {
  primary: "#00E5FF",
  secondary: "#8B5CF6",
  accent: "#F59E0B",
  background: "#0D1117",
  surface: "#1F2937",
  text: "#ffffff",
  lightPrimary: "#0891B2",
  lightSecondary: "#7C3AED",
  lightAccent: "#D97706",
  lightBackground: "#F8FAFC",
  lightSurface: "#FFFFFF",
  lightText: "#0F172A",
  fontHeading: "Inter",
  fontBody: "Inter",
  fontSize: 16,
  borderRadius: "0.75rem",
  borderWidth: 1,
  iconStyle: "rounded",
  animations: true,
  darkMode: "dark",
  pageStyle: "default",
  componentStyle: "rounded",
  cardStyle: "default",
  buttonStyle: "default",
  inputStyle: "default",
  shadowIntensity: "medium",
  borderStyle: "solid",
}

const colorPresets = [
  { name: "Cyber Blue", primary: "#00E5FF", secondary: "#8B5CF6", accent: "#F59E0B", background: "#0D1117", surface: "#1F2937", text: "#ffffff", lightPrimary: "#0891B2", lightSecondary: "#7C3AED", lightAccent: "#D97706", lightBackground: "#F8FAFC", lightSurface: "#FFFFFF", lightText: "#0F172A" },
  { name: "Neon Green", primary: "#10B981", secondary: "#00E5FF", accent: "#F59E0B", background: "#0a0f0d", surface: "#1a1f1c", text: "#ffffff", lightPrimary: "#059669", lightSecondary: "#0891B2", lightAccent: "#D97706", lightBackground: "#F0FDF4", lightSurface: "#DCFCE7", lightText: "#052E16" },
  { name: "Sunset", primary: "#F59E0B", secondary: "#FF2D55", accent: "#8B5CF6", background: "#0f0a0a", surface: "#1f1a1a", text: "#ffffff", lightPrimary: "#D97706", lightSecondary: "#E11D48", lightAccent: "#7C3AED", lightBackground: "#FFFBEB", lightSurface: "#FEF3C7", lightText: "#78350F" },
  { name: "Purple Haze", primary: "#8B5CF6", secondary: "#FF2D55", accent: "#00E5FF", background: "#0a0a0f", surface: "#1a1a1f", text: "#ffffff", lightPrimary: "#7C3AED", lightSecondary: "#E11D48", lightAccent: "#0891B2", lightBackground: "#FAF5FF", lightSurface: "#F3E8FF", lightText: "#4C1D95" },
  { name: "Minimal Dark", primary: "#ffffff", secondary: "#6B7280", accent: "#00E5FF", background: "#000000", surface: "#171717", text: "#ffffff", lightPrimary: "#374151", lightSecondary: "#4B5563", lightAccent: "#0891B2", lightBackground: "#FFFFFF", lightSurface: "#F9FAFB", lightText: "#111827" },
  { name: "Ocean", primary: "#0EA5E9", secondary: "#10B981", accent: "#F59E0B", background: "#0a1628", surface: "#1f2a3d", text: "#ffffff", lightPrimary: "#0284C7", lightSecondary: "#059669", lightAccent: "#D97706", lightBackground: "#F0F9FF", lightSurface: "#E0F2FE", lightText: "#0C4A6E" },
  { name: "Rose Gold", primary: "#F43F5E", secondary: "#FBBF24", accent: "#8B5CF6", background: "#0f0a0d", surface: "#1f1a1d", text: "#ffffff", lightPrimary: "#E11D48", lightSecondary: "#F59E0B", lightAccent: "#7C3AED", lightBackground: "#FFF1F2", lightSurface: "#FFE4E6", lightText: "#881337" },
  { name: "Mint", primary: "#34D399", secondary: "#06B6D4", accent: "#F472B6", background: "#0a0f0d", surface: "#1a1f1c", text: "#ffffff", lightPrimary: "#10B981", lightSecondary: "#0891B2", lightAccent: "#DB2777", lightBackground: "#ECFDF5", lightSurface: "#D1FAE5", lightText: "#064E3B" },
  { name: "Crimson", primary: "#EF4444", secondary: "#F97316", accent: "#FBBF24", background: "#0a0505", surface: "#1a0f0f", text: "#ffffff", lightPrimary: "#DC2626", lightSecondary: "#EA580C", lightAccent: "#F59E0B", lightBackground: "#FEF2F2", lightSurface: "#FEE2E2", lightText: "#7F1D1D" },
  { name: "Aurora", primary: "#22D3EE", secondary: "#A78BFA", accent: "#F472B6", background: "#0a0d14", surface: "#1a1d24", text: "#ffffff", lightPrimary: "#06B6D4", lightSecondary: "#8B5CF6", lightAccent: "#DB2777", lightBackground: "#ECFEFF", lightSurface: "#CFFAFE", lightText: "#155E75" },
  { name: "Midnight", primary: "#6366F1", secondary: "#8B5CF6", accent: "#EC4899", background: "#020617", surface: "#0f172a", text: "#f8fafc", lightPrimary: "#4F46E5", lightSecondary: "#7C3AED", lightAccent: "#DB2777", lightBackground: "#FFFFFF", lightSurface: "#F5F3FF", lightText: "#312E81" },
  { name: "Forest", primary: "#22C55E", secondary: "#14B8A6", accent: "#F59E0B", background: "#052e16", surface: "#14532d", text: "#f0fdf4", lightPrimary: "#16A34A", lightSecondary: "#0D9488", lightAccent: "#D97706", lightBackground: "#F0FDF4", lightSurface: "#DCFCE7", lightText: "#14532D" },
  { name: "Slate", primary: "#64748B", secondary: "#94A3B8", accent: "#F59E0B", background: "#0f172a", surface: "#1e293b", text: "#f1f5f9", lightPrimary: "#475569", lightSecondary: "#64748B", lightAccent: "#D97706", lightBackground: "#F8FAFC", lightSurface: "#F1F5F9", lightText: "#1E293B" },
  { name: "Amber", primary: "#F59E0B", secondary: "#EF4444", accent: "#10B981", background: "#1a1205", surface: "#291c0a", text: "#fef3c7", lightPrimary: "#D97706", lightSecondary: "#DC2626", lightAccent: "#059669", lightBackground: "#FFFBEB", lightSurface: "#FEF3C7", lightText: "#78350F" },
  { name: "Cosmic", primary: "#D946EF", secondary: "#6366F1", accent: "#0EA5E9", background: "#0c0a1d", surface: "#1a1629", text: "#f5f3ff", lightPrimary: "#C026D3", lightSecondary: "#4F46E5", lightAccent: "#0284C7", lightBackground: "#FAF5FF", lightSurface: "#F3E8FF", lightText: "#4C1D95" },
]

const fontOptions = [
  { name: "Inter", value: "Inter", category: "Sans-serif" },
  { name: "Poppins", value: "Poppins", category: "Sans-serif" },
  { name: "Outfit", value: "Outfit", category: "Sans-serif" },
  { name: "Sora", value: "Sora", category: "Sans-serif" },
  { name: "Plus Jakarta Sans", value: "Plus Jakarta Sans", category: "Sans-serif" },
  { name: "Manrope", value: "Manrope", category: "Sans-serif" },
  { name: "JetBrains Mono", value: "JetBrains Mono", category: "Monospace" },
  { name: "Fira Code", value: "Fira Code", category: "Monospace" },
  { name: "Source Code Pro", value: "Source Code Pro", category: "Monospace" },
  { name: "Space Mono", value: "Space Mono", category: "Monospace" },
  { name: "IBM Plex Mono", value: "IBM Plex Mono", category: "Monospace" },
  { name: "Playfair Display", value: "Playfair Display", category: "Serif" },
  { name: "Merriweather", value: "Merriweather", category: "Serif" },
  { name: "Lora", value: "Lora", category: "Serif" },
]

const layoutPresets = [
  { name: "Sharp", borderRadius: "0px", borderWidth: 0, iconStyle: "square", layout: "sharp" },
  { name: "Square", borderRadius: "4px", borderWidth: 1, iconStyle: "square", layout: "square" },
  { name: "Soft", borderRadius: "8px", borderWidth: 1, iconStyle: "rounded", layout: "soft" },
  { name: "Rounded", borderRadius: "16px", borderWidth: 1, iconStyle: "rounded", layout: "rounded" },
  { name: "Pill", borderRadius: "9999px", borderWidth: 2, iconStyle: "pill", layout: "pill" },
  { name: "Beautiful Mix", borderRadius: "24px", borderWidth: 1, iconStyle: "rounded", layout: "mixed" },
]

interface CustomPalette {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
}

interface CustomLayout {
  name: string
  borderRadius: string
  borderWidth: number
  iconStyle: string
  layout: string
}

interface ThemeData {
  name: string
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
  layout: string
  animations: boolean
  darkMode: string
  logo: string
  favicon: string
  customPalettes: CustomPalette[]
  customLayouts: CustomLayout[]
  // Style properties
  pageStyle?: string
  componentStyle?: string
  cardStyle?: string
  buttonStyle?: string
  inputStyle?: string
  shadowIntensity?: string
  borderStyle?: string
}

const defaultTheme: ThemeData = {
  name: "Custom Theme",
  primary: "#00E5FF",
  secondary: "#8B5CF6",
  accent: "#F59E0B",
  background: "#0D1117",
  surface: "#1F2937",
  text: "#ffffff",
  fontHeading: "Inter",
  fontBody: "Inter",
  fontSize: 16,
  borderRadius: "rounded-xl",
  borderWidth: 1,
  iconStyle: "rounded",
  layout: "default",
  animations: true,
  darkMode: "dark",
  logo: "",
  favicon: "",
  customPalettes: [],
  customLayouts: [],
}

export default function AdminTheme() {
  const { theme: contextTheme, updateTheme, resetTheme, loading: contextLoading } = useThemeConfig()
  const [theme, setTheme] = useState({
    ...defaultThemeConfig,
    customPalettes: [],
    customLayouts: [],
  } as any)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('themeActiveTab')
      if (saved) return saved
    }
    return "styles"
  })

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (typeof window !== 'undefined') {
      localStorage.setItem('themeActiveTab', tab)
    }
  }

  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showCustomPaletteModal, setShowCustomPaletteModal] = useState(false)
  const [showCustomLayoutModal, setShowCustomLayoutModal] = useState(false)
  const [newPalette, setNewPalette] = useState<CustomPalette>({
    name: "",
    primary: "#00E5FF",
    secondary: "#8B5CF6",
    accent: "#F59E0B",
    background: "#0D1117",
    surface: "#1F2937",
    text: "#ffffff",
  })
  const [newLayout, setNewLayout] = useState<CustomLayout>({
    name: "",
    borderRadius: "12px",
    borderWidth: 1,
    iconStyle: "rounded",
    layout: "custom",
  })

  const applyThemeToDocument = useCallback((themeConfig: ThemeData) => {
    const root = document.documentElement
    root.style.setProperty('--theme-primary', themeConfig.primary)
    root.style.setProperty('--theme-secondary', themeConfig.secondary)
    root.style.setProperty('--theme-accent', themeConfig.accent)
    root.style.setProperty('--theme-background', themeConfig.background)
    root.style.setProperty('--theme-surface', themeConfig.surface)
    root.style.setProperty('--theme-text', themeConfig.text)
    root.style.setProperty('--theme-font-heading', themeConfig.fontHeading)
    root.style.setProperty('--theme-font-body', themeConfig.fontBody)
    root.style.setProperty('--theme-font-size', `${themeConfig.fontSize}px`)
    root.style.setProperty('--theme-border-radius', themeConfig.borderRadius)
    root.style.setProperty('--theme-border-width', `${themeConfig.borderWidth}px`)
    root.style.setProperty('--theme-icon-style', themeConfig.iconStyle)
    root.style.setProperty('--theme-layout', themeConfig.layout)
    
    // Apply style variables
    root.style.setProperty('--theme-page-style', themeConfig.pageStyle || 'default')
    root.style.setProperty('--theme-component-style', themeConfig.componentStyle || 'rounded')
    root.style.setProperty('--theme-card-style', themeConfig.cardStyle || 'default')
    root.style.setProperty('--theme-button-style', themeConfig.buttonStyle || 'default')
    root.style.setProperty('--theme-input-style', themeConfig.inputStyle || 'default')
    root.style.setProperty('--theme-shadow-intensity', themeConfig.shadowIntensity || 'medium')
    root.style.setProperty('--theme-border-style', themeConfig.borderStyle || 'solid')
    
    // Apply component radius values
    const radii = {
      sharp: '0px',
      square: '4px',
      rounded: '8px',
      pill: '24px',
    }
    root.style.setProperty('--theme-component-radius', radii[themeConfig.componentStyle as keyof typeof radii] || '8px')
    root.style.setProperty('--theme-button-radius', radii[themeConfig.buttonStyle as keyof typeof radii] || '8px')
    root.style.setProperty('--theme-input-radius', radii[themeConfig.inputStyle as keyof typeof radii] || '8px')
    root.style.setProperty('--theme-card-radius', themeConfig.cardStyle === 'pill' ? '28px' : themeConfig.cardStyle === 'square' ? '4px' : '12px')
    
    // Apply shadow
    const isDark = themeConfig.darkMode === 'dark'
    const shadows = {
      none: 'none',
      light: isDark ? '0 2px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.12)',
      medium: isDark ? '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.15)',
      heavy: isDark ? '0 10px 25px rgba(0,0,0,0.6), 0 5px 10px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.2)',
    }
    root.style.setProperty('--theme-shadow', shadows[themeConfig.shadowIntensity as keyof typeof shadows] || shadows.medium)
    
    document.body.classList.toggle('no-animations', !themeConfig.animations)
    
    if (themeConfig.darkMode === 'dark') {
      root.classList.add('dark')
    } else if (themeConfig.darkMode === 'light') {
      root.classList.remove('dark')
    }
  }, [])

  useEffect(() => {
    if (!contextLoading && contextTheme) {
      const tc = contextTheme as any
      setTheme({
        ...tc,
        customPalettes: tc.customPalettes || [],
        customLayouts: tc.customLayouts || [],
      } as any)
      setLoading(false)
    }
  }, [contextTheme, contextLoading])

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateTheme(theme)
      applyThemeToDocument(theme)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {
      console.error("Failed to save theme")
    }
    setSaving(false)
  }

  const handleReset = () => {
    const resetThemeConfig = {
      ...defaultThemeConfig,
      customPalettes: [],
      customLayouts: [],
    }
    resetTheme()
    setTheme(resetThemeConfig as any)
    applyThemeToDocument(resetThemeConfig as any)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setTheme({
      ...theme,
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
      background: preset.background,
      surface: preset.surface,
      text: preset.text,
      lightPrimary: preset.lightPrimary,
      lightSecondary: preset.lightSecondary,
      lightAccent: preset.lightAccent,
      lightBackground: preset.lightBackground,
      lightSurface: preset.lightSurface,
      lightText: preset.lightText,
    })
  }

  const applyLayoutPreset = (preset: typeof layoutPresets[0]) => {
    setTheme({
      ...theme,
      borderRadius: preset.borderRadius,
      borderWidth: preset.borderWidth,
      iconStyle: preset.iconStyle,
      layout: preset.layout,
    })
  }

  const saveCustomPalette = () => {
    if (!newPalette.name.trim()) return
    const updatedPalettes = [...theme.customPalettes, { ...newPalette }]
    setTheme({ ...theme, customPalettes: updatedPalettes })
    setShowCustomPaletteModal(false)
    setNewPalette({
      name: "",
      primary: "#00E5FF",
      secondary: "#8B5CF6",
      accent: "#F59E0B",
      background: "#0D1117",
      surface: "#1F2937",
      text: "#ffffff",
    })
  }

  const saveCustomLayout = () => {
    if (!newLayout.name.trim()) return
    const updatedLayouts = [...theme.customLayouts, { ...newLayout }]
    setTheme({ ...theme, customLayouts: updatedLayouts })
    setShowCustomLayoutModal(false)
    setNewLayout({
      name: "",
      borderRadius: "12px",
      borderWidth: 1,
      iconStyle: "rounded",
      layout: "custom",
    })
  }

  const deleteCustomPalette = (index: number) => {
    setTheme({ ...theme, customPalettes: theme.customPalettes?.filter((_: any, i: number) => i !== index) || [] })
  }

  const deleteCustomLayout = (index: number) => {
    setTheme({ ...theme, customLayouts: theme.customLayouts?.filter((_: any, i: number) => i !== index) || [] })
  }

  const getPageStyleGradient = (styleId: string): string => {
    const gradients: Record<string, string> = {
      default: 'linear-gradient(135deg, #1e293b, #0f172a)',
      material: 'linear-gradient(135deg, #4f46e5, #4338ca)',
      bento: 'linear-gradient(135deg, #f97316, #f43f5e)',
      minimalist: 'linear-gradient(135deg, #e5e7eb, #d1d5db)',
      neobrutalist: 'linear-gradient(135deg, #facc15, #eab308)',
      glass: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
      cyberpunk: 'linear-gradient(135deg, #ec4899, #a855f7)',
      soft: 'linear-gradient(135deg, #a78bfa, #e879f9)',
      tech: 'linear-gradient(135deg, #1e293b, #000000)',
      organic: 'linear-gradient(135deg, #10b981, #14b8a6)',
    }
    return gradients[styleId] || gradients.default
  }

  const getShadowStyle = (intensity: string): string => {
    const shadows: Record<string, string> = {
      none: 'none',
      light: '0 1px 2px rgba(0,0,0,0.1)',
      medium: '0 4px 6px rgba(0,0,0,0.15), 0 2px 4px rgba(0,0,0,0.1)',
      heavy: '0 10px 15px rgba(0,0,0,0.2), 0 4px 6px rgba(0,0,0,0.15)',
    }
    return shadows[intensity] || shadows.medium
  }

  const tabs = [
    { id: "styles", label: "Styles", icon: Sparkles },
    { id: "colors", label: "Colors", icon: PaletteIcon },
    { id: "typography", label: "Typography", icon: Type },
  ]

  const pageStyles = [
    { id: "default", name: "Default", desc: "Clean and balanced", preview: "bg-gradient-to-br from-slate-900 to-slate-800" },
    { id: "material", name: "Material", desc: "Elevation and depth", preview: "bg-gradient-to-br from-blue-600 to-indigo-800" },
    { id: "bento", name: "Bento", desc: "Grid-based modular", preview: "bg-gradient-to-br from-orange-500 to-rose-500" },
    { id: "minimalist", name: "Minimalist", desc: "Simple and clean", preview: "bg-gradient-to-br from-gray-200 to-gray-300" },
    { id: "neobrutalist", name: "Neo-Brutalist", desc: "Bold and raw", preview: "bg-yellow-400" },
    { id: "glass", name: "Glass", desc: "Frosted glass effect", preview: "bg-gradient-to-br from-cyan-400 to-blue-500" },
    { id: "cyberpunk", name: "Cyberpunk", desc: "Futuristic neon", preview: "bg-gradient-to-br from-pink-500 to-purple-600" },
    { id: "soft", name: "Soft", desc: "Gentle and smooth", preview: "bg-gradient-to-br from-violet-400 to-fuchsia-400" },
    { id: "tech", name: "Tech", desc: "Tech-forward aesthetic", preview: "bg-gradient-to-br from-slate-800 to-black" },
    { id: "organic", name: "Organic", desc: "Natural and warm", preview: "bg-gradient-to-br from-emerald-500 to-teal-600" },
  ]

  const componentStyles = [
    { id: "sharp", name: "Sharp", desc: "No rounding", radius: "0px" },
    { id: "square", name: "Square", desc: "Subtle corners", radius: "4px" },
    { id: "rounded", name: "Rounded", desc: "Smooth curves", radius: "8px" },
    { id: "pill", name: "Pill", desc: "Soft curves", radius: "24px" },
  ]

  const shadowIntensities = [
    { id: "none", name: "None", desc: "No shadows" },
    { id: "light", name: "Light", desc: "Subtle shadows" },
    { id: "medium", name: "Medium", desc: "Balanced shadows" },
    { id: "heavy", name: "Heavy", desc: "Prominent shadows" },
  ]

  const borderStyles = [
    { id: "none", name: "None", desc: "No borders" },
    { id: "solid", name: "Solid", desc: "Regular borders" },
    { id: "dashed", name: "Dashed", desc: "Dashed lines" },
    { id: "dotted", name: "Dotted", desc: "Dotted lines" },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 rounded-full animate-spin" style={{ borderColor: 'var(--theme-surface)', borderTopColor: 'var(--theme-primary)' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 animate-pulse" style={{ color: 'var(--theme-primary)' }} />
            </div>
          </div>
          <p style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Loading theme...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 pb-32">
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg backdrop-blur-xl border"
            style={{ 
              background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
              opacity: 0.9,
            }}
          >
            <Check className="h-5 w-5" style={{ color: '#000' }} />
            <span className="font-semibold" style={{ color: '#000' }}>Theme saved & applied!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-black mb-1" style={{ color: 'var(--theme-text)' }}>Theme Customization</h1>
          <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Customize colors, fonts, and layout</p>
        </div>
        <div className="flex gap-2 md:gap-3">
          <button 
            onClick={handleReset}
            className="px-3 md:px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2 text-sm"
            style={{ 
              backgroundColor: 'var(--theme-surface)', 
              color: 'var(--theme-text)',
              opacity: 0.7,
            }}
          >
            <RotateCcw className="h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button 
            className="px-3 md:px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2 text-sm"
            style={{ 
              backgroundColor: 'var(--theme-surface)', 
              color: 'var(--theme-text)',
              opacity: 0.7,
            }}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </motion.div>

      {/* Mobile/Tablet: Horizontal tabs with save button */}
      <div className="lg:hidden mb-6">
        <div className="rounded-2xl p-3 border" style={{ 
          backgroundColor: 'var(--theme-background)',
          borderColor: 'var(--theme-surface)',
        }}>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap"
                  style={{
                    background: isActive ? `linear-gradient(90deg, color-mix(in srgb, var(--theme-primary) 10%, transparent), transparent)` : 'var(--theme-surface)',
                    color: isActive ? 'var(--theme-primary)' : 'var(--theme-text)',
                    border: isActive ? '1px solid var(--theme-primary)' : '1px solid transparent',
                    opacity: isActive ? 1 : 0.7,
                  }}
                >
                  <tab.icon className="h-4 w-4" />
                  <span className="font-medium text-sm">{tab.label}</span>
                </button>
              )
            })}
          </div>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            style={{ 
              background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
              color: '#000000',
              boxShadow: '0 0 20px color-mix(in srgb, var(--theme-primary) 30%, transparent)',
            }}
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save & Apply"}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden lg:block lg:w-64 flex-shrink-0"
        >
          <div className="rounded-2xl p-2 sticky top-8 border section-bar" style={{ 
            backgroundColor: 'var(--theme-background)',
            borderColor: 'var(--theme-surface)',
          }}>
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabChange(tab.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200 relative"
                    style={{
                      background: 'transparent',
                      color: 'var(--theme-text)',
                    }}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="themeSidebarIndicator"
                        transition={{ type: "spring", stiffness: 500, damping: 35 }}
                        className="absolute left-0 top-2 bottom-2 w-[3px]"
                        style={{ 
                          background: 'var(--theme-primary)',
                          borderRadius: '0 6px 6px 0',
                        }}
                      />
                    )}
                    <tab.icon className="h-4 w-4 relative z-10" style={{ color: isActive ? 'var(--theme-primary)' : 'var(--theme-text)', opacity: isActive ? 1 : 0.6 }} />
                    <span className="font-medium text-sm relative z-10" style={{ opacity: isActive ? 1 : 0.6 }}>{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
            <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
              <button 
                onClick={handleSave}
                disabled={saving}
                className="w-full py-3 font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                style={{ 
                  background: 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                  color: '#000000',
                  boxShadow: '0 0 20px color-mix(in srgb, var(--theme-primary) 30%, transparent)',
                }}
              >
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save & Apply"}
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 space-y-4 lg:space-y-6"
        >
          {activeTab === "colors" && (
            <div className="space-y-4 lg:space-y-6">
              <motion.div className="rounded-2xl p-4 md:p-6 relative overflow-hidden border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-4 md:mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 20%, transparent), color-mix(in srgb, var(--theme-secondary) 20%, transparent))' 
                  }}>
                    <PaletteIcon className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Color Palette</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Customize your site's colors</p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {[
                    { key: "primary", label: "Primary Color", desc: "Main accent for buttons, links" },
                    { key: "secondary", label: "Secondary Color", desc: "Supporting accent for highlights" },
                    { key: "accent", label: "Accent Color", desc: "Tertiary color for special elements" },
                    { key: "background", label: "Background", desc: "Page background color" },
                    { key: "surface", label: "Surface", desc: "Card and container backgrounds" },
                    { key: "text", label: "Text Color", desc: "Primary text color" },
                  ].map((color) => (
                    <div key={color.key} className="flex items-center gap-3 md:gap-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border-2" style={{ borderColor: 'var(--theme-surface)' }}>
                        <input
                          type="color"
                          value={theme[color.key as keyof ThemeData] as string}
                          onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                          className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium" style={{ color: 'var(--theme-text)' }}>{color.label}</p>
                        <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{color.desc}</p>
                      </div>
                      <input
                        type="text"
                        value={theme[color.key as keyof ThemeData] as string}
                        onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                        className="w-24 h-10 px-3 rounded-lg border text-sm font-mono focus:outline-none"
                        style={{ 
                          backgroundColor: 'var(--theme-surface)', 
                          borderColor: 'var(--theme-surface)', 
                          color: 'var(--theme-text)',
                        }}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="rounded-2xl p-6 relative overflow-hidden border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-secondary) 20%, transparent), color-mix(in srgb, var(--theme-accent) 20%, transparent))' 
                  }}>
                    <Layers className="h-5 w-5" style={{ color: 'var(--theme-secondary)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Color Presets</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Quick-start with pre-built themes</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {colorPresets.map((preset) => (
                    <motion.button
                      key={preset.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyPreset(preset)}
                      className="p-3 rounded-xl border transition-all text-left"
                      style={{ 
                        backgroundColor: 'var(--theme-surface)', 
                        borderColor: 'var(--theme-surface)',
                        opacity: 0.7,
                      }}
                    >
                      <div className="flex gap-1 mb-2">
                        <div className="w-5 h-5 rounded-md flex-1" style={{ backgroundColor: preset.primary }} />
                        <div className="w-5 h-5 rounded-md flex-1" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-5 h-5 rounded-md flex-1" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <p className="text-xs font-medium" style={{ color: 'var(--theme-text)' }}>{preset.name}</p>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Custom Palettes</p>
                    <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{theme.customPalettes.length} saved</p>
                  </div>
                  <button
                    onClick={() => setShowCustomPaletteModal(true)}
                    className="px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2"
                    style={{ backgroundColor: 'var(--theme-secondary)', color: '#fff' }}
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                </div>

                {theme.customPalettes && theme.customPalettes.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {theme.customPalettes.map((palette: CustomPalette, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl border group relative"
                        style={{ 
                          backgroundColor: 'var(--theme-surface)',
                          opacity: 0.5,
                          borderColor: 'var(--theme-surface)',
                        }}
                      >
                        <button
                          onClick={() => deleteCustomPalette(index)}
                          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: 'var(--theme-text)', opacity: 0.5 }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="flex gap-1 mb-2">
                          <div className="w-5 h-5 rounded-md flex-1" style={{ backgroundColor: palette.primary }} />
                          <div className="w-5 h-5 rounded-md flex-1" style={{ backgroundColor: palette.secondary }} />
                          <div className="w-5 h-5 rounded-md flex-1" style={{ backgroundColor: palette.accent }} />
                        </div>
                        <p className="text-xs font-medium" style={{ color: 'var(--theme-text)' }}>{palette.name}</p>
                        <button
                          onClick={() => setTheme({
                            ...theme,
                            primary: palette.primary,
                            secondary: palette.secondary,
                            accent: palette.accent,
                            background: palette.background,
                            surface: palette.surface,
                            text: palette.text,
                          })}
                          className="text-xs mt-1 hover:underline"
                          style={{ color: 'var(--theme-primary)' }}
                        >
                          Apply
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div className="rounded-2xl p-6 relative overflow-hidden border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-secondary) 20%, transparent), color-mix(in srgb, var(--theme-accent) 20%, transparent))' 
                  }}>
                    <Moon className="h-5 w-5" style={{ color: 'var(--theme-secondary)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Dark Mode</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Configure dark/light theme</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  {[
                    { id: "dark", icon: Moon, label: "Dark" },
                    { id: "light", icon: Sun, label: "Light" },
                    { id: "system", icon: Monitor, label: "System" },
                  ].map((mode) => (
                    <button
                      key={mode.id}
                      onClick={() => setTheme({ ...theme, darkMode: mode.id })}
                      className="flex-1 py-4 rounded-xl border-2 transition-all"
                      style={{
                        borderColor: theme.darkMode === mode.id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                        background: theme.darkMode === mode.id ? 'color-mix(in srgb, var(--theme-primary) 10%, transparent)' : 'var(--theme-surface)',
                        opacity: theme.darkMode === mode.id ? 1 : 0.7,
                      }}
                    >
                      <mode.icon 
                        className="h-6 w-6 mx-auto mb-2" 
                        style={{ 
                          color: theme.darkMode === mode.id ? 'var(--theme-primary)' : 'var(--theme-text)',
                          opacity: theme.darkMode === mode.id ? 1 : 0.6,
                        }} 
                      />
                      <span 
                        className="text-sm font-medium"
                        style={{ color: theme.darkMode === mode.id ? 'var(--theme-text)' : 'var(--theme-text)' }}
                      >{mode.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-6">
              <motion.div className="rounded-2xl p-6 relative overflow-hidden border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    background: 'linear-gradient(135deg, color-mix(in srgb, #10B981 20%, transparent), color-mix(in srgb, var(--theme-primary) 20%, transparent))' 
                  }}>
                    <Type className="h-5 w-5" style={{ color: '#10B981' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Typography</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Choose fonts for your site</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: 'var(--theme-text)' }}>Heading Font</label>
                      <select
                        value={theme.fontHeading}
                        onChange={(e) => setTheme({ ...theme, fontHeading: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border focus:outline-none"
                        style={{ 
                          backgroundColor: 'var(--theme-surface)', 
                          borderColor: 'var(--theme-surface)', 
                          color: 'var(--theme-text)',
                        }}
                      >
                        <optgroup label="Sans-serif">
                          {fontOptions.filter(f => f.category === "Sans-serif").map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Serif">
                          {fontOptions.filter(f => f.category === "Serif").map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Monospace">
                          {fontOptions.filter(f => f.category === "Monospace").map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-3" style={{ color: 'var(--theme-text)' }}>Body Font</label>
                      <select
                        value={theme.fontBody}
                        onChange={(e) => setTheme({ ...theme, fontBody: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl border focus:outline-none"
                        style={{ 
                          backgroundColor: 'var(--theme-surface)', 
                          borderColor: 'var(--theme-surface)', 
                          color: 'var(--theme-text)',
                        }}
                      >
                        <optgroup label="Sans-serif">
                          {fontOptions.filter(f => f.category === "Sans-serif").map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Serif">
                          {fontOptions.filter(f => f.category === "Serif").map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="Monospace">
                          {fontOptions.filter(f => f.category === "Monospace").map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.name}</option>
                          ))}
                        </optgroup>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-3" style={{ color: 'var(--theme-text)' }}>
                      Base Font Size: {theme.fontSize}px
                    </label>
                    <div className="flex items-center gap-4">
                      <span className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>12px</span>
                      <input
                        type="range"
                        min="12"
                        max="24"
                        value={theme.fontSize}
                        onChange={(e) => setTheme({ ...theme, fontSize: parseInt(e.target.value) })}
                        className="flex-1 h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ backgroundColor: 'var(--theme-surface)' }}
                      />
                      <span className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>24px</span>
                    </div>
                  </div>

                  <div className="p-6 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)', fontFamily: theme.fontBody }}>
                    <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--theme-text)' }}>Preview</h3>
                    <div className="space-y-3">
                      <h1 className="text-3xl font-bold" style={{ fontFamily: theme.fontHeading, color: 'var(--theme-text)' }}>Heading 1 - The Quick Brown Fox</h1>
                      <h2 className="text-2xl font-bold" style={{ fontFamily: theme.fontHeading, color: 'var(--theme-text)' }}>Heading 2 - Jumps Over The Lazy Dog</h2>
                      <h3 className="text-xl font-semibold" style={{ fontFamily: theme.fontHeading, color: 'var(--theme-text)' }}>Heading 3 - Pack My Box With Five Dozen</h3>
                      <p className="text-base leading-relaxed" style={{ color: 'var(--theme-text)' }}>
                        This is sample body text. The quick brown fox jumps over the lazy dog. 
                        Typography plays a crucial role in web design.
                      </p>
                      <code className="text-sm px-3 py-2 rounded-lg font-mono" style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-primary)' }}>
                        const greeting = "Hello World";
                      </code>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "styles" && (
            <div className="space-y-6">
              {/* Component Styles */}
              <motion.div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    backgroundColor: 'var(--theme-surface)'
                  }}>
                    <Layout className="h-5 w-5" style={{ color: 'var(--theme-secondary)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Component Style</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Buttons, cards, inputs styling</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {componentStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme({ 
                        ...theme, 
                        componentStyle: style.id,
                        buttonStyle: style.id,
                        cardStyle: style.id,
                        inputStyle: style.id,
                      })}
                      className="p-4 rounded-xl border transition-all text-center"
                      style={{ 
                        backgroundColor: theme.componentStyle === style.id ? 'var(--theme-secondary)' : 'var(--theme-surface)',
                        borderColor: theme.componentStyle === style.id ? 'var(--theme-secondary)' : 'var(--theme-surface)',
                      }}
                    >
                      <div 
                        className="w-12 h-12 mx-auto mb-2" 
                        style={{ 
                          backgroundColor: 'var(--theme-primary)',
                          borderRadius: style.radius,
                        }} 
                      />
                      <p className="text-sm font-medium" style={{ color: theme.componentStyle === style.id ? '#fff' : 'var(--theme-text)' }}>{style.name}</p>
                      <p className="text-xs" style={{ color: theme.componentStyle === style.id ? '#fff' : 'var(--theme-text)', opacity: 0.6 }}>{style.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Shadow Intensity */}
              <motion.div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    backgroundColor: 'var(--theme-surface)'
                  }}>
                    <Layers className="h-5 w-5" style={{ color: 'var(--theme-accent)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Shadow Intensity</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Depth and elevation</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {shadowIntensities.map((intensity) => (
                    <motion.button
                      key={intensity.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme({ ...theme, shadowIntensity: intensity.id })}
                      className="p-4 rounded-xl border transition-all text-center"
                      style={{ 
                        backgroundColor: theme.shadowIntensity === intensity.id ? 'var(--theme-accent)' : 'var(--theme-surface)',
                        borderColor: theme.shadowIntensity === intensity.id ? 'var(--theme-accent)' : 'var(--theme-surface)',
                      }}
                    >
                      <div 
                        className="w-12 h-12 mx-auto mb-2" 
                        style={{ 
                          backgroundColor: 'var(--theme-primary)',
                          borderRadius: '8px',
                          boxShadow: getShadowStyle(intensity.id),
                        }} 
                      />
                      <p className="text-sm font-medium" style={{ color: theme.shadowIntensity === intensity.id ? '#000' : 'var(--theme-text)' }}>{intensity.name}</p>
                      <p className="text-xs" style={{ color: theme.shadowIntensity === intensity.id ? '#000' : 'var(--theme-text)', opacity: 0.6 }}>{intensity.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>

              {/* Border Style */}
              <motion.div className="rounded-2xl p-6 border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    backgroundColor: 'var(--theme-surface)'
                  }}>
                    <Layers className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Border Style</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Line styles for components</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {borderStyles.map((style) => (
                    <motion.button
                      key={style.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setTheme({ ...theme, borderStyle: style.id })}
                      className="p-4 rounded-xl border transition-all text-center"
                      style={{ 
                        backgroundColor: theme.borderStyle === style.id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                        borderColor: theme.borderStyle === style.id ? 'var(--theme-primary)' : 'var(--theme-surface)',
                      }}
                    >
                      <div 
                        className="w-12 h-12 mx-auto mb-2" 
                        style={{ 
                          backgroundColor: 'var(--theme-surface)',
                          borderWidth: '2px',
                          borderStyle: style.id === 'none' ? 'none' : style.id,
                          borderColor: 'var(--theme-text)',
                        }} 
                      />
                      <p className="text-sm font-medium" style={{ color: theme.borderStyle === style.id ? '#000' : 'var(--theme-text)' }}>{style.name}</p>
                      <p className="text-xs" style={{ color: theme.borderStyle === style.id ? '#000' : 'var(--theme-text)', opacity: 0.6 }}>{style.desc}</p>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </div>
          )}

          {activeTab === "typography" && (
            <div className="space-y-6">
              <motion.div className="rounded-2xl p-6 relative overflow-hidden border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    background: 'linear-gradient(135deg, color-mix(in srgb, var(--theme-accent) 20%, transparent), color-mix(in srgb, #FF2D55 20%, transparent))' 
                  }}>
                    <Layout className="h-5 w-5" style={{ color: 'var(--theme-accent)' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Layout Presets</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Choose your style</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {layoutPresets.map((preset) => (
                    <motion.button
                      key={preset.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyLayoutPreset(preset)}
                      className="p-4 rounded-xl border transition-all text-left"
                      style={{ 
                        backgroundColor: 'var(--theme-surface)', 
                        borderColor: 'var(--theme-surface)',
                        opacity: 0.7,
                      }}
                    >
                      <div className="flex gap-2 mb-3">
                        <div 
                          className="w-8 h-8" 
                          style={{ 
                            backgroundColor: theme.primary,
                            borderRadius: preset.borderRadius,
                            borderWidth: preset.borderWidth,
                            borderColor: theme.secondary
                          }} 
                        />
                        <div 
                          className="w-8 h-8" 
                          style={{ 
                            backgroundColor: theme.secondary,
                            borderRadius: preset.borderRadius,
                            borderWidth: preset.borderWidth,
                          }} 
                        />
                        <div 
                          className="w-8 h-8" 
                          style={{ 
                            backgroundColor: theme.accent,
                            borderRadius: preset.borderRadius,
                            borderWidth: preset.borderWidth,
                          }} 
                        />
                      </div>
                      <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>{preset.name}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                        {preset.borderRadius === "0px" ? "Sharp edges" : 
                         preset.borderRadius === "9999px" ? "Pill shape" :
                         `Radius: ${preset.borderRadius}`}
                      </p>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-6 pt-6 border-t" style={{ borderColor: 'var(--theme-surface)' }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Custom Layouts</p>
                    <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>{theme.customLayouts.length} saved</p>
                  </div>
                  <button
                    onClick={() => setShowCustomLayoutModal(true)}
                    className="px-4 py-2 font-medium rounded-xl transition-all flex items-center gap-2"
                    style={{ backgroundColor: 'var(--theme-accent)', color: '#fff' }}
                  >
                    <Plus className="h-4 w-4" />
                    New
                  </button>
                </div>

                {theme.customLayouts && theme.customLayouts.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                    {theme.customLayouts.map((layout: CustomLayout, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-3 rounded-xl border group relative"
                        style={{ 
                          backgroundColor: 'var(--theme-surface)',
                          opacity: 0.5,
                          borderColor: 'var(--theme-surface)',
                        }}
                      >
                        <button
                          onClick={() => deleteCustomLayout(index)}
                          className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{ color: 'var(--theme-text)', opacity: 0.5 }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                        <div className="flex gap-1 mb-2">
                          <div 
                            className="w-5 h-5 flex-1" 
                            style={{ 
                              backgroundColor: theme.primary,
                              borderRadius: layout.borderRadius,
                              borderWidth: layout.borderWidth,
                            }} 
                          />
                          <div 
                            className="w-5 h-5 flex-1" 
                            style={{ 
                              backgroundColor: theme.secondary,
                              borderRadius: layout.borderRadius,
                              borderWidth: layout.borderWidth,
                            }} 
                          />
                        </div>
                        <p className="text-xs font-medium" style={{ color: 'var(--theme-text)' }}>{layout.name}</p>
                        <button
                          onClick={() => setTheme({
                            ...theme,
                            borderRadius: layout.borderRadius,
                            borderWidth: layout.borderWidth,
                            iconStyle: layout.iconStyle,
                            layout: layout.layout,
                          })}
                          className="text-xs mt-1 hover:underline"
                          style={{ color: 'var(--theme-accent)' }}
                        >
                          Apply
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>

              <motion.div className="rounded-2xl p-6 relative overflow-hidden border" style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ 
                    background: 'linear-gradient(135deg, color-mix(in srgb, #FF2D55 20%, transparent), color-mix(in srgb, var(--theme-secondary) 20%, transparent))' 
                  }}>
                    <Sparkles className="h-5 w-5" style={{ color: '#FF2D55' }} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Animations</h2>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Control site animations</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-surface)' }}>
                  <div>
                    <p className="font-medium" style={{ color: 'var(--theme-text)' }}>Enable Animations</p>
                    <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Page transitions and micro-interactions</p>
                  </div>
                  <button
                    onClick={() => setTheme({ ...theme, animations: !theme.animations })}
                    className={`w-14 h-8 rounded-full transition-all relative ${
                      theme.animations ? "" : ""
                    }`}
                    style={{ backgroundColor: theme.animations ? 'var(--theme-primary)' : 'var(--theme-surface)' }}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${
                      theme.animations ? "left-7" : "left-1"
                    }`} />
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-80 flex-shrink-0 order-first lg:order-last"
        >
          <div className="border rounded-2xl p-3 md:p-4 sticky top-8" style={{ backgroundColor: 'var(--theme-background)', borderColor: 'var(--theme-surface)' }}>
            <div className="flex items-center justify-between mb-3 md:mb-4">
              <h3 className="font-semibold text-sm md:text-base" style={{ color: 'var(--theme-text)' }}>Live Preview</h3>
              <div className="flex gap-1 p-1 rounded-lg" style={{ backgroundColor: 'var(--theme-surface)' }}>
                {(["desktop", "tablet", "mobile"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className="p-1.5 rounded transition-all"
                    style={{ 
                      backgroundColor: previewMode === mode ? 'var(--theme-surface)' : 'transparent', 
                      color: previewMode === mode ? 'var(--theme-text)' : 'var(--theme-text)',
                      opacity: previewMode === mode ? 1 : 0.5,
                    }}
                  >
                    {mode === "desktop" && <Monitor className="h-4 w-4" />}
                    {mode === "tablet" && <Eye className="h-4 w-4" />}
                    {mode === "mobile" && <Eye className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
            <div 
              className="rounded-xl overflow-hidden mx-auto"
              style={{ 
                height: previewMode === "mobile" ? "380px" : previewMode === "tablet" ? "320px" : "280px",
                maxWidth: previewMode === "mobile" ? "280px" : previewMode === "tablet" ? "400px" : "100%",
                borderRadius: theme.borderRadius,
                fontFamily: theme.fontBody,
              }}
            >
              <div 
                className="h-5 flex items-center justify-between px-3 border-b"
                style={{ 
                  backgroundColor: theme.surface,
                  borderColor: theme.borderWidth > 0 ? theme.surface : 'transparent',
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div 
                  className="text-[8px] px-2 py-0.5 rounded"
                  style={{ backgroundColor: theme.background, color: theme.text }}
                >
                  yourname.dev
                </div>
                <div className="w-8" />
              </div>
              <div className="p-3" style={{ backgroundColor: theme.background, color: theme.text, fontSize: `${Math.max(10, theme.fontSize - 4)}px` }}>
                <div className="flex gap-2 mb-3">
                  <div 
                    className="w-12 h-12 flex-shrink-0"
                    style={{ 
                      backgroundColor: theme.primary + '30',
                      borderRadius: theme.borderRadius,
                    }} 
                  />
                  <div className="flex-1 space-y-1.5">
                    <div className="h-3 rounded w-3/4" style={{ backgroundColor: theme.surface }} />
                    <div className="h-2 rounded w-1/2" style={{ backgroundColor: theme.surface, opacity: 0.6 }} />
                  </div>
                </div>
                <div 
                  className="h-16 rounded-lg flex items-center justify-center gap-2 mb-2"
                  style={{ backgroundColor: theme.surface }}
                >
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: theme.primary }} 
                  />
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: theme.secondary }} 
                  />
                  <div 
                    className="w-8 h-8 rounded-lg"
                    style={{ backgroundColor: theme.accent }} 
                  />
                </div>
                <div className="flex gap-2">
                  <button 
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: theme.primary, color: '#000' }}
                  >
                    Button
                  </button>
                  <button 
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium"
                    style={{ borderWidth: theme.borderWidth, borderColor: theme.secondary, color: theme.text }}
                  >
                    Outline
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showCustomPaletteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomPaletteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-md border"
              style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Create Custom Palette</h3>
                <button onClick={() => setShowCustomPaletteModal(false)} className="p-2 transition-colors" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Palette Name</label>
                  <input
                    type="text"
                    value={newPalette.name}
                    onChange={(e) => setNewPalette({ ...newPalette, name: e.target.value })}
                    placeholder="My Custom Palette"
                    className="w-full h-12 px-4 rounded-xl border focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)',
                      borderColor: 'var(--theme-surface)',
                      color: 'var(--theme-text)',
                    }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { key: "primary", label: "Primary" },
                    { key: "secondary", label: "Secondary" },
                    { key: "accent", label: "Accent" },
                    { key: "background", label: "Background" },
                    { key: "surface", label: "Surface" },
                    { key: "text", label: "Text" },
                  ].map((color) => (
                    <div key={color.key}>
                      <label className="block text-xs mb-2" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>{color.label}</label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border" style={{ borderColor: 'var(--theme-surface)' }}>
                          <input
                            type="color"
                            value={newPalette[color.key as keyof CustomPalette] as string}
                            onChange={(e) => setNewPalette({ ...newPalette, [color.key]: e.target.value })}
                            className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                          />
                        </div>
                        <input
                          type="text"
                          value={newPalette[color.key as keyof CustomPalette] as string}
                          onChange={(e) => setNewPalette({ ...newPalette, [color.key]: e.target.value })}
                          className="w-16 h-10 px-2 rounded-lg border text-xs font-mono focus:outline-none"
                          style={{ 
                            backgroundColor: 'var(--theme-surface)', 
                            borderColor: 'var(--theme-surface)', 
                            color: 'var(--theme-text)',
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCustomPaletteModal(false)}
                    className="flex-1 py-3 font-medium rounded-xl transition-all"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      color: 'var(--theme-text)',
                      opacity: 0.6,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCustomPalette}
                    disabled={!newPalette.name.trim()}
                    className="flex-1 py-3 font-bold rounded-xl transition-all disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(90deg, var(--theme-accent), #FF2D55)',
                      color: '#fff',
                    }}
                  >
                    Save Palette
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showCustomLayoutModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowCustomLayoutModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="rounded-2xl p-6 w-full max-w-md border"
              style={{ 
                backgroundColor: 'var(--theme-background)',
                borderColor: 'var(--theme-surface)',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold" style={{ color: 'var(--theme-text)' }}>Create Custom Layout</h3>
                <button onClick={() => setShowCustomLayoutModal(false)} className="p-2 transition-colors" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Layout Name</label>
                  <input
                    type="text"
                    value={newLayout.name}
                    onChange={(e) => setNewLayout({ ...newLayout, name: e.target.value })}
                    placeholder="My Custom Layout"
                    className="w-full h-12 px-4 rounded-xl border focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)',
                      borderColor: 'var(--theme-surface)',
                      color: 'var(--theme-text)',
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Border Radius: {newLayout.borderRadius}</label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={parseInt(newLayout.borderRadius)}
                    onChange={(e) => setNewLayout({ ...newLayout, borderRadius: `${e.target.value}px` })}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--theme-surface)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Border Width: {newLayout.borderWidth}px</label>
                  <input
                    type="range"
                    min="0"
                    max="4"
                    value={newLayout.borderWidth}
                    onChange={(e) => setNewLayout({ ...newLayout, borderWidth: parseInt(e.target.value) })}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ backgroundColor: 'var(--theme-surface)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>Icon Style</label>
                  <select
                    value={newLayout.iconStyle}
                    onChange={(e) => setNewLayout({ ...newLayout, iconStyle: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)',
                      borderColor: 'var(--theme-surface)',
                      color: 'var(--theme-text)',
                    }}
                  >
                    <option value="square">Square</option>
                    <option value="rounded">Rounded</option>
                    <option value="pill">Pill</option>
                  </select>
                </div>
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCustomLayoutModal(false)}
                    className="flex-1 py-3 font-medium rounded-xl transition-all"
                    style={{ 
                      backgroundColor: 'var(--theme-surface)', 
                      color: 'var(--theme-text)',
                      opacity: 0.6,
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCustomLayout}
                    disabled={!newLayout.name.trim()}
                    className="flex-1 py-3 font-bold rounded-xl transition-all disabled:opacity-50"
                    style={{ 
                      background: 'linear-gradient(90deg, var(--theme-accent), #FF2D55)',
                      color: '#fff',
                    }}
                  >
                    Save Layout
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
