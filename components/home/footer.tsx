"use client"

import { motion } from "framer-motion"

export function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}
      className="pt-12 pb-8 border-t border-slate-200 dark:border-[#1F2937] flex flex-col md:flex-row items-center justify-between gap-6"
    >
      <div className="flex gap-4">
        <a
          className="w-10 h-10 rounded-lg border border-slate-200 dark:border-[#1F2937] flex items-center justify-center hover:bg-[#00E5FF] hover:text-black transition-all font-bold"
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          𝕏
        </a>
        <a
          className="w-10 h-10 rounded-lg border border-slate-200 dark:border-[#1F2937] flex items-center justify-center hover:bg-[#00E5FF] hover:text-black transition-all font-bold"
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          GH
        </a>
        <a
          className="w-10 h-10 rounded-lg border border-slate-200 dark:border-[#1F2937] flex items-center justify-center hover:bg-[#00E5FF] hover:text-black transition-all font-bold"
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          in
        </a>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
              <circle
                className="text-slate-200 dark:text-[#1F2937]"
                cx="24"
                cy="24"
                fill="transparent"
                r="20"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <circle
                className="text-[#00E5FF]"
                cx="24"
                cy="24"
                fill="transparent"
                r="20"
                stroke="currentColor"
                strokeDasharray="125.6"
                strokeDashoffset="12.5"
                strokeWidth="4"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black text-slate-900 dark:text-white">
              TOP 1%
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Site Version
            </p>
            <p className="text-xs font-mono text-slate-700 dark:text-white">v2024.1.0-alpha</p>
          </div>
        </div>
      </div>
    </motion.footer>
  )
}
