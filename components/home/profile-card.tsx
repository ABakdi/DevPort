"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Mail, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ProfileCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#1F2937] p-8 rounded-xl relative overflow-hidden group"
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Ready_For_Hire</span>
      </div>

      <div className="mb-6 relative w-24 h-24">
        <div className="absolute inset-0 bg-[#00E5FF] rounded-full blur-lg opacity-20 animate-pulse"></div>
        <div className="w-24 h-24 rounded-full border-2 border-[#00E5FF] relative z-10 grayscale hover:grayscale-0 transition-all duration-500 bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
          <span className="text-3xl font-bold text-slate-400">AB</span>
        </div>
      </div>

      <div className="space-y-1 mb-6">
        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Hi, Welcome!</p>
        <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
          Abderrhmane Bakdi
        </h1>
        <p className="text-[#00E5FF] font-bold">Full Stack Architect</p>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <span className="px-3 py-1 bg-slate-100 dark:bg-[#1F2937] text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md border border-slate-200 dark:border-[#1F2937]">
          Full Stack Dev
        </span>
        <span className="px-3 py-1 bg-slate-100 dark:bg-[#1F2937] text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md border border-slate-200 dark:border-[#1F2937]">
          System Architect
        </span>
        <span className="px-3 py-1 bg-slate-100 dark:bg-[#1F2937] text-slate-700 dark:text-slate-300 text-[10px] font-bold rounded-md border border-slate-200 dark:border-[#1F2937]">
          Product Engineer
        </span>
      </div>

      <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-8">
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          Algiers, DZ
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          10:00 AM CET
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button className="flex-1 bg-[#00E5FF] py-3 rounded-lg text-black font-bold flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all">
          <Mail className="h-4 w-4" />
          CONTACT ME
        </Button>
        <Button 
          variant="outline" 
          size="icon"
          className="p-3 bg-slate-100 dark:bg-[#1F2937] rounded-lg border border-slate-200 dark:border-[#1F2937] hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </motion.div>
  )
}
