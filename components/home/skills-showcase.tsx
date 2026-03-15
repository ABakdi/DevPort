"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"

interface SkillsShowcaseProps {
  techStack: string[]
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  frontend: { bg: 'var(--theme-primary)', text: '#000000' },
  backend: { bg: 'var(--theme-secondary)', text: '#ffffff' },
  database: { bg: 'var(--theme-accent)', text: '#000000' },
  devops: { bg: '#10B981', text: '#ffffff' },
  tools: { bg: '#F43F5E', text: '#ffffff' },
}

const categoryMap: Record<string, string> = {
  react: 'frontend', nextjs: 'frontend', vue: 'frontend', angular: 'frontend', svelte: 'frontend',
  javascript: 'frontend', typescript: 'frontend', html: 'frontend', css: 'frontend', tailwind: 'frontend',
  nodejs: 'backend', python: 'backend', java: 'backend', go: 'backend', rust: 'backend', php: 'backend',
  express: 'backend', django: 'backend', fastapi: 'backend', rails: 'backend',
  mongodb: 'database', postgresql: 'database', mysql: 'database', redis: 'database', sqlite: 'database',
  prisma: 'database', firebase: 'database', supabase: 'database',
  aws: 'devops', gcp: 'devops', azure: 'devops', docker: 'devops', kubernetes: 'devops', 
  vercel: 'devops', netlify: 'devops', github: 'devops', gitlab: 'devops', jenkins: 'devops',
  vscode: 'tools', git: 'tools', linux: 'tools', vim: 'tools', figma: 'tools',
}

export function SkillsShowcase({ techStack }: SkillsShowcaseProps) {
  const [categorizedSkills, setCategorizedSkills] = useState<Record<string, string[]>>({})

  useEffect(() => {
    const skills = techStack && techStack.length > 0 ? techStack : [
      "React", "TypeScript", "NodeJS", "Python", "AWS", "Docker", "PostgreSQL", "GraphQL"
    ]

    const categories: Record<string, string[]> = {
      frontend: [],
      backend: [],
      database: [],
      devops: [],
      tools: [],
    }

    skills.forEach((skill: string) => {
      const normalizedSkill = String(skill).toLowerCase()
      const category = categoryMap[normalizedSkill] || 'tools'
      if (!categories[category].includes(skill)) {
        categories[category].push(skill)
      }
    })

    setCategorizedSkills(categories)
  }, [techStack])

  const categories = [
    { key: 'frontend', label: 'Frontend', icon: '🎨' },
    { key: 'backend', label: 'Backend', icon: '⚙️' },
    { key: 'database', label: 'Database', icon: '💾' },
    { key: 'devops', label: 'DevOps', icon: '🚀' },
    { key: 'tools', label: 'Tools', icon: '🔧' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  }

  return (
    <motion.section 
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <p 
          className="text-sm font-semibold uppercase tracking-wider mb-2"
          style={{ color: 'var(--theme-primary)' }}
        >
          Technologies
        </p>
        <h2 
          className="text-3xl md:text-4xl font-black"
          style={{ 
            color: 'var(--theme-text)',
            fontFamily: 'var(--theme-font-heading)'
          }}
        >
          Skills & Technologies
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => {
          const skills = categorizedSkills[category.key] || []
          if (skills.length === 0) return null

          const colors = categoryColors[category.key]

          return (
            <motion.div
              key={category.key}
              variants={itemVariants}
              whileHover={{ x: [0, -3, 3, -3, 3, 0] }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="p-5 rounded-xl cursor-pointer"
              style={{ 
                backgroundColor: 'var(--theme-surface)',
                border: '1px solid var(--theme-surface)'
              }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: colors.bg, color: colors.text }}
                >
                  <span className="text-lg">{category.icon}</span>
                </div>
                <h3 className="font-bold" style={{ color: 'var(--theme-text)' }}>
                  {category.label}
                </h3>
                <span 
                  className="ml-auto text-xs font-medium px-2 py-1 rounded-md"
                  style={{ backgroundColor: colors.bg, color: colors.text, opacity: 0.2 }}
                >
                  {skills.length}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill, i) => (
                  <motion.span
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.05 * i }}
                    className="px-3 py-1.5 text-sm font-medium rounded-lg"
                    style={{ 
                      backgroundColor: 'var(--theme-background)',
                      color: 'var(--theme-text)'
                    }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>

      {techStack.length === 0 && (
        <div 
          className="p-8 rounded-xl text-center"
          style={{ backgroundColor: 'var(--theme-surface)' }}
        >
          <p style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
            No technologies added yet. Add your tech stack from the admin panel.
          </p>
        </div>
      )}
    </motion.section>
  )
}
