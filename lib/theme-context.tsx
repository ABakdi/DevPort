"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface ThemeConfig {
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  // Light mode variants
  lightPrimary?: string
  lightSecondary?: string
  lightAccent?: string
  lightBackground?: string
  lightSurface?: string
  lightText?: string
  fontHeading: string
  fontBody: string
  fontSize: number
  borderRadius: string
  iconStyle: string
  animations: boolean
  darkMode: string
  // Style settings
  pageStyle: string
  componentStyle: string
  cardStyle: string
  buttonStyle: string
  inputStyle: string
  shadowIntensity: string
  borderStyle: string
  animationStyle: string
  backgroundStyle: string
  backgroundImage?: string
  backgroundVideo?: string
  textAnimationStyle?: string
  cardGlow?: number
  textGlow?: number
}

const defaultTheme: ThemeConfig = {
  primary: "#00E5FF",
  secondary: "#8B5CF6",
  accent: "#F59E0B",
  background: "#0D1117",
  surface: "#1F2937",
  text: "#ffffff",
  // Light mode variants
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
  iconStyle: "rounded",
  animations: true,
  darkMode: "dark",
  // Style settings
  pageStyle: "default",
  componentStyle: "rounded",
  cardStyle: "default",
  buttonStyle: "default",
  inputStyle: "default",
  shadowIntensity: "medium",
  borderStyle: "medium",
  animationStyle: "rattle",
  backgroundStyle: "gradient",
  cardGlow: 0,
  textGlow: 0,
}

interface ThemeContextType {
  theme: ThemeConfig
  updateTheme: (theme: Partial<ThemeConfig>) => void
  resetTheme: () => void
  loading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeContextProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeConfig>(defaultTheme)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const res = await fetch(`/api/theme?t=${Date.now()}`)
        const data = await res.json()
        
        if (data && data.primary) {
          const loadedTheme: ThemeConfig = {
            primary: data.primary,
            secondary: data.secondary,
            accent: data.accent,
            background: data.background,
            surface: data.surface,
            text: data.text,
            lightPrimary: data.lightPrimary,
            lightSecondary: data.lightSecondary,
            lightAccent: data.lightAccent,
            lightBackground: data.lightBackground,
            lightSurface: data.lightSurface,
            lightText: data.lightText,
            fontHeading: data.fontHeading || "Inter",
            fontBody: data.fontBody || "Inter",
            fontSize: data.fontSize || 16,
            borderRadius: data.borderRadius || "0.75rem",
            iconStyle: data.iconStyle || "rounded",
            animations: data.animations !== false,
            darkMode: data.darkMode || "dark",
            pageStyle: data.pageStyle || "default",
            componentStyle: data.componentStyle || "rounded",
            cardStyle: data.cardStyle || "default",
            buttonStyle: data.buttonStyle || "default",
            inputStyle: data.inputStyle || "default",
            shadowIntensity: data.shadowIntensity || "medium",
            borderStyle: data.borderStyle || "medium",
            animationStyle: data.animationStyle || "rattle",
            backgroundStyle: data.backgroundStyle || "gradient",
            backgroundImage: data.backgroundImage || "",
            backgroundVideo: data.backgroundVideo || "",
            cardGlow: data.cardGlow || 0,
            textGlow: data.textGlow || 0,
          }
          
          setTheme(loadedTheme)
          localStorage.setItem('theme-current', JSON.stringify(loadedTheme))
        }
      } catch (e) {
        console.error('Failed to load theme:', e)
      }
      setLoading(false)
    }

    loadTheme()
  }, [])

  const getComponentRadius = (style: string): string => {
    const radii: Record<string, string> = {
      sharp: '0px',
      square: '4px',
      rounded: '8px',
      pill: '24px',
      circle: '50%',
    }
    return radii[style] || '8px'
  }

  const getCardRadius = (style: string): string => {
    const radii: Record<string, string> = {
      default: '12px',
      sharp: '0px',
      square: '4px',
      rounded: '16px',
      pill: '28px',
      circle: '50%',
    }
    return radii[style] || '12px'
  }

  const getButtonRadius = (style: string): string => {
    const radii: Record<string, string> = {
      default: '8px',
      sharp: '0px',
      square: '4px',
      rounded: '12px',
      pill: '20px',
      circle: '50%',
    }
    return radii[style] || '8px'
  }

  const getInputRadius = (style: string): string => {
    const radii: Record<string, string> = {
      default: '8px',
      sharp: '0px',
      square: '4px',
      rounded: '12px',
      pill: '16px',
      circle: '50%',
    }
    return radii[style] || '8px'
  }

  const getShadowValue = (intensity: string, isDark: boolean): string => {
    const shadows: Record<string, string> = {
      none: 'none',
      light: isDark ? '0 2px 4px rgba(0,0,0,0.4)' : '0 1px 3px rgba(0,0,0,0.12)',
      medium: isDark ? '0 4px 12px rgba(0,0,0,0.5), 0 2px 4px rgba(0,0,0,0.3)' : '0 4px 6px rgba(0,0,0,0.15)',
      heavy: isDark ? '0 10px 25px rgba(0,0,0,0.6), 0 5px 10px rgba(0,0,0,0.4)' : '0 10px 20px rgba(0,0,0,0.2)',
    }
    return shadows[intensity] || shadows.medium
  }

  useEffect(() => {
    const applyThemeToDocument = (themeConfig: ThemeConfig) => {
      const root = document.documentElement
      
      // Determine if we should use light or dark mode
      const isDark = themeConfig.darkMode === 'dark'
      const isSystem = themeConfig.darkMode === 'system'
      
      // Check system preference if set to system
      let useDark = isDark
      if (isSystem && typeof window !== 'undefined') {
        useDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      
      // Use appropriate colors based on mode
      const primary = useDark 
        ? (themeConfig.primary || '#00E5FF')
        : (themeConfig.lightPrimary || themeConfig.primary || '#0891B2')
      const secondary = useDark 
        ? (themeConfig.secondary || '#8B5CF6') 
        : (themeConfig.lightSecondary || themeConfig.secondary || '#7C3AED')
      const accent = useDark 
        ? (themeConfig.accent || '#F59E0B') 
        : (themeConfig.lightAccent || themeConfig.accent || '#D97706')
      const background = useDark 
        ? (themeConfig.background || '#0D1117') 
        : (themeConfig.lightBackground || themeConfig.background || '#F8FAFC')
      const surface = useDark 
        ? (themeConfig.surface || '#1F2937') 
        : (themeConfig.lightSurface || themeConfig.surface || '#FFFFFF')
      const text = useDark 
        ? (themeConfig.text || '#ffffff') 
        : (themeConfig.lightText || themeConfig.text || '#0F172A')
      
      root.style.setProperty('--theme-primary', primary)
      root.style.setProperty('--theme-secondary', secondary)
      root.style.setProperty('--theme-accent', accent)
      root.style.setProperty('--theme-background', background)
      root.style.setProperty('--theme-surface', surface)
      root.style.setProperty('--theme-text', text)
      root.style.setProperty('--theme-font-heading', themeConfig.fontHeading || 'Inter')
      root.style.setProperty('--theme-font-body', themeConfig.fontBody || 'Inter')
      root.style.setProperty('--theme-font-size', `${themeConfig.fontSize || 16}px`)
      root.style.setProperty('--theme-border-radius', themeConfig.borderRadius || '0.75rem')
      root.style.setProperty('--theme-icon-style', themeConfig.iconStyle || 'rounded')
      root.style.setProperty('--theme-page-style', themeConfig.pageStyle || 'default')
      root.style.setProperty('--theme-component-style', themeConfig.componentStyle || 'rounded')
      root.style.setProperty('--theme-card-style', themeConfig.cardStyle || 'default')
      root.style.setProperty('--theme-button-style', themeConfig.buttonStyle || 'default')
      root.style.setProperty('--theme-input-style', themeConfig.inputStyle || 'default')
      root.style.setProperty('--theme-shadow-intensity', themeConfig.shadowIntensity || 'medium')
      
      // Apply border width based on border style selection
      const borderWidths: Record<string, string> = {
        none: '0px',
        thin: '1px',
        light: '2px',
        medium: '3px',
      }
      const borderWidth = borderWidths[themeConfig.borderStyle || 'medium'] || '3px'
      root.style.setProperty('--theme-border-width', borderWidth)

      // Apply style-specific CSS variables
      const componentRadius = getComponentRadius(themeConfig.componentStyle || 'rounded')
      const cardRadius = getCardRadius(themeConfig.cardStyle || 'default')
      const buttonRadius = getButtonRadius(themeConfig.buttonStyle || 'default')
      const inputRadius = getInputRadius(themeConfig.inputStyle || 'default')
      const shadowValue = getShadowValue(themeConfig.shadowIntensity || 'medium', useDark)

      root.style.setProperty('--theme-component-radius', componentRadius)
      root.style.setProperty('--theme-card-radius', cardRadius)
      root.style.setProperty('--theme-button-radius', buttonRadius)
      root.style.setProperty('--theme-input-radius', inputRadius)
      root.style.setProperty('--theme-shadow', shadowValue)
      
      document.body.style.backgroundColor = background
      document.body.style.color = text
      
      // Apply page style as data attribute for CSS selectors
      const pageStyle = themeConfig.pageStyle || 'default'
      document.documentElement.setAttribute('data-page-style', pageStyle)
      
      // Apply page style background if set
      const pageStyleGradients: Record<string, string> = {
        bento: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)',
        minimalist: '#fafafa',
        neobrutalist: '#FFE66D',
        glass: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        cyberpunk: '#050505',
        soft: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 50%, #fb923c 100%)',
        tech: '#0d1117',
        organic: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
      }
      if (pageStyle && pageStyle !== 'default' && pageStyleGradients[pageStyle]) {
        document.body.style.background = pageStyleGradients[pageStyle]
      }
      
      document.body.classList.toggle('no-animations', !themeConfig.animations)
      
      if (useDark) {
        root.classList.add('dark')
      } else {
        root.classList.remove('dark')
      }
    }

    if (!loading && theme) {
      applyThemeToDocument(theme)
    }
  }, [theme, loading])

  useEffect(() => {
    const handleThemeChange = (e: Event) => {
      const customEvent = e as CustomEvent<ThemeConfig>
      setTheme(customEvent.detail)
    }

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'theme-current' && e.newValue) {
        try {
          setTheme(JSON.parse(e.newValue))
        } catch (err) {
          console.error('Failed to parse theme:', err)
        }
      }
    }

    window.addEventListener('theme-changed', handleThemeChange)
    window.addEventListener('storage', handleStorage)

    return () => {
      window.removeEventListener('theme-changed', handleThemeChange)
      window.removeEventListener('storage', handleStorage)
    }
  }, [])

  const updateTheme = async (updates: Partial<ThemeConfig>) => {
    const newTheme = { ...theme, ...updates }
    setTheme(newTheme)
    localStorage.setItem('theme-current', JSON.stringify(newTheme))
    
    // Save to API
    try {
      await fetch('/api/theme', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTheme),
      })
    } catch (e) {
      console.error('Failed to save theme:', e)
    }
    
    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('theme-changed', { detail: newTheme }))
  }

  const resetTheme = () => {
    updateTheme(defaultTheme)
  }

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, resetTheme, loading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeConfig() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useThemeConfig must be used within ThemeContextProvider')
  }
  return context
}
