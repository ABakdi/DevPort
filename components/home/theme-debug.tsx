"use client"

export function ThemeDebug() {
  if (process.env.NODE_ENV === "production") return null
  
  const primary = getComputedStyle(document.documentElement).getPropertyValue('--theme-primary').trim()
  const bg = getComputedStyle(document.documentElement).getPropertyValue('--theme-background').trim()
  
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-black/80 text-white p-3 rounded-lg text-xs font-mono border border-white/20">
      <div>--theme-primary: <span style={{ color: primary }}>{primary}</span></div>
      <div>--theme-background: {bg}</div>
    </div>
  )
}
