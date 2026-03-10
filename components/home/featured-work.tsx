"use client"

import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Code2, Zap, Shield, TrendingUp } from "lucide-react"
import { useCardAnimation, useTextAnimation } from "@/lib/use-animations"

interface CaseStudy {
  title?: string
  description?: string
  tags?: string[]
  metrics?: { label: string; value: string }[]
  challenge?: string
  solution?: string
  result?: string
  image?: string
  link?: string
}

interface FeaturedWorkProps {
  caseStudy?: CaseStudy
}

export function FeaturedWork({ caseStudy }: FeaturedWorkProps) {
  const hasContent = caseStudy?.title || caseStudy?.description
  const { hoverAnimation, glowHoverStyle, cardGlow } = useCardAnimation()
  const { textGlowStyle } = useTextAnimation()

  const features = [
    { icon: Zap, label: 'Performance', value: '99+' },
    { icon: Shield, label: 'Security', value: 'A+' },
    { icon: TrendingUp, label: 'Scale', value: '1M+' },
    { icon: Code2, label: 'Code', value: 'Clean' },
  ]

  return (
    <motion.section 
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="space-y-8"
    >
      <div className="flex items-end justify-between">
        <div>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-sm font-semibold uppercase tracking-wider mb-2"
            style={{ color: 'var(--theme-primary)' }}
          >
            Featured Work
          </motion.p>
          <h2 
            className="text-3xl md:text-4xl font-black"
            style={{ 
              color: 'var(--theme-text)',
              fontFamily: 'var(--theme-font-heading)',
              ...textGlowStyle
            }}
          >
            Projects I'm Proud Of
          </h2>
        </div>
        <a 
          href="/projects"
          className="hidden md:flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-80"
          style={{ color: 'var(--theme-primary)' }}
        >
          View All Projects
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>

      {hasContent ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8"
        >
          <motion.div
            whileHover={hoverAnimation}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="rounded-2xl p-6 lg:p-8 cursor-pointer"
            style={{ 
              backgroundColor: 'var(--theme-surface)',
              border: '1px solid var(--theme-surface)',
              ...(cardGlow ? glowHoverStyle : {})
            }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: 'var(--theme-primary)', color: '#000000' }}
              >
                <Code2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>
                  {caseStudy.title || 'Project Title'}
                </h3>
                <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                  Full Stack Development
                </p>
              </div>
            </div>

            <p 
              className="text-sm leading-relaxed mb-6"
              style={{ color: 'var(--theme-text)', opacity: 0.7 }}
            >
              {caseStudy.description || 'Project description goes here. Describe the challenge, solution, and impact of your work.'}
            </p>

            {caseStudy.tags && caseStudy.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {caseStudy.tags.slice(0, 4).map((tag) => (
                  <span 
                    key={tag}
                    className="px-3 py-1 text-xs font-medium rounded-md"
                    style={{ 
                      backgroundColor: 'var(--theme-background)',
                      color: 'var(--theme-text)',
                      opacity: 0.8
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {caseStudy.metrics && caseStudy.metrics.length > 0 && (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {caseStudy.metrics.slice(0, 2).map((metric, i) => (
                  <div 
                    key={i}
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: 'var(--theme-background)' }}
                  >
                    <p className="text-2xl font-black" style={{ color: 'var(--theme-primary)' }}>
                      {metric.value}
                    </p>
                    <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                      {metric.label}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {caseStudy.link && (
              <a 
                href={caseStudy.link}
                className="inline-flex items-center gap-2 text-sm font-bold transition-colors hover:opacity-80"
                style={{ color: 'var(--theme-primary)' }}
              >
                View Project <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </motion.div>

          <div className="space-y-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 * i }}
                whileHover={hoverAnimation}
                className="p-5 rounded-xl cursor-pointer"
                style={{ 
                  backgroundColor: 'var(--theme-surface)',
                  border: '1px solid var(--theme-surface)',
                  ...(cardGlow ? glowHoverStyle : {})
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: 'var(--theme-background)' }}
                    >
                      <feature.icon className="h-5 w-5" style={{ color: 'var(--theme-secondary)' }} />
                    </div>
                    <span className="font-medium" style={{ color: 'var(--theme-text)' }}>
                      {feature.label}
                    </span>
                  </div>
                  <span className="text-2xl font-black" style={{ color: 'var(--theme-primary)' }}>
                    {feature.value}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {features.map((feature, i) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 * i }}
              className="p-6 rounded-xl text-center"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
                border: '1px solid var(--theme-surface)'
              }}
            >
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: 'var(--theme-primary)', color: '#000000' }}
              >
                <feature.icon className="h-6 w-6" />
              </div>
              <p className="text-3xl font-black mb-1" style={{ color: 'var(--theme-primary)' }}>
                {feature.value}
              </p>
              <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                {feature.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      )}

      <a 
        href="/projects"
        className="md:hidden flex items-center justify-center gap-2 w-full py-3 rounded-xl font-medium transition-colors hover:opacity-80"
        style={{ 
          backgroundColor: 'var(--theme-surface)',
          color: 'var(--theme-primary)',
          border: '1px solid var(--theme-surface)'
        }}
      >
        View All Projects
        <ArrowRight className="h-4 w-4" />
      </a>
    </motion.section>
  )
}
