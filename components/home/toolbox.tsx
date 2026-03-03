"use client"

import { motion } from "framer-motion"

const defaultTools = [
  { name: "NodeJS", icon: "⬢" },
  { name: "TypeScript", icon: "📘" },
  { name: "K8s", icon: "☸" },
  { name: "AWS", icon: "☁" },
  { name: "Go", icon: "🐹" },
  { name: "React", icon: "⚛" },
  { name: "Python", icon: "🐍" },
  { name: "Docker", icon: "🐳" },
]

interface ToolboxProps {
  techStack: string[]
}

const iconMap: Record<string, string> = {
  NodeJS: "⬢",
  TypeScript: "📘",
  K8s: "☸",
  AWS: "☁",
  Go: "🐹",
  React: "⚛",
  Python: "🐍",
  Docker: "🐳",
}

export function Toolbox({ techStack }: ToolboxProps) {
  const tools = techStack.length > 0 
    ? techStack.map((name) => ({ name, icon: iconMap[name] || "⚡" }))
    : defaultTools

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#1F2937] p-6 rounded-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">TOOLBOX</h3>
        <span className="px-2 py-0.5 bg-[#FF2D55]/10 text-[#FF2D55] text-[10px] font-black rounded border border-[#FF2D55]/20">
          V2.4
        </span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.name}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + index * 0.05 }}
            className="aspect-square bg-slate-50 dark:bg-[#0a0a0a] rounded-lg flex items-center justify-center border border-slate-200 dark:border-[#1F2937] hover:border-[#00E5FF] transition-colors cursor-pointer group"
          >
            <span className="text-2xl opacity-70 group-hover:opacity-100 transition-opacity">
              {tool.icon}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
