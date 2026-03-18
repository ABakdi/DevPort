"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Download, X, FileText, Eye, Loader2 } from "lucide-react"

interface Profile {
  name: string
  title: string
  email: string
  location: string
}

interface CV {
  summary: string
  phone: string
  address: string
  linkedin: string
  whatsapp: string
  website: string
  workExperience: { company: string; location: string; role: string; startDate: string; endDate: string; current: boolean; description: string; achievements: string[] }[]
  projects: { name: string; company: string; role: string; startDate: string; endDate: string; current: boolean; description: string; highlights: string[] }[]
  education: { degree: string; institution: string; location: string; year: string }[]
  skills: { category: string; items: string[] }[]
  languages: { name: string; proficiency: string }[]
  certifications: { name: string; issuer: string; date: string }[]
}

export function CVDownloadButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [cv, setCV] = useState<CV | null>(null)
  const [loading, setLoading] = useState(false)
  const [downloading, setDownloading] = useState<'visual' | 'ats' | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, cvRes] = await Promise.all([
          fetch('/api/profile'),
          fetch('/api/cv')
        ])
        if (profileRes.ok) setProfile(await profileRes.json())
        if (cvRes.ok) setCV(await cvRes.json())
      } catch (error) {
        console.error('Failed to fetch data:', error)
      }
    }
    fetchData()
  }, [])

  const generateATSCV = () => {
    if (!profile || !cv) return ''
    
    let text = `${profile.name}\n`
    text += `${profile.title}\n`
    if (profile.email) text += `Email: ${profile.email}\n`
    if (cv.phone) text += `Phone: ${cv.phone}\n`
    if (cv.address) text += `Address: ${cv.address}\n`
    if (cv.linkedin) text += `LinkedIn: ${cv.linkedin}\n`
    if (cv.whatsapp) text += `WhatsApp: ${cv.whatsapp}\n`
    if (cv.website) text += `Website: ${cv.website}\n`
    if (profile.location) text += `Location: ${profile.location}\n`
    text += '\n'
    
    if (cv.summary) {
      text += `PROFESSIONAL SUMMARY\n${cv.summary}\n\n`
    }
    
    if (cv.skills.length > 0) {
      text += `SKILLS\n`
      cv.skills.forEach(skill => {
        text += `${skill.category}: ${skill.items.join(', ')}\n`
      })
      text += '\n'
    }
    
    if (cv.workExperience.length > 0) {
      text += `WORK EXPERIENCE\n`
      cv.workExperience.forEach(exp => {
        text += `${exp.role} at ${exp.company}\n`
        text += `${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}\n`
        if (exp.description) text += `${exp.description}\n`
        if (exp.achievements) {
          exp.achievements.forEach(a => text += `- ${a}\n`)
        }
        text += '\n'
      })
    }
    
    if (cv.education.length > 0) {
      text += `EDUCATION\n`
      cv.education.forEach(edu => {
        text += `${edu.degree}, ${edu.institution}, ${edu.year}\n`
      })
      text += '\n'
    }
    
    if (cv.certifications.length > 0) {
      text += `CERTIFICATIONS\n`
      cv.certifications.forEach(cert => {
        text += `${cert.name} - ${cert.issuer} (${cert.date})\n`
      })
      text += '\n'
    }
    
    if (cv.languages.length > 0) {
      text += `LANGUAGES\n`
      cv.languages.forEach(lang => {
        text += `${lang.name}: ${lang.proficiency}\n`
      })
    }
    
    return text
  }

  const downloadATS = async () => {
    setDownloading('ats')
    try {
      const text = generateATSCV()
      const blob = new Blob([text], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profile?.name || 'resume'}-ats-friendly.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(null)
    }
  }

  const downloadVisual = async () => {
    setDownloading('visual')
    try {
      const phone = cv?.phone || ''
      const address = cv?.address || ''
      const linkedin = cv?.linkedin || ''
      const whatsapp = cv?.whatsapp || ''
      const website = cv?.website || ''
      const websiteDisplay = website.replace(/^https?:\/\//, '')
      const whatsappLink = whatsapp.replace(/\D/g, '')
      
      let contactHtml = profile?.email || ''
      if (phone) contactHtml += ` | ${phone}`
      if (address) contactHtml += ` | ${address}`
      contactHtml += '<br/>'
      if (linkedin) contactHtml += `<a href="${linkedin}" style="color:#00E5FF;">LinkedIn</a>`
      if (whatsapp) contactHtml += ` | <a href="https://wa.me/${whatsappLink}" style="color:#00E5FF;">WhatsApp</a>`
      if (website) contactHtml += ` | <a href="${website}" style="color:#00E5FF;">${websiteDisplay}</a>`
      
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${profile?.name || 'Resume'}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
    h1 { color: #1a1a1a; margin-bottom: 5px; }
    h2 { color: #333; border-bottom: 2px solid #00E5FF; padding-bottom: 5px; margin-top: 30px; }
    .title { color: #00E5FF; font-size: 18px; margin-bottom: 20px; }
    .contact { color: #666; font-size: 14px; margin-bottom: 30px; }
    .skill-category { font-weight: bold; margin-top: 15px; }
    .skills { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 15px; }
    .skill-tag { background: #f0f0f0; padding: 4px 12px; border-radius: 20px; font-size: 14px; }
    .job-header { display: flex; justify-content: space-between; margin-bottom: 5px; }
    .company { color: #00E5FF; font-weight: bold; }
    .date { color: #666; font-size: 14px; }
    ul { margin: 5px 0; }
  </style>
</head>
<body>
  <h1>${profile?.name || ''}</h1>
  <p class="title">${profile?.title || ''}</p>
  <p class="contact">${contactHtml}</p>
  
  ${cv?.summary ? `<h2>Professional Summary</h2><p>${cv.summary}</p>` : ''}
  
  ${cv?.skills?.length ? `<h2>Skills</h2>` + cv.skills.map(s => `<p class="skill-category">${s.category}</p><div class="skills">${s.items.map(i => `<span class="skill-tag">${i}</span>`).join('')}</div>`).join('') : ''}
  
  ${cv?.workExperience?.length ? `<h2>Work Experience</h2>` + cv.workExperience.map(exp => `<div class="job-header"><span class="company">${exp.role} at ${exp.company}</span><span class="date">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span></div>${exp.location ? `<p style="color:#666;font-size:14px;">${exp.location}</p>` : ''}${exp.description ? `<p>${exp.description}</p>` : ''}${exp.achievements?.length ? `<ul>${exp.achievements.map(a => `<li>${a}</li>`).join('')}</ul>` : ''}`).join('') : ''}
  
  ${cv?.projects?.length ? `<h2>Projects</h2>` + cv.projects.map(proj => `<div class="job-header"><span class="company">${proj.name}</span><span class="date">${proj.startDate} - ${proj.current ? 'Present' : proj.endDate}</span></div>${proj.role || proj.company ? `<p style="color:#666;font-size:14px;">${proj.role}${proj.role && proj.company ? ' at ' : ''}${proj.company}</p>` : ''}${proj.description ? `<p>${proj.description}</p>` : ''}${proj.highlights?.length ? `<ul>${proj.highlights.map(h => `<li>${h}</li>`).join('')}</ul>` : ''}`).join('') : ''}
  
  ${cv?.education?.length ? `<h2>Education</h2>` + cv.education.map(edu => `<p><strong>${edu.degree}</strong> - ${edu.institution}, ${edu.year}</p>`).join('') : ''}
  
  ${cv?.certifications?.length ? `<h2>Certifications</h2>` + cv.certifications.map(cert => `<p>${cert.name} - ${cert.issuer} (${cert.date})</p>`).join('') : ''}
  
  ${cv?.languages?.length ? `<h2>Languages</h2><p>${cv.languages.map(l => `${l.name}: ${l.proficiency}`).join(', ')}</p>` : ''}
</body>
</html>`
      
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${profile?.name || 'resume'}-visual.html`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105"
        style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
      >
        <Download className="h-4 w-4" />
        <span className="hidden sm:inline">Download CV</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={{ backgroundColor: 'var(--theme-background)' }}
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b" style={{ borderColor: 'var(--theme-surface)' }}>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold" style={{ color: 'var(--theme-text)' }}>Download CV</h2>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm mt-1" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                  Choose a format to download
                </p>
              </div>

              <div className="p-6 space-y-4">
                <button
                  onClick={downloadVisual}
                  disabled={downloading !== null}
                  className="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ borderColor: 'var(--theme-primary)' }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--theme-primary)' }}
                  >
                    <Eye className="h-6 w-6" style={{ color: '#000' }} />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold" style={{ color: 'var(--theme-text)' }}>Visual CV</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                      Full design with colors & layout
                    </p>
                  </div>
                  {downloading === 'visual' && <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--theme-primary)' }} />}
                  {downloading !== 'visual' && <Download className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />}
                </button>

                <button
                  onClick={downloadATS}
                  disabled={downloading !== null}
                  className="w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all hover:scale-[1.02] disabled:opacity-50"
                  style={{ borderColor: 'var(--theme-surface)' }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: 'var(--theme-surface)' }}
                  >
                    <FileText className="h-6 w-6" style={{ color: 'var(--theme-text)' }} />
                  </div>
                  <div className="text-left flex-1">
                    <h3 className="font-bold" style={{ color: 'var(--theme-text)' }}>ATS-Friendly</h3>
                    <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                      Plain text, optimized for AI scanners
                    </p>
                  </div>
                  {downloading === 'ats' && <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--theme-primary)' }} />}
                  {downloading !== 'ats' && <Download className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />}
                </button>
              </div>

              <div className="p-4 border-t text-center" style={{ borderColor: 'var(--theme-surface)' }}>
                <a
                  href="/cv"
                  className="text-sm hover:underline"
                  style={{ color: 'var(--theme-primary)' }}
                  onClick={() => setIsOpen(false)}
                >
                  View full CV page →
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
