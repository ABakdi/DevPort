"use client"

import { useThemeConfig } from "./theme-context"
import { CSSProperties } from "react"
import { Variants } from "framer-motion"

export function useBackground() {
  const { theme } = useThemeConfig()
  const backgroundStyle = theme.backgroundStyle || "none"
  const backgroundImage = theme.backgroundImage || ""
  const backgroundVideo = theme.backgroundVideo || ""

  const getBackgroundStyles = (): CSSProperties => {
    if (backgroundImage) {
      const cacheBuster = `?t=${Date.now()}`
      return {
        backgroundImage: `url(${backgroundImage}${backgroundImage.includes('?') ? '&' : '?'}t=${Date.now()})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    }

    if (backgroundVideo) {
      return {}
    }

    switch (backgroundStyle) {
      case "gradient":
        return {
          background: 'linear-gradient(135deg, var(--theme-surface) 0%, var(--theme-background) 50%, var(--theme-surface) 100%)',
        }
      case "grid":
        return {
          backgroundColor: 'var(--theme-background)',
          backgroundImage: `
            linear-gradient(rgba(128, 128, 128, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(128, 128, 128, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '24px 24px',
        }
      case "network":
        return {
          background: 'radial-gradient(circle at 50% 50%, rgba(120, 119, 198, 0.15), transparent 50%)',
          backgroundColor: 'var(--theme-background)',
        }
      case "particles":
        return {
          background: 'radial-gradient(ellipse at top, rgba(0, 150, 255, 0.1), transparent 50%)',
          backgroundColor: 'var(--theme-background)',
        }
      case "space":
        return {
          background: 'radial-gradient(ellipse at bottom right, rgba(120, 0, 255, 0.15), transparent 50%), radial-gradient(ellipse at top left, rgba(0, 200, 255, 0.1), transparent 50%)',
          backgroundColor: 'var(--theme-background)',
        }
      case "retro":
        return {
          background: 'linear-gradient(to bottom, var(--theme-background), rgba(139, 92, 246, 0.1), var(--theme-background))',
        }
      case "waves":
        return {
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(99, 102, 241, 0.03) 10px, rgba(99, 102, 241, 0.03) 20px)',
          backgroundColor: 'var(--theme-background)',
        }
      case "aurora":
        return {
          background: 'conic-gradient(from 180deg at 50% 50%, rgba(0, 255, 150, 0.08), transparent 50%), conic-gradient(from 0deg at 50% 50%, rgba(100, 0, 255, 0.08), transparent 50%)',
          backgroundColor: 'var(--theme-background)',
        }
      case "mesh":
        return {
          background: `
            radial-gradient(at 40% 20%, rgba(56, 189, 248, 0.15), transparent 50%),
            radial-gradient(at 80% 0%, rgba(168, 85, 247, 0.1), transparent 50%),
            radial-gradient(at 0% 50%, rgba(236, 72, 153, 0.1), transparent 50%),
            radial-gradient(at 80% 50%, rgba(34, 211, 238, 0.1), transparent 50%),
            radial-gradient(at 0% 100%, rgba(249, 115, 22, 0.1), transparent 50%)
          `,
          backgroundColor: 'var(--theme-background)',
        }
      default:
        return {
          backgroundColor: 'var(--theme-background)',
        }
    }
  }

  return {
    backgroundStyle,
    backgroundImage,
    backgroundVideo,
    backgroundStyles: getBackgroundStyles(),
  }
}

export function useCardAnimation() {
  const { theme } = useThemeConfig()
  const animationStyle = theme.animationStyle || "none"
  const cardGlowIntensity = theme.cardGlow || 0

  const getHoverAnimation = () => {
    switch (animationStyle) {
      case "pop":
        return { scale: 1.05 }
      case "rattle":
        return { x: [0, -3, 3, -3, 3, 0] }
      case "rattle-diag":
        return { 
          x: [0, -2, 2, -2, 2, 0], 
          y: [0, -2, 2, -2, 2, 0], 
          rotate: [0, -1, 1, -1, 1, 0] 
        }
      case "pulse":
        return { scale: [1, 1.05, 1] }
      case "slide-up":
        return { y: -5 }
      default:
        return {}
    }
  }

  const getGlowStyle = (): CSSProperties => {
    if (cardGlowIntensity === 0) return {}
    
    const intensity = cardGlowIntensity / 100
    return {
      boxShadow: `0 0 ${20 * intensity}px var(--theme-primary), 0 0 ${40 * intensity}px color-mix(in srgb, var(--theme-primary) ${30 * intensity}%, transparent)`,
    }
  }

  const getGlowHoverStyle = (): CSSProperties => {
    if (cardGlowIntensity === 0) return {}
    
    const intensity = cardGlowIntensity / 100
    return {
      boxShadow: `0 0 ${25 * intensity}px var(--theme-primary), 0 0 ${50 * intensity}px color-mix(in srgb, var(--theme-primary) ${50 * intensity}%, transparent), inset 0 0 ${20 * intensity}px color-mix(in srgb, var(--theme-primary) ${10 * intensity}%, transparent)`,
    }
  }

  return {
    hoverAnimation: getHoverAnimation(),
    glowStyle: getGlowStyle(),
    glowHoverStyle: getGlowHoverStyle(),
    cardGlow: cardGlowIntensity > 0,
    cardGlowIntensity,
    animationStyle,
  }
}

export function useTextAnimation() {
  const { theme } = useThemeConfig()
  const textAnimationStyle = theme.textAnimationStyle || "none"
  const textGlowIntensity = theme.textGlow || 0

  const getTextGlowStyle = (): CSSProperties => {
    if (textGlowIntensity === 0) return {}
    
    const intensity = textGlowIntensity / 100
    return {
      textShadow: `0 0 ${10 * intensity}px var(--theme-primary), 0 0 ${20 * intensity}px color-mix(in srgb, var(--theme-primary) ${50 * intensity}%, transparent), 0 0 ${30 * intensity}px color-mix(in srgb, var(--theme-primary) ${30 * intensity}%, transparent)`,
    }
  }

  const getTextGlowHoverStyle = (): CSSProperties => {
    if (textGlowIntensity === 0) return {}
    
    const intensity = textGlowIntensity / 100
    return {
      textShadow: `0 0 ${15 * intensity}px var(--theme-primary), 0 0 ${30 * intensity}px color-mix(in srgb, var(--theme-primary) ${60 * intensity}%, transparent), 0 0 ${45 * intensity}px color-mix(in srgb, var(--theme-primary) ${40 * intensity}%, transparent)`,
    }
  }

  const getTextAnimationVariants = (): Variants => {
    switch (textAnimationStyle) {
      case "typewriter":
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.05 }
          }
        }
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: { 
            opacity: 1,
            transition: { duration: 0.5 }
          }
        }
      case "slide":
        return {
          hidden: { opacity: 0, x: -20 },
          visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.5 }
          }
        }
      default:
        return {
          hidden: { opacity: 1 },
          visible: { opacity: 1 }
        }
    }
  }

  const getCharVariants = (): Variants => {
    return {
      hidden: { opacity: 0 },
      visible: { opacity: 1 }
    }
  }

  return {
    textAnimationStyle,
    textGlow: textGlowIntensity > 0,
    textGlowIntensity,
    textGlowStyle: getTextGlowStyle(),
    textGlowHoverStyle: getTextGlowHoverStyle(),
    textAnimationVariants: getTextAnimationVariants(),
    charVariants: getCharVariants(),
  }
}
