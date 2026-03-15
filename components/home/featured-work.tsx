"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Share2 } from "lucide-react"
import { useCardAnimation } from "@/lib/use-animations"

interface CaseStudy {
  title?: string
  description?: string
  tags?: string[]
  metrics?: { label: string; value: string }[]
  stats?: { latency?: string; processed?: string }
  image?: string
  link?: string
}

interface FeaturedWorkProps {
  caseStudy?: CaseStudy
}

export function FeaturedWork({ caseStudy }: FeaturedWorkProps) {
  const { hoverAnimation, glowHoverStyle, cardGlow } = useCardAnimation()
  
  const title = caseStudy?.title || "Enterprise Data Lake Engine"
  const description = caseStudy?.description || "A proprietary data ingestion engine designed for high-throughput financial transactions. Features real-time validation and automated schema discovery with 99.9% uptime."
  const metrics = caseStudy?.metrics || (caseStudy?.stats ? [
    { label: "Avg Latency", value: caseStudy.stats.latency || "4.2ms" },
    { label: "Processed", value: caseStudy.stats.processed || "128TB+" },
  ] : [
    { label: "Avg Latency", value: "4.2ms" },
    { label: "Processed", value: "128TB+" },
  ])
  const image = caseStudy?.image

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="rounded-xl overflow-hidden"
      style={{ 
        backgroundColor: 'var(--theme-surface)',
        border: '1px solid var(--theme-surface)'
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
        {/* Left: Image/Dashboard */}
        <div 
          className="relative min-h-[400px] flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#3A5F5F' }}
        >
          <div 
            className="absolute top-4 left-4 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-2 border border-white/10"
            style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--theme-primary)' }}></span>
            <span className="text-[9px] font-bold text-white uppercase tracking-widest">Latest Release</span>
          </div>
          {image ? (
            <img 
              src={image} 
              alt="Project Dashboard" 
              className="rounded-lg shadow-inner max-w-[90%]"
            />
          ) : (
            <div 
              className="backdrop-blur-md p-4 rounded-xl border border-white/20 w-3/4 transform transition-transform duration-500"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.1)',
                borderColor: 'rgba(255,255,255,0.2)',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
              }}
            >
              <div 
                className="rounded-lg h-48 flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-surface)' }}
              >
                <span style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Project Preview</span>
              </div>
            </div>
          )}
        </div>

        {/* Right: Case Study Details */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-4">
            <p 
              className="font-bold text-xs uppercase tracking-[0.2em] mb-2 flex items-center gap-2" 
              style={{ color: 'var(--theme-primary)' }}
            >
              Case Study <span className="h-px w-12" style={{ backgroundColor: 'var(--theme-primary)', opacity: 0.3 }}></span>
            </p>
            <h3 
              className="text-4xl font-black leading-tight mb-4 tracking-tighter"
              style={{ color: 'var(--theme-text)' }}
            >
              {title}
            </h3>
            <p 
              className="text-lg mb-8 leading-relaxed"
              style={{ color: 'var(--theme-text)', opacity: 0.7 }}
            >
              {description}
            </p>
          </div>

          <div className="flex gap-4 mb-10">
            {metrics.map((metric, i) => (
              <div 
                key={i}
                className="flex-1 p-6 rounded-2xl"
                style={{ 
                  backgroundColor: 'var(--theme-background)',
                  border: '1px solid var(--theme-surface)'
                }}
              >
                <p className="text-2xl font-black" style={{ color: 'var(--theme-text)' }}>
                  {metric.value}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                  {metric.label}
                </p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <a 
              href={caseStudy?.link || "#"}
              className="flex-1 py-4 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
              style={{ 
                backgroundColor: 'var(--theme-primary)', 
                color: '#000000'
              }}
            >
              VIEW CASE STUDY
              <ArrowRight className="h-5 w-5" />
            </a>
            <button 
              className="p-4 rounded-xl transition-colors"
              style={{ 
                border: '1px solid var(--theme-surface)',
                backgroundColor: 'transparent',
                color: 'var(--theme-text)'
              }}
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
