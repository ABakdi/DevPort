"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CaseStudyProps {
  caseStudy?: {
    title: string
    description: string
    stats: {
      latency: string
      processed: string
    }
    link: string
  }
}

export function CaseStudy({ caseStudy }: CaseStudyProps) {
  const title = caseStudy?.title || "Enterprise Data Lake Engine"
  const description = caseStudy?.description || "A proprietary data ingestion engine designed for high-throughput financial transactions."
  const latency = caseStudy?.stats?.latency || "4.2ms"
  const processed = caseStudy?.stats?.processed || "128TB+"
  const link = caseStudy?.link || "#"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#1F2937] p-1 rounded-xl overflow-hidden"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-1">
        <div className="relative min-h-[400px] bg-[#3A5F5F] rounded-lg overflow-hidden flex items-center justify-center">
          <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 border border-white/10">
            <span className="w-1.5 h-1.5 bg-[#00E5FF] rounded-full"></span>
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Featured Project</span>
          </div>
          <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 w-3/4 transform hover:scale-105 transition-transform duration-500 shadow-2xl">
            <div className="rounded-lg shadow-inner bg-slate-800 aspect-video flex items-center justify-center">
              <span className="text-white/50 font-mono text-sm">Project Preview</span>
            </div>
          </div>
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-4">
            <p className="text-[#00E5FF] font-bold text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
              Case Study <span className="h-px w-12 bg-[#00E5FF]/30"></span>
            </p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tighter">
              {title}
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
              {description}
            </p>
          </div>

          <div className="flex gap-4 mb-10">
            <div className="flex-1 bg-slate-50 dark:bg-[#0a0a0a] p-6 rounded-2xl border border-slate-200 dark:border-[#1F2937]">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{latency}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stat 1</p>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-[#0a0a0a] p-6 rounded-2xl border border-slate-200 dark:border-[#1F2937]">
              <p className="text-2xl font-black text-slate-900 dark:text-white">{processed}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Stat 2</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button asChild className="flex-1 bg-[#00E5FF] text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-[0_0_15px_rgba(0,229,255,0.4)] transition-all group">
              <Link href={link}>
                VIEW CASE STUDY
                <ArrowRight className="transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="p-4 border border-slate-200 dark:border-[#1F2937] rounded-xl hover:bg-slate-50 dark:hover:bg-[#1F2937] transition-colors"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
