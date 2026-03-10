"use client"

import { motion } from "framer-motion"
import { useCardAnimation } from "@/lib/use-animations"

const defaultTools = [
  { name: "NodeJS", icon: "⬢" }, { name: "TypeScript", icon: "📘" }, { name: "K8s", icon: "☸" }, { name: "AWS", icon: "☁" },
  { name: "Go", icon: "🐹" }, { name: "React", icon: "⚛" }, { name: "Python", icon: "🐍" }, { name: "Docker", icon: "🐳" },
]

interface ToolboxProps { techStack: string[] }
const iconMap: Record<string, string> = { NodeJS: "⬢", TypeScript: "📘", K8s: "☸", AWS: "☁", Go: "🐹", React: "⚛", Python: "🐍", Docker: "🐳" }

export function Toolbox({ techStack }: ToolboxProps) {
  const { hoverAnimation, glowHoverStyle, cardGlow } = useCardAnimation()
  const tools = techStack?.length > 0 ? techStack.map(n => ({ name: n, icon: iconMap[n] || "⚡" })) : defaultTools

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.4 }}
      whileHover={hoverAnimation}
      className="p-6 rounded-xl theme-bg-surface theme-border-surface border"
      style={cardGlow ? glowHoverStyle : {}}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black tracking-tighter theme-text">TOOLBOX</h3>
        <span className="px-2 py-0.5 text-[10px] font-bold rounded theme-bg-accent text-black opacity-20">V2.4</span>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {tools.map((tool, i) => (
          <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + i * 0.05 }}
            className="aspect-square rounded-lg flex items-center justify-center border cursor-pointer theme-bg-background theme-border-surface" title={tool.name}>
            <span className="text-2xl opacity-70">{tool.icon}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
