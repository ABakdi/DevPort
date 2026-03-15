"use client"

import { useEffect, useRef, useState } from "react"
import { useBackground } from "@/lib/use-animations"

interface AnimatedBackgroundProps {
  children: React.ReactNode
}

export function AnimatedBackground({ children }: AnimatedBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [scrollY, setScrollY] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const [clicks, setClicks] = useState<{ x: number; y: number; id: number }[]>([])
  const clickIdRef = useRef(0)
  const { backgroundStyles, backgroundStyle, backgroundImage, backgroundVideo, loading } = useBackground()

  // Don't show animated effects while loading - wait for theme to load from DB
  const showAnimatedEffects = !loading && (backgroundStyle === "gradient" || backgroundStyle === "none" || !backgroundStyle)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      })
    }

    const handleMouseEnter = () => setIsHovering(true)
    const handleMouseLeave = () => setIsHovering(false)

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("mousemove", handleMouseMove)
    
    if (containerRef.current) {
      containerRef.current.addEventListener("mouseenter", handleMouseEnter)
      containerRef.current.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("mousemove", handleMouseMove)
      if (containerRef.current) {
        containerRef.current.removeEventListener("mouseenter", handleMouseEnter)
        containerRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  const handleClick = (e: React.MouseEvent) => {
    const newClick = {
      x: (e.clientX / window.innerWidth - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
      id: clickIdRef.current++,
    }
    setClicks(prev => [...prev, newClick])
    setTimeout(() => {
      setClicks(prev => prev.filter(c => c.id !== newClick.id))
    }, 1000)
  }

  return (
    <div 
      ref={containerRef}
      onClick={handleClick}
      className="relative min-h-screen overflow-hidden"
      style={{ 
        ...backgroundStyles,
      }}
    >
      {/* Video background */}
      {backgroundVideo && (
        <video
          src={backgroundVideo}
          autoPlay
          loop
          muted
          playsInline
          className="fixed inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: -1 }}
        />
      )}
      {/* Animated effects - only show for default/gradient backgrounds */}
      {showAnimatedEffects && (
        <>
          {/* Gradient orbs that follow mouse and scroll */}
          <div 
            className="fixed inset-0 pointer-events-none transition-transform duration-1000 ease-out"
            style={{
              transform: `translate(${mousePosition.x * 30}px, ${scrollY * 0.1 + mousePosition.y * 30}px)`,
            }}
          >
            <div 
              className="absolute top-1/4 -left-32 w-96 h-96 rounded-full opacity-30 blur-3xl"
              style={{
                background: 'radial-gradient(circle, var(--theme-primary) 0%, transparent 70%)',
                transform: isHovering ? 'scale(1.2)' : 'scale(1)',
                transition: 'transform 0.5s ease-out',
              }}
            />
            <div 
              className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full opacity-25 blur-3xl"
              style={{
                background: 'radial-gradient(circle, var(--theme-secondary) 0%, transparent 70%)',
                transform: isHovering ? 'scale(1.3)' : 'scale(1)',
                transition: 'transform 0.7s ease-out',
              }}
            />
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-15 blur-3xl"
              style={{
                background: 'radial-gradient(circle, var(--theme-accent) 0%, transparent 70%)',
                transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20 + scrollY * 0.05}px)`,
              }}
            />
          </div>

          {/* Grid pattern overlay */}
          <div 
            className="fixed inset-0 pointer-events-none opacity-5"
            style={{
              backgroundImage: `
                linear-gradient(var(--theme-text) 1px, transparent 1px),
                linear-gradient(90deg, var(--theme-text) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px',
              transform: `perspective(500px) rotateX(60deg) translateY(-${scrollY * 0.2}px) scale(2)`,
            }}
          />

          {/* Scanline effect */}
          <div 
            className="fixed inset-0 pointer-events-none opacity-3"
            style={{
              background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, var(--theme-text) 2px, var(--theme-text) 4px)',
              animation: 'scanline 8s linear infinite',
            }}
          />
        </>
      )}

      {/* Click ripple effects - always show */}
      {clicks.map((click) => (
        <div
          key={click.id}
          className="fixed pointer-events-none rounded-full animate-ping"
          style={{
            left: '50%',
            top: '50%',
            width: '20px',
            height: '20px',
            backgroundColor: 'var(--theme-primary)',
            transform: `translate(${click.x * 200}px, ${click.y * 200}px)`,
            opacity: 0.8,
          }}
        />
      ))}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      <style jsx>{`
        @keyframes scanline {
          0% { transform: translateY(0); }
          100% { transform: translateY(100px); }
        }
      `}</style>
    </div>
  )
}
