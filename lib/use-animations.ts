"use client"

import { useThemeConfig } from "./theme-context"
import { CSSProperties } from "react"
import { Variants } from "framer-motion"

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
