"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  Palette, Type, Image, Sparkles, Download, Upload, RotateCcw, Check, Moon, Sun, Monitor,
  Palette as PaletteIcon, PenTool, Sparkle, Layers, Eye, Plus, X, Save, Loader2, Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"

const colorPresets = [
  { name: "Cyber Blue", primary: "#00E5FF", secondary: "#8B5CF6", accent: "#F59E0B", background: "#0D1117" },
  { name: "Neon Green", primary: "#10B981", secondary: "#00E5FF", accent: "#F59E0B", background: "#0a0f0d" },
  { name: "Sunset", primary: "#F59E0B", secondary: "#FF2D55", accent: "#8B5CF6", background: "#0f0a0a" },
  { name: "Purple Haze", primary: "#8B5CF6", secondary: "#FF2D55", accent: "#00E5FF", background: "#0a0a0f" },
  { name: "Minimal Dark", primary: "#ffffff", secondary: "#6B7280", accent: "#00E5FF", background: "#000000" },
  { name: "Ocean", primary: "#0EA5E9", secondary: "#10B981", accent: "#F59E0B", background: "#0a1628" },
  { name: "Rose Gold", primary: "#F43F5E", secondary: "#FBBF24", accent: "#8B5CF6", background: "#0f0a0d" },
  { name: "Mint", primary: "#34D399", secondary: "#06B6D4", accent: "#F472B6", background: "#0a0f0d" },
  { name: "Crimson", primary: "#EF4444", secondary: "#F97316", accent: "#FBBF24", background: "#0a0505" },
  { name: "Aurora", primary: "#22D3EE", secondary: "#A78BFA", accent: "#F472B6", background: "#0a0d14" },
]

const fontOptions = [
  { name: "Inter", value: "Inter", category: "Sans-serif" },
  { name: "JetBrains Mono", value: "JetBrains Mono", category: "Monospace" },
  { name: "Fira Code", value: "Fira Code", category: "Monospace" },
  { name: "Source Code Pro", value: "Source Code Pro", category: "Monospace" },
  { name: "Space Mono", value: "Space Mono", category: "Monospace" },
  { name: "Poppins", value: "Poppins", category: "Sans-serif" },
  { name: "Outfit", value: "Outfit", category: "Sans-serif" },
  { name: "Sora", value: "Sora", category: "Sans-serif" },
]

interface CustomPalette {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
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
  borderRadius: number
  animations: boolean
  darkMode: string
  logo: string
  favicon: string
  customPalettes: CustomPalette[]
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
  borderRadius: 12,
  animations: true,
  darkMode: "dark",
  logo: "",
  favicon: "",
  customPalettes: [],
}

export default function AdminTheme() {
  const [theme, setTheme] = useState<ThemeData>(defaultTheme)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState("colors")
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [showCustomPaletteModal, setShowCustomPaletteModal] = useState(false)
  const [newPalette, setNewPalette] = useState<CustomPalette>({
    name: "",
    primary: "#00E5FF",
    secondary: "#8B5CF6",
    accent: "#F59E0B",
    background: "#0D1117",
  })

  useEffect(() => {
    fetch("/api/theme")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.name) {
          setTheme({
            ...defaultTheme,
            ...data,
            customPalettes: data.customPalettes || [],
          })
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch("/api/theme", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(theme),
      })

      if (res.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch {
      console.error("Failed to save theme")
    }
    setSaving(false)
  }

  const handleReset = () => {
    setTheme(defaultTheme)
  }

  const applyPreset = (preset: typeof colorPresets[0]) => {
    setTheme({
      ...theme,
      primary: preset.primary,
      secondary: preset.secondary,
      accent: preset.accent,
      background: preset.background,
    })
  }

  const applyCustomPalette = (palette: CustomPalette) => {
    setTheme({
      ...theme,
      primary: palette.primary,
      secondary: palette.secondary,
      accent: palette.accent,
      background: palette.background,
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
    })
  }

  const deleteCustomPalette = (index: number) => {
    const updatedPalettes = theme.customPalettes.filter((_, i) => i !== index)
    setTheme({ ...theme, customPalettes: updatedPalettes })
  }

  const tabs = [
    { id: "colors", label: "Colors", icon: PaletteIcon },
    { id: "typography", label: "Typography", icon: Type },
    { id: "branding", label: "Branding", icon: Image },
    { id: "animations", label: "Animations", icon: Sparkles },
    { id: "presets", label: "Presets", icon: Layers },
  ]

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-[#1F2937] border-t-[#00E5FF] rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-[#00E5FF] animate-pulse" />
            </div>
          </div>
          <p className="text-slate-400">Loading theme...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <AnimatePresence>
        {saved && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.9 }}
            className="fixed top-6 right-6 z-50 bg-gradient-to-r from-emerald-500/20 to-emerald-600/20 border border-emerald-500/50 text-emerald-400 px-6 py-3 rounded-2xl flex items-center gap-3 shadow-lg shadow-emerald-500/20 backdrop-blur-xl"
          >
            <Check className="h-5 w-5" />
            <span className="font-semibold">Theme saved successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-3xl font-black text-white mb-1">Theme Customization</h1>
          <p className="text-slate-400">Customize the look and feel of your site</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleReset}
            className="px-4 py-2.5 bg-[#1F2937] text-slate-400 font-medium rounded-xl hover:text-white hover:bg-[#2a3544] transition-all flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>
          <button className="px-4 py-2.5 bg-[#1F2937] text-slate-400 font-medium rounded-xl hover:text-white hover:bg-[#2a3544] transition-all flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 bg-gradient-to-r from-[#00E5FF] to-[#8B5CF6] text-black font-bold rounded-xl shadow-lg shadow-[#00E5FF]/20 hover:shadow-[#00E5FF]/40 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-72 flex-shrink-0"
        >
          <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-2 sticky top-8">
            <nav className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                      isActive
                        ? "bg-gradient-to-r from-[#00E5FF]/10 to-transparent text-[#00E5FF] border-l-2 border-[#00E5FF]"
                        : "text-slate-400 hover:text-white hover:bg-[#1F2937]/50"
                    }`}
                  >
                    <tab.icon className="h-4 w-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </motion.button>
                )
              })}
            </nav>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 space-y-6"
        >
          {activeTab === "colors" && (
            <>
              <motion.div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#00E5FF] via-[#8B5CF6] to-[#F59E0B]" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#00E5FF]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                    <PaletteIcon className="h-5 w-5 text-[#00E5FF]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Color Palette</h2>
                    <p className="text-sm text-slate-400">Customize your site's colors</p>
                  </div>
                </div>
                
                <div className="space-y-5">
                  {[
                    { key: "primary", label: "Primary Color", desc: "Main accent color for buttons, links" },
                    { key: "secondary", label: "Secondary Color", desc: "Supporting accent for highlights" },
                    { key: "accent", label: "Accent Color", desc: "Tertiary color for special elements" },
                    { key: "background", label: "Background", desc: "Page background color" },
                    { key: "surface", label: "Surface", desc: "Card and container backgrounds" },
                    { key: "text", label: "Text Color", desc: "Primary text color" },
                  ].map((color) => (
                    <div key={color.key} className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-[#1F2937]">
                        <input
                          type="color"
                          value={theme[color.key as keyof ThemeData] as string}
                          onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                          className="w-[150%] h-[150%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-white">{color.label}</p>
                        <p className="text-xs text-slate-500">{color.desc}</p>
                      </div>
                      <input
                        type="text"
                        value={theme[color.key as keyof ThemeData] as string}
                        onChange={(e) => setTheme({ ...theme, [color.key]: e.target.value })}
                        className="w-24 h-10 px-3 rounded-lg bg-[#1F2937] border border-[#1F2937] text-white text-sm font-mono focus:outline-none focus:border-[#00E5FF]"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#FF2D55]" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#FF2D55]/20 rounded-xl flex items-center justify-center">
                    <Moon className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Dark Mode</h2>
                    <p className="text-sm text-slate-400">Configure dark/light theme</p>
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
                      className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                        theme.darkMode === mode.id
                          ? "border-[#00E5FF] bg-[#00E5FF]/10"
                          : "border-[#1F2937] bg-[#1F2937]/50 hover:border-[#2a3544]"
                      }`}
                    >
                      <mode.icon className={`h-6 w-6 mx-auto mb-2 ${
                        theme.darkMode === mode.id ? "text-[#00E5FF]" : "text-slate-400"
                      }`} />
                      <span className={`text-sm font-medium ${
                        theme.darkMode === mode.id ? "text-white" : "text-slate-400"
                      }`}>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            </>
          )}

          {activeTab === "typography" && (
            <motion.div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10B981] to-[#00E5FF]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#10B981]/20 to-[#00E5FF]/20 rounded-xl flex items-center justify-center">
                  <Type className="h-5 w-5 text-[#10B981]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Typography</h2>
                  <p className="text-sm text-slate-400">Choose fonts for your site</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { key: "fontHeading", label: "Headings Font" },
                    { key: "fontBody", label: "Body Font" },
                  ].map((font) => (
                    <div key={font.key}>
                      <label className="block text-sm font-medium text-slate-300 mb-3">{font.label}</label>
                      <select
                        value={theme[font.key as keyof ThemeData] as string}
                        onChange={(e) => setTheme({ ...theme, [font.key]: e.target.value })}
                        className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border border-[#1F2937] text-white focus:outline-none focus:border-[#10B981]"
                      >
                        <optgroup label="Sans-serif">
                          {fontOptions.filter(f => f.category === "Sans-serif").map((opt) => (
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
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Border Radius</label>
                  <div className="flex items-center gap-4">
                    <input
                      type="range"
                      min="0"
                      max="24"
                      value={theme.borderRadius}
                      onChange={(e) => setTheme({ ...theme, borderRadius: parseInt(e.target.value) })}
                      className="flex-1 h-2 bg-[#1F2937] rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                    />
                    <span className="w-16 text-center font-mono text-white">{theme.borderRadius}px</span>
                  </div>
                </div>

                <div className="p-6 bg-[#1F2937]/50 rounded-xl">
                  <h3 className="text-sm font-medium text-slate-300 mb-4">Preview</h3>
                  <div className="space-y-3">
                    <h1 className="text-3xl font-bold" style={{ fontFamily: theme.fontHeading }}>Heading 1</h1>
                    <h2 className="text-2xl font-bold" style={{ fontFamily: theme.fontHeading }}>Heading 2</h2>
                    <p className="text-base" style={{ fontFamily: theme.fontBody }}>
                      This is sample body text. The quick brown fox jumps over the lazy dog.
                    </p>
                    <code className="text-sm px-3 py-2 bg-[#0D1117] rounded-lg" style={{ fontFamily: "JetBrains Mono" }}>
                      const greeting = "Hello World";
                    </code>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "branding" && (
            <motion.div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#FF2D55]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B]/20 to-[#FF2D55]/20 rounded-xl flex items-center justify-center">
                  <Image className="h-5 w-5 text-[#F59E0B]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Branding</h2>
                  <p className="text-sm text-slate-400">Logo, favicon, and site identity</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Logo</label>
                  <div className="border-2 border-dashed border-[#1F2937] rounded-xl p-8 text-center hover:border-[#00E5FF]/50 transition-colors cursor-pointer">
                    <div className="w-16 h-16 bg-[#1F2937] rounded-2xl flex items-center justify-center mx-auto mb-3">
                      <Image className="h-8 w-8 text-slate-500" />
                    </div>
                    <p className="text-sm text-slate-400 mb-2">Drop your logo here or click to upload</p>
                    <p className="text-xs text-slate-600">SVG, PNG, or JPG. Max 2MB</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-3">Favicon</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-[#1F2937] rounded-xl flex items-center justify-center">
                      <PenTool className="h-6 w-6 text-slate-500" />
                    </div>
                    <button className="px-4 py-2 bg-[#1F2937] text-slate-400 rounded-lg hover:text-white hover:bg-[#2a3544] transition-all">
                      Upload Favicon
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "animations" && (
            <motion.div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF2D55] to-[#8B5CF6]" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FF2D55]/20 to-[#8B5CF6]/20 rounded-xl flex items-center justify-center">
                  <Sparkle className="h-5 w-5 text-[#FF2D55]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Animations</h2>
                  <p className="text-sm text-slate-400">Control site animations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#1F2937]/50 rounded-xl">
                  <div>
                    <p className="font-medium text-white">Enable Animations</p>
                    <p className="text-xs text-slate-500">Page transitions and micro-interactions</p>
                  </div>
                  <button
                    onClick={() => setTheme({ ...theme, animations: !theme.animations })}
                    className={`w-14 h-8 rounded-full transition-all relative ${
                      theme.animations ? "bg-[#00E5FF]" : "bg-[#1F2937]"
                    }`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg transition-all ${
                      theme.animations ? "left-7" : "left-1"
                    }`} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "presets" && (
            <motion.div className="space-y-6">
              <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#8B5CF6] to-[#00E5FF]" />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#8B5CF6]/20 to-[#00E5FF]/20 rounded-xl flex items-center justify-center">
                    <Layers className="h-5 w-5 text-[#8B5CF6]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Theme Presets</h2>
                    <p className="text-sm text-slate-400">Quick-start with pre-built themes</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {colorPresets.map((preset) => (
                    <motion.button
                      key={preset.name}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => applyPreset(preset)}
                      className="p-4 bg-[#1F2937]/50 rounded-xl border border-[#1F2937] hover:border-[#00E5FF]/30 transition-all text-left"
                    >
                      <div className="flex gap-1 mb-3">
                        <div className="w-6 h-6 rounded-md" style={{ backgroundColor: preset.primary }} />
                        <div className="w-6 h-6 rounded-md" style={{ backgroundColor: preset.secondary }} />
                        <div className="w-6 h-6 rounded-md" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <p className="text-sm font-medium text-white">{preset.name}</p>
                      <p className="text-xs text-slate-500 mt-1">Click to apply</p>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#F59E0B] to-[#FF2D55]" />
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#F59E0B]/20 to-[#FF2D55]/20 rounded-xl flex items-center justify-center">
                      <PaletteIcon className="h-5 w-5 text-[#F59E0B]" />
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Custom Palettes</h2>
                      <p className="text-sm text-slate-400">Your saved color combinations</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCustomPaletteModal(true)}
                    className="px-4 py-2 bg-[#F59E0B]/20 text-[#F59E0B] font-medium rounded-xl hover:bg-[#F59E0B]/30 transition-all flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    New Palette
                  </button>
                </div>

                {theme.customPalettes.length === 0 ? (
                  <div className="text-center py-8">
                    <PaletteIcon className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 mb-2">No custom palettes yet</p>
                    <p className="text-slate-500 text-sm">Create your own color combination and save it for quick access</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {theme.customPalettes.map((palette, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-4 bg-[#1F2937]/50 rounded-xl border border-[#1F2937] hover:border-[#F59E0B]/30 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <p className="text-sm font-medium text-white">{palette.name}</p>
                          <button
                            onClick={() => deleteCustomPalette(index)}
                            className="p-1 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="flex gap-1 mb-3">
                          <div className="w-6 h-6 rounded-md flex-1" style={{ backgroundColor: palette.primary }} />
                          <div className="w-6 h-6 rounded-md flex-1" style={{ backgroundColor: palette.secondary }} />
                          <div className="w-6 h-6 rounded-md flex-1" style={{ backgroundColor: palette.accent }} />
                          <div className="w-6 h-6 rounded-md flex-1" style={{ backgroundColor: palette.background }} />
                        </div>
                        <button
                          onClick={() => applyCustomPalette(palette)}
                          className="w-full py-2 text-xs font-medium text-slate-400 hover:text-white bg-[#0D1117] rounded-lg hover:bg-[#2a3544] transition-all"
                        >
                          Apply
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:w-80 flex-shrink-0"
        >
          <div className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-4 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-white">Live Preview</h3>
              <div className="flex gap-1 p-1 bg-[#1F2937] rounded-lg">
                {(["desktop", "tablet", "mobile"] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    className={`p-1.5 rounded ${previewMode === mode ? "bg-[#1F2937] text-white" : "text-slate-500"}`}
                  >
                    {mode === "desktop" && <Monitor className="h-4 w-4" />}
                    {mode === "tablet" && <Eye className="h-4 w-4" />}
                    {mode === "mobile" && <Eye className="h-4 w-4" />}
                  </button>
                ))}
              </div>
            </div>
            <div 
              className="bg-[#1F2937] rounded-xl overflow-hidden"
              style={{ 
                height: previewMode === "mobile" ? "400px" : previewMode === "tablet" ? "350px" : "300px" 
              }}
            >
              <div className="h-6 bg-[#0D1117] flex items-center justify-center gap-1.5 border-b border-[#1F2937]">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <div className="p-3 space-y-2">
                <div className="h-3 bg-[#1F2937] rounded w-3/4" />
                <div className="h-3 bg-[#1F2937] rounded w-1/2" />
                <div className="flex gap-2 mt-4">
                  <div className="w-16 h-16 rounded-lg" style={{ backgroundColor: theme.primary + "30" }} />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-[#1F2937] rounded" />
                    <div className="h-3 bg-[#1F2937] rounded w-3/4" />
                  </div>
                </div>
                <div className="h-16 bg-[#1F2937] rounded-lg mt-4 flex items-center justify-center">
                  <Sparkles className="h-5 w-5" style={{ color: theme.primary }} />
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
              className="bg-[#0D1117] border border-[#1F2937] rounded-2xl p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white">Create Custom Palette</h3>
                <button
                  onClick={() => setShowCustomPaletteModal(false)}
                  className="p-2 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Palette Name</label>
                  <input
                    type="text"
                    value={newPalette.name}
                    onChange={(e) => setNewPalette({ ...newPalette, name: e.target.value })}
                    placeholder="My Custom Palette"
                    className="w-full h-12 px-4 rounded-xl bg-[#1F2937] border border-[#1F2937] text-white focus:outline-none focus:border-[#F59E0B]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    { key: "primary", label: "Primary" },
                    { key: "secondary", label: "Secondary" },
                    { key: "accent", label: "Accent" },
                    { key: "background", label: "Background" },
                  ].map((color) => (
                    <div key={color.key}>
                      <label className="block text-xs text-slate-400 mb-2">{color.label}</label>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-lg overflow-hidden border border-[#1F2937]">
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
                          className="w-16 h-10 px-2 rounded-lg bg-[#1F2937] border border-[#1F2937] text-white text-xs font-mono focus:outline-none focus:border-[#F59E0B]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-[#1F2937]/50 rounded-xl">
                  <p className="text-xs text-slate-400 mb-2">Preview</p>
                  <div className="flex gap-2">
                    <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: newPalette.primary }} />
                    <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: newPalette.secondary }} />
                    <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: newPalette.accent }} />
                    <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: newPalette.background }} />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setShowCustomPaletteModal(false)}
                    className="flex-1 py-3 bg-[#1F2937] text-slate-400 font-medium rounded-xl hover:text-white transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveCustomPalette}
                    disabled={!newPalette.name.trim()}
                    className="flex-1 py-3 bg-gradient-to-r from-[#F59E0B] to-[#FF2D55] text-white font-bold rounded-xl hover:opacity-90 transition-all disabled:opacity-50"
                  >
                    Save Palette
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
