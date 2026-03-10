"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCardAnimation } from "@/lib/use-animations"

interface CaseStudyProps {
  caseStudy?: { title: string; description: string; stats: { latency: string; processed: string }; link: string }
}

export function CaseStudy({ caseStudy }: CaseStudyProps) {
  const { hoverAnimation, glowHoverStyle, cardGlow } = useCardAnimation()
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
      whileHover={hoverAnimation}
      className="rounded-xl overflow-hidden theme-bg-surface theme-border-surface border"
      style={cardGlow ? glowHoverStyle : {}}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="relative min-h-[300px] lg:min-h-[400px] flex items-center justify-center theme-bg-primary opacity-15">
          <div className="absolute top-4 left-4 px-3 py-1 rounded-full flex items-center gap-2 bg-black/40 border-theme-primary border">
            <span className="w-1.5 h-1.5 rounded-full theme-bg-primary"></span>
            <span className="text-[9px] font-bold uppercase tracking-widest theme-text">Featured Project</span>
          </div>
          <div className="p-4 rounded-xl w-3/4 theme-bg-surface theme-border-surface border">
            <div className="rounded-lg aspect-video flex items-center justify-center theme-bg-background"><span className="theme-text opacity-50">Project Preview</span></div>
          </div>
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-4">
            <p className="font-bold text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2 theme-text-primary">Case Study <span className="h-px w-12 theme-bg-primary opacity-30"></span></p>
            <h3 className="text-4xl font-black leading-tight mb-4 tracking-tighter theme-text">{title}</h3>
            <p className="text-lg leading-relaxed mb-8 theme-text opacity-70">{description}</p>
          </div>
          <div className="flex gap-4 mb-10">
            {[{ val: latency, label: 'Stat 1' }, { val: processed, label: 'Stat 2' }].map((stat, i) => (
              <div key={i} className="flex-1 p-6 rounded-2xl theme-bg-background theme-border-surface border">
                <p className="text-2xl font-black theme-text">{stat.val}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest theme-text opacity-60">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <Button asChild className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 theme-bg-primary text-black">
              <Link href={link}>VIEW CASE STUDY <ArrowRight className="transition-transform group-hover:translate-x-1" /></Link>
            </Button>
            <Button variant="outline" size="icon" className="p-4 rounded-xl theme-border-surface theme-text">
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
