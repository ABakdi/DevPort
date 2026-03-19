"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Save, Plus, X, Loader2, Check, AlertCircle, 
  Briefcase, GraduationCap, Languages, Award, Code, FileText, Eye, Edit3, Download, Upload, Image, XCircle, Trash2
} from "lucide-react"

interface WorkExperience {
  _id: string
  company: string
  location: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
  descriptionType: 'paragraph' | 'bullets'
}

interface CVProject {
  _id: string
  name: string
  company: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  highlights: string[]
  descriptionType: 'paragraph' | 'bullets'
}

interface Education {
  _id: string
  degree: string
  institution: string
  location: string
  year: string
  description: string
}

interface Skill {
  _id: string
  category: string
  items: string[]
}

interface Language {
  _id: string
  name: string
  proficiency: string
}

interface Certification {
  _id: string
  name: string
  issuer: string
  date: string
  url: string
}

interface CV {
  displayName: string
  picture: string
  pictureSize: '35x45' | '51x51'
  summary: string
  phone: string
  address: string
  linkedin: string
  whatsapp: string
  website: string
  workExperience: WorkExperience[]
  projects: CVProject[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  certifications: Certification[]
  customSections: { title: string; content: string }[]
  previewSettings: {
    fontFamily: string
    fontSize: number
    pageWidth: string
  }
  template: string
}

const defaultCV: CV = {
  displayName: '',
  picture: '',
  pictureSize: '35x45',
  summary: '',
  phone: '',
  address: '',
  linkedin: '',
  whatsapp: '',
  website: '',
  workExperience: [],
  projects: [],
  education: [],
  skills: [],
  languages: [],
  certifications: [],
  customSections: [],
  previewSettings: {
    fontFamily: 'Arial, sans-serif',
    fontSize: 10,
    pageWidth: '210mm'
  },
  template: 'classic'
}

const getFontSize = (baseSize: number, scale: number = 1) => `${baseSize * scale}pt`

export default function CVBuilder() {
  const [cv, setCV] = useState<CV>(defaultCV)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [showPreview, setShowPreview] = useState(false)
  const [previewSettings, setPreviewSettings] = useState({
    fontFamily: 'Arial, sans-serif',
    fontSize: 10,
    pageWidth: '210mm'
  })
  const [selectedTemplate, setSelectedTemplate] = useState('classic')

  const templates = [
    { id: 'classic', name: 'Classic', description: 'Traditional clean layout' },
    { id: 'modern', name: 'Modern', description: 'Bold headers, more spacing' },
    { id: 'minimal', name: 'Minimal', description: 'Simple and concise' },
    { id: ' ATS', name: 'ATS Optimized', description: 'Plain text, max compatibility' },
  ]

  const fonts = [
    { value: "Arial, sans-serif", label: "Arial" },
    { value: "'Helvetica Neue', Helvetica, sans-serif", label: "Helvetica" },
    { value: "Verdana, sans-serif", label: "Verdana" },
    { value: "Tahoma, sans-serif", label: "Tahoma" },
    { value: "'Trebuchet MS', sans-serif", label: "Trebuchet" },
    { value: "Georgia, serif", label: "Georgia" },
    { value: "'Times New Roman', serif", label: "Times New Roman" },
    { value: "Garamond, serif", label: "Garamond" },
    { value: "Palatino, 'Palatino Linotype', serif", label: "Palatino" },
    { value: "'Courier New', monospace", label: "Courier New" },
    { value: "'Lucida Console', monospace", label: "Lucida Console" },
    { value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", label: "Segoe UI" },
    { value: "system-ui, -apple-system, sans-serif", label: "System UI" },
    { value: "Calibri, sans-serif", label: "Calibri" },
    { value: "Cambria, serif", label: "Cambria" },
    { value: "'Franklin Gothic Medium', 'Arial Narrow', sans-serif", label: "Franklin Gothic" },
    { value: "'Century Gothic', sans-serif", label: "Century Gothic" },
    { value: "'Rockwell Extra Bold', 'Rockwell Bold', serif", label: "Rockwell" },
  ]

  useEffect(() => {
    fetchCV()
  }, [])

  const fetchCV = async () => {
    try {
      const res = await fetch('/api/cv')
      if (res.ok) {
        const data = await res.json()
        const workExperience = (data.workExperience || []).map((exp: any) => ({
          ...exp,
          descriptionType: exp.descriptionType || 'bullets'
        }))
        const projects = (data.projects || []).map((proj: any) => ({
          ...proj,
          descriptionType: proj.descriptionType || 'bullets'
        }))
        setCV({
          displayName: data.displayName || '',
          picture: data.picture || '',
          pictureSize: data.pictureSize || '35x45',
          summary: data.summary || '',
          phone: data.phone || '',
          address: data.address || '',
          linkedin: data.linkedin || '',
          whatsapp: data.whatsapp || '',
          website: data.website || '',
          workExperience,
          projects,
          education: data.education || [],
          skills: data.skills || [],
          languages: data.languages || [],
          certifications: data.certifications || [],
          customSections: data.customSections || [],
          previewSettings: data.previewSettings || { fontFamily: 'Arial, sans-serif', fontSize: 10, pageWidth: '210mm' },
          template: data.template || 'classic'
        })
        if (data.previewSettings) {
          setPreviewSettings(data.previewSettings)
        }
        if (data.template) {
          setSelectedTemplate(data.template)
        }
      }
    } catch (error) {
      console.error("Failed to fetch CV:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setSaveStatus('saving')
    try {
      const cvData = {
        ...cv,
        previewSettings,
        template: selectedTemplate
      }
      const res = await fetch('/api/cv', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cvData)
      })

      if (res.ok) {
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } else {
        setSaveStatus('error')
      }
    } catch (error) {
      console.error("Failed to save CV:", error)
      setSaveStatus('error')
    } finally {
      setSaving(false)
    }
  }

  const downloadCV = () => {
    const fontSize = `${previewSettings.fontSize}pt`
    const fontFamily = previewSettings.fontFamily
    const pageWidth = previewSettings.pageWidth === '100%' ? '100%' : previewSettings.pageWidth
    const fs = previewSettings.fontSize
    const getFS = (scale: number = 1) => `${fs * scale}pt`

    const contactHtml = (() => {
      let parts = []
      if (cv.phone) parts.push(`<a href="tel:${cv.phone.replace(/\s/g, '')}" style="color:#000;text-decoration:underline;">${cv.phone}</a>`)
      if (cv.linkedin) {
        const linkedinUrl = cv.linkedin.startsWith('http') ? cv.linkedin : `https://${cv.linkedin}`
        parts.push(`<a href="${linkedinUrl}" target="_blank" style="color:#000;text-decoration:underline;">LinkedIn</a>`)
      }
      if (cv.website) {
        const websiteUrl = cv.website.startsWith('http') ? cv.website : `https://${cv.website}`
        parts.push(`<a href="${websiteUrl}" target="_blank" style="color:#000;text-decoration:underline;">${cv.website.replace(/^https?:\/\//, '')}</a>`)
      }
      if (cv.address) parts.push(cv.address)
      return parts.join(' | ')
    })()

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${cv.displayName || 'Resume'}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body { font-family: ${fontFamily}; width: ${pageWidth}; min-height: 297mm; margin: 0 auto; padding: 15mm; font-size: ${fontSize}; line-height: 1.3; }
    h1 { font-size: ${getFS(1.6)}; font-weight: bold; margin-bottom: 3px; }
    h2 { font-size: ${getFS(0.9)}; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; margin-top: 10px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .contact { font-size: ${getFS(0.9)}; margin-bottom: 10px; }
    .job-header { display: flex; justify-content: space-between; }
    .company { font-weight: bold; }
    .role { font-style: italic; }
    .degree { font-style: italic; }
    ul { margin: 3px 0; padding-left: 30px; text-indent: -15px; }
    li { padding-left: 15px; }
    .section { margin-bottom: 8px; }
    .skill-category { font-weight: bold; }
    .summary-image { float: left; margin-right: 12px; margin-bottom: 4px; width: ${cv.pictureSize === '35x45' ? '35mm' : '51mm'}; height: ${cv.pictureSize === '35x45' ? '45mm' : '51mm'}; }
    .summary-image img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; display: block; }
  </style>
</head>
<body>
  <div style="font-family: ${fontFamily};">
    <div style="text-align: center; margin-bottom: 10px;">
      <h1>${cv.displayName || ''}</h1>
      <p class="contact">${contactHtml}</p>
    </div>
    
    ${cv.summary ? `<div class="section"><h2>Professional Summary</h2>` + (cv.picture ? `<div class="summary-image"><img src="${cv.picture}" alt="Profile" /></div><p style="white-space: pre-wrap; margin: 0;">${cv.summary}</p><div style="clear: both;"></div>` : `<p style="white-space: pre-wrap;">${cv.summary}</p>`) + `</div>` : ''}
    
    ${cv.education.length ? `<div class="section"><h2>Education</h2>` + cv.education.map(edu => `<div style="margin-bottom: 8px;"><div class="job-header"><span class="company">${edu.institution}</span><span>${edu.year}</span></div><div class="job-header"><span class="degree">${edu.degree}</span>${edu.location ? `<span>${edu.location}</span>` : ''}</div></div>`).join('') + `</div>` : ''}
    
    ${cv.workExperience.length ? `<div class="section"><h2>Experience</h2>` + cv.workExperience.map(exp => `<div style="margin-bottom: 8px;"><div class="job-header"><span class="company">${exp.company}</span><span>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span></div><div class="job-header"><span class="role">${exp.role}</span>${exp.location ? `<span>${exp.location}</span>` : ''}</div>${exp.descriptionType === 'paragraph' && exp.description ? `<p style="margin-top:4px;">${exp.description}</p>` : ''}${exp.descriptionType === 'bullets' && exp.achievements && exp.achievements.filter(a => a).length ? `<ul>${exp.achievements.filter(a => a).map(a => `<li>${a}</li>`).join('')}</ul>` : ''}</div>`).join('') + `</div>` : ''}
    
    ${cv.projects.length ? `<div class="section"><h2>Projects</h2>` + cv.projects.map(proj => `<div style="margin-bottom: 8px;"><div class="job-header"><span class="company">${proj.name}</span><span>${proj.startDate} - ${proj.current ? 'Present' : proj.endDate}</span></div>${proj.role || proj.company ? `<div class="job-header"><span class="role">${proj.role}${proj.role && proj.company ? ' at ' : ''}${proj.company}</span></div>` : ''}${proj.descriptionType === 'paragraph' && proj.description ? `<p style="margin-top:4px;">${proj.description}</p>` : ''}${proj.descriptionType === 'bullets' && proj.highlights && proj.highlights.filter(h => h).length ? `<ul>${proj.highlights.filter(h => h).map(h => `<li>${h}</li>`).join('')}</ul>` : ''}</div>`).join('') + `</div>` : ''}
    
    ${cv.skills.length ? `<div class="section"><h2>Technical Skills</h2>` + cv.skills.map(s => `<p><span class="skill-category">${s.category}:</span> ${s.items.filter(i => i).join(', ')}</p>`).join('') + `</div>` : ''}
    
    ${cv.certifications.length ? `<div class="section"><h2>Certifications</h2>` + cv.certifications.map(cert => `<p><span class="company">${cert.name}</span> - ${cert.issuer} (${cert.date})</p>`).join('') + `</div>` : ''}
    
    ${cv.languages.length ? `<div class="section"><h2>Languages</h2><p>${cv.languages.map(l => `${l.name}: ${l.proficiency}`).join(', ')}</p></div>` : ''}
  </div>
</body>
</html>`
    
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cv.displayName || 'resume'}-cv.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadCVPDF = () => {
    const fontSize = `${previewSettings.fontSize}pt`
    const fontFamily = previewSettings.fontFamily
    const pageWidth = previewSettings.pageWidth === '100%' ? '100%' : previewSettings.pageWidth
    const fs = previewSettings.fontSize
    const getFS = (scale: number = 1) => `${fs * scale}pt`

    const contactHtml = (() => {
      let parts = []
      if (cv.phone) parts.push(cv.phone)
      if (cv.linkedin) parts.push(cv.linkedin.replace(/^https?:\/\//, ''))
      if (cv.website) parts.push(cv.website.replace(/^https?:\/\//, ''))
      if (cv.address) parts.push(cv.address)
      return parts.join(' | ')
    })()

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${cv.displayName || 'Resume'}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
    body { font-family: ${fontFamily}; width: ${pageWidth}; min-height: 297mm; margin: 0 auto; padding: 15mm; font-size: ${fontSize}; line-height: 1.3; }
    h1 { font-size: ${getFS(1.6)}; font-weight: bold; margin-bottom: 3px; }
    h2 { font-size: ${getFS(0.9)}; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; margin-top: 10px; margin-bottom: 5px; text-transform: uppercase; letter-spacing: 0.5px; }
    .contact { font-size: ${getFS(0.9)}; margin-bottom: 10px; }
    .job-header { display: flex; justify-content: space-between; }
    .company { font-weight: bold; }
    .role { font-style: italic; }
    .degree { font-style: italic; }
    ul { margin: 3px 0; padding-left: 30px; text-indent: -15px; }
    li { padding-left: 15px; }
    .section { margin-bottom: 8px; }
    .skill-category { font-weight: bold; }
    .summary-image { float: left; margin-right: 12px; margin-bottom: 4px; width: ${cv.pictureSize === '35x45' ? '35mm' : '51mm'}; height: ${cv.pictureSize === '35x45' ? '45mm' : '51mm'}; }
    .summary-image img { width: 100%; height: 100%; object-fit: cover; border-radius: 4px; display: block; }
  </style>
</head>
<body>
  <div style="font-family: ${fontFamily};">
    <div style="text-align: center; margin-bottom: 10px;">
      <h1>${cv.displayName || ''}</h1>
      <p class="contact">${contactHtml}</p>
    </div>
    
    ${cv.summary ? `<div class="section"><h2>Professional Summary</h2>` + (cv.picture ? `<div class="summary-image"><img src="${cv.picture}" alt="Profile" /></div><p style="white-space: pre-wrap; margin: 0;">${cv.summary}</p><div style="clear: both;"></div>` : `<p style="white-space: pre-wrap;">${cv.summary}</p>`) + `</div>` : ''}
    
    ${cv.education.length ? `<div class="section"><h2>Education</h2>` + cv.education.map(edu => `<div style="margin-bottom: 8px;"><div class="job-header"><span class="company">${edu.institution}</span><span>${edu.year}</span></div><div class="job-header"><span class="degree">${edu.degree}</span>${edu.location ? `<span>${edu.location}</span>` : ''}</div></div>`).join('') + `</div>` : ''}
    
    ${cv.workExperience.length ? `<div class="section"><h2>Experience</h2>` + cv.workExperience.map(exp => `<div style="margin-bottom: 8px;"><div class="job-header"><span class="company">${exp.company}</span><span>${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</span></div><div class="job-header"><span class="role">${exp.role}</span>${exp.location ? `<span>${exp.location}</span>` : ''}</div>${exp.descriptionType === 'paragraph' && exp.description ? `<p style="margin-top:4px;">${exp.description}</p>` : ''}${exp.descriptionType === 'bullets' && exp.achievements && exp.achievements.filter(a => a).length ? `<ul>${exp.achievements.filter(a => a).map(a => `<li>${a}</li>`).join('')}</ul>` : ''}</div>`).join('') + `</div>` : ''}
    
    ${cv.projects.length ? `<div class="section"><h2>Projects</h2>` + cv.projects.map(proj => `<div style="margin-bottom: 8px;"><div class="job-header"><span class="company">${proj.name}</span><span>${proj.startDate} - ${proj.current ? 'Present' : proj.endDate}</span></div>${proj.role || proj.company ? `<div class="job-header"><span class="role">${proj.role}${proj.role && proj.company ? ' at ' : ''}${proj.company}</span></div>` : ''}${proj.descriptionType === 'paragraph' && proj.description ? `<p style="margin-top:4px;">${proj.description}</p>` : ''}${proj.descriptionType === 'bullets' && proj.highlights && proj.highlights.filter(h => h).length ? `<ul>${proj.highlights.filter(h => h).map(h => `<li>${h}</li>`).join('')}</ul>` : ''}</div>`).join('') + `</div>` : ''}
    
    ${cv.skills.length ? `<div class="section"><h2>Technical Skills</h2>` + cv.skills.map(s => `<p><span class="skill-category">${s.category}:</span> ${s.items.filter(i => i).join(', ')}</p>`).join('') + `</div>` : ''}
    
    ${cv.certifications.length ? `<div class="section"><h2>Certifications</h2>` + cv.certifications.map(cert => `<p><span class="company">${cert.name}</span> - ${cert.issuer} (${cert.date})</p>`).join('') + `</div>` : ''}
    
    ${cv.languages.length ? `<div class="section"><h2>Languages</h2><p>${cv.languages.map(l => `${l.name}: ${l.proficiency}`).join(', ')}</p></div>` : ''}
  </div>
</body>
</html>`

    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(html)
      printWindow.document.close()
      printWindow.onload = () => {
        printWindow.print()
      }
    }
  }

  const addWorkExperience = () => {
    setCV(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, {
        _id: Date.now().toString(),
        company: '',
        location: '',
        role: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        achievements: [''],
        descriptionType: 'bullets'
      }]
    }))
  }

  const updateWorkExperience = (index: number, field: string, value: any) => {
    setCV(prev => ({
      ...prev,
      workExperience: prev.workExperience.map((exp, i) => 
        i === index ? { ...exp, [field]: value } : exp
      )
    }))
  }

  const removeWorkExperience = (index: number) => {
    setCV(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter((_, i) => i !== index)
    }))
  }

  const addProject = () => {
    setCV(prev => ({
      ...prev,
      projects: [...prev.projects, {
        _id: Date.now().toString(),
        name: '',
        company: '',
        role: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        highlights: [''],
        descriptionType: 'bullets'
      }]
    }))
  }

  const updateProject = (index: number, field: string, value: any) => {
    setCV(prev => ({
      ...prev,
      projects: prev.projects.map((proj, i) => 
        i === index ? { ...proj, [field]: value } : proj
      )
    }))
  }

  const removeProject = (index: number) => {
    setCV(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }))
  }

  const addEducation = () => {
    setCV(prev => ({
      ...prev,
      education: [...prev.education, {
        _id: Date.now().toString(),
        degree: '',
        institution: '',
        location: '',
        year: '',
        description: ''
      }]
    }))
  }

  const updateEducation = (index: number, field: string, value: string) => {
    setCV(prev => ({
      ...prev,
      education: prev.education.map((edu, i) => 
        i === index ? { ...edu, [field]: value } : edu
      )
    }))
  }

  const removeEducation = (index: number) => {
    setCV(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }

  const addSkillCategory = () => {
    setCV(prev => ({
      ...prev,
      skills: [...prev.skills, {
        _id: Date.now().toString(),
        category: '',
        items: ['']
      }]
    }))
  }

  const updateSkillCategory = (index: number, field: string, value: any) => {
    setCV(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => 
        i === index ? { ...skill, [field]: value } : skill
      )
    }))
  }

  const removeSkillCategory = (index: number) => {
    setCV(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }))
  }

  const addLanguage = () => {
    setCV(prev => ({
      ...prev,
      languages: [...prev.languages, {
        _id: Date.now().toString(),
        name: '',
        proficiency: 'Native'
      }]
    }))
  }

  const updateLanguage = (index: number, field: string, value: string) => {
    setCV(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => 
        i === index ? { ...lang, [field]: value } : lang
      )
    }))
  }

  const removeLanguage = (index: number) => {
    setCV(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }))
  }

  const addCertification = () => {
    setCV(prev => ({
      ...prev,
      certifications: [...prev.certifications, {
        _id: Date.now().toString(),
        name: '',
        issuer: '',
        date: '',
        url: ''
      }]
    }))
  }

  const updateCertification = (index: number, field: string, value: string) => {
    setCV(prev => ({
      ...prev,
      certifications: prev.certifications.map((cert, i) => 
        i === index ? { ...cert, [field]: value } : cert
      )
    }))
  }

  const removeCertification = (index: number) => {
    setCV(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" style={{ color: 'var(--theme-primary)' }} />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black mb-1" style={{ color: 'var(--theme-text)' }}>CV Builder</h1>
            <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Build your professional resume</p>
          </div>
          <div className="flex items-center gap-3">
            {saveStatus === 'saved' && (
              <span className="flex items-center gap-1 text-sm" style={{ color: '#10B981' }}>
                <Check className="h-4 w-4" /> Saved
              </span>
            )}
            {saveStatus === 'error' && (
              <span className="flex items-center gap-1 text-sm" style={{ color: '#EF4444' }}>
                <AlertCircle className="h-4 w-4" /> Error saving
              </span>
            )}
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors"
              style={{ backgroundColor: showPreview ? 'var(--theme-primary)' : 'var(--theme-surface)', color: showPreview ? '#000' : 'var(--theme-text)' }}
            >
              {showPreview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showPreview ? 'Edit' : 'Preview'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
              style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              Save CV
            </button>
          </div>
        </div>
      </motion.div>

      {showPreview ? (
        <div className="flex gap-6">
          {/* CV Preview */}
          <div className="flex-1 flex justify-center overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white text-black p-8 shadow-lg"
              style={{ 
                width: previewSettings.pageWidth, 
                minHeight: '297mm',
                maxWidth: previewSettings.pageWidth === '100%' ? '100%' : undefined,
                fontFamily: previewSettings.fontFamily,
                fontSize: `${previewSettings.fontSize}pt`,
                lineHeight: '1.3'
              }}
            >
              <div style={{ fontFamily: previewSettings.fontFamily }}>
                <div className="text-center mb-3">
                  <h1 style={{ fontSize: getFontSize(previewSettings.fontSize, 1.6), fontWeight: 'bold' }}>{cv.displayName || 'Your Name'}</h1>
                  <div style={{ fontSize: getFontSize(previewSettings.fontSize, 0.9), marginTop: '4px' }}>
                  {cv.phone && (
                    <a href={`tel:${cv.phone.replace(/\s/g, '')}`} style={{ color: '#000', textDecoration: 'underline' }}>{cv.phone}</a>
                  )}
                  {cv.phone && (cv.linkedin || cv.website || cv.address) && <span> | </span>}
                  {cv.linkedin && (
                    <a href={cv.linkedin.startsWith('http') ? cv.linkedin : `https://${cv.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>LinkedIn</a>
                  )}
                  {cv.linkedin && (cv.website || cv.address) && <span> | </span>}
                  {cv.website && (
                    <a href={cv.website.startsWith('http') ? cv.website : `https://${cv.website}`} target="_blank" rel="noopener noreferrer" style={{ color: '#000', textDecoration: 'underline' }}>{cv.website.replace(/^https?:\/\//, '')}</a>
                  )}
                  {cv.website && cv.address && <span> | </span>}
                  {cv.address && <span>{cv.address}</span>}
                </div>
              </div>

            {cv.summary && (
              <div className="mb-3">
                <h2 style={{ fontSize: getFontSize(previewSettings.fontSize, 0.9), fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '4px', textTransform: 'uppercase' }}>Professional Summary</h2>
                {cv.picture ? (
                  <>
                    <div style={{ float: 'left', marginRight: '12px', marginBottom: '4px', width: cv.pictureSize === '35x45' ? '35mm' : '51mm', height: cv.pictureSize === '35x45' ? '45mm' : '51mm' }}>
                      <img 
                        src={cv.picture} 
                        alt="Profile" 
                        style={{ 
                          width: '100%', 
                          height: '100%',
                          objectFit: 'cover',
                          borderRadius: '4px',
                          display: 'block'
                        }} 
                      />
                    </div>
                    <p style={{ fontSize: getFontSize(previewSettings.fontSize), whiteSpace: 'pre-wrap', margin: 0 }}>{cv.summary}</p>
                    <div style={{ clear: 'both' }} />
                  </>
                ) : (
                  <p style={{ fontSize: getFontSize(previewSettings.fontSize), whiteSpace: 'pre-wrap' }}>{cv.summary}</p>
                )}
              </div>
            )}
            
            {cv.education.length > 0 && (
              <div className="mb-3">
                <h2 style={{ fontSize: getFontSize(previewSettings.fontSize, 0.9), fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '4px', textTransform: 'uppercase' }}>Education</h2>
                {cv.education.map((edu, i) => (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: getFontSize(previewSettings.fontSize) }}>{edu.institution}</span>
                      <span style={{ fontSize: getFontSize(previewSettings.fontSize) }}>{edu.year}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontStyle: 'italic', fontSize: getFontSize(previewSettings.fontSize) }}>{edu.degree}</span>
                      {edu.location && <span style={{ fontSize: getFontSize(previewSettings.fontSize) }}>{edu.location}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {cv.workExperience.length > 0 && (
              <div className="mb-3">
                <h2 style={{ fontSize: getFontSize(previewSettings.fontSize, 0.9), fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '4px', textTransform: 'uppercase' }}>Experience</h2>
                {cv.workExperience.map((exp, i) => (
                  <div key={i} style={{ marginBottom: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 'bold', fontSize: getFontSize(previewSettings.fontSize) }}>{exp.company}</span>
                      <span style={{ fontSize: getFontSize(previewSettings.fontSize) }}>{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontStyle: 'italic', fontSize: getFontSize(previewSettings.fontSize) }}>{exp.role}</span>
                      {exp.location && <span style={{ fontSize: getFontSize(previewSettings.fontSize) }}>{exp.location}</span>}
                    </div>
                    {exp.descriptionType === 'paragraph' && exp.description && (
                      <p style={{ fontSize: getFontSize(previewSettings.fontSize), marginTop: '4px' }}>{exp.description}</p>
                    )}
                    {exp.descriptionType === 'bullets' && exp.achievements && exp.achievements.filter(a => a).length > 0 && (
                      <ul style={{ fontSize: getFontSize(previewSettings.fontSize), listStyle: 'disc', paddingLeft: '30px', marginTop: '4px', textIndent: '-15px' }}>
                        {exp.achievements.filter(a => a).map((a, j) => (
                          <li key={j} style={{ paddingLeft: '15px' }}>{a}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {cv.skills.length > 0 && (
              <div className="mb-3">
                <h2 style={{ fontSize: getFontSize(previewSettings.fontSize, 0.9), fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '4px', textTransform: 'uppercase' }}>Technical Skills</h2>
                {cv.skills.map((skill, i) => (
                  <div key={i} style={{ fontSize: getFontSize(previewSettings.fontSize), marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold' }}>{skill.category}: </span>
                    <span>{skill.items.filter(i => i).join(', ')}</span>
                  </div>
                ))}
              </div>
            )}
            
            {cv.certifications.length > 0 && (
              <div className="mb-3">
                <h2 style={{ fontSize: getFontSize(previewSettings.fontSize, 0.9), fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '4px', textTransform: 'uppercase' }}>Certifications</h2>
                {cv.certifications.map((cert, i) => (
                  <div key={i} style={{ fontSize: getFontSize(previewSettings.fontSize), marginBottom: '4px' }}>
                    <span style={{ fontWeight: 'bold' }}>{cert.name}</span>
                    <span> - {cert.issuer} ({cert.date})</span>
                  </div>
                ))}
              </div>
            )}

            {cv.languages.length > 0 && (
              <div className="mb-3">
                <h2 style={{ fontSize: getFontSize(previewSettings.fontSize, 0.9), fontWeight: 'bold', borderBottom: '1px solid #000', marginBottom: '4px', textTransform: 'uppercase' }}>Languages</h2>
                <div style={{ fontSize: getFontSize(previewSettings.fontSize) }}>
                  {cv.languages.map((lang, i) => (
                    <span key={i}>{lang.name}: {lang.proficiency}{i < cv.languages.length - 1 ? ', ' : ''}</span>
                  ))}
                </div>
              </div>
              )}

            </div>
          </motion.div>
        </div>

          {/* Floating Controls Panel */}
          <div className="w-72 flex-shrink-0">
            <div className="sticky top-4 p-4 rounded-xl space-y-4" style={{ backgroundColor: 'var(--theme-surface)' }}>
              <h3 className="font-bold text-sm" style={{ color: 'var(--theme-text)' }}>Preview Controls</h3>
              
              {/* Font Family */}
              <div>
                <label className="text-xs block mb-2" style={{ color: 'var(--theme-text)' }}>Font Family</label>
                <select
                  value={previewSettings.fontFamily}
                  onChange={(e) => setPreviewSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
                >
                  {fonts.map(font => (
                    <option key={font.value} value={font.value} style={{ fontFamily: font.value }}>{font.label}</option>
                  ))}
                </select>
              </div>

              {/* Font Size Slider */}
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs" style={{ color: 'var(--theme-text)' }}>Font Size</label>
                  <span className="text-xs" style={{ color: 'var(--theme-primary)' }}>{previewSettings.fontSize}pt</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="20"
                  step="0.2"
                  value={previewSettings.fontSize}
                  onChange={(e) => setPreviewSettings(prev => ({ ...prev, fontSize: parseFloat(e.target.value) }))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ background: 'var(--theme-primary)', accentColor: 'var(--theme-primary)' }}
                />
                <div className="flex justify-between text-xs mt-1" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                  <span>6pt</span>
                  <span>20pt</span>
                </div>
              </div>

              {/* Page Width */}
              <div>
                <label className="text-xs block mb-2" style={{ color: 'var(--theme-text)' }}>Page Width</label>
                <select
                  value={previewSettings.pageWidth}
                  onChange={(e) => setPreviewSettings(prev => ({ ...prev, pageWidth: e.target.value }))}
                  className="w-full px-3 py-2 rounded-lg text-sm"
                  style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
                >
                  <option value="160mm">Narrow (160mm)</option>
                  <option value="180mm">Standard (180mm)</option>
                  <option value="210mm">A4 (210mm)</option>
                  <option value="216mm">US Letter (216mm)</option>
                  <option value="100%">Full Width</option>
                </select>
              </div>

              {/* Picture Size */}
              {cv.picture && (
                <div>
                  <label className="text-xs block mb-2" style={{ color: 'var(--theme-text)' }}>Picture Size</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCV(prev => ({ ...prev, pictureSize: '35x45' }))}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all"
                      style={{ 
                        backgroundColor: cv.pictureSize === '35x45' ? 'var(--theme-primary)' : 'var(--theme-background)',
                        color: cv.pictureSize === '35x45' ? '#000' : 'var(--theme-text)',
                        border: cv.pictureSize === '35x45' ? 'none' : '1px solid var(--theme-surface)'
                      }}
                    >
                      35×45 mm
                    </button>
                    <button
                      onClick={() => setCV(prev => ({ ...prev, pictureSize: '51x51' }))}
                      className="flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all"
                      style={{ 
                        backgroundColor: cv.pictureSize === '51x51' ? 'var(--theme-primary)' : 'var(--theme-background)',
                        color: cv.pictureSize === '51x51' ? '#000' : 'var(--theme-text)',
                        border: cv.pictureSize === '51x51' ? 'none' : '1px solid var(--theme-surface)'
                      }}
                    >
                      51×51 mm
                    </button>
                  </div>
                </div>
              )}

              {/* Download Buttons */}
              <div className="space-y-2">
                <button
                  onClick={downloadCVPDF}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </button>
                <button
                  onClick={downloadCV}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)', border: '1px solid var(--theme-surface)' }}
                >
                  <Download className="h-4 w-4" />
                  Download HTML
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Contact Info */}
          <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
            <FileText className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
            Contact Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Display Name</label>
              <input
                type="text"
                value={cv.displayName}
                onChange={(e) => setCV(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="How you want your name to appear on the CV"
                className="w-full px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Phone</label>
              <input
                type="tel"
                value={cv.phone}
                onChange={(e) => setCV(prev => ({ ...prev, phone: e.target.value }))}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Address</label>
              <input
                type="text"
                value={cv.address}
                onChange={(e) => setCV(prev => ({ ...prev, address: e.target.value }))}
                placeholder="City, Country"
                className="w-full px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>LinkedIn</label>
              <input
                type="url"
                value={cv.linkedin}
                onChange={(e) => setCV(prev => ({ ...prev, linkedin: e.target.value }))}
                placeholder="https://linkedin.com/in/username"
                className="w-full px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>WhatsApp</label>
              <input
                type="tel"
                value={cv.whatsapp}
                onChange={(e) => setCV(prev => ({ ...prev, whatsapp: e.target.value }))}
                placeholder="+1 234 567 8900"
                className="w-full px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Website</label>
              <input
                type="url"
                value={cv.website}
                onChange={(e) => setCV(prev => ({ ...prev, website: e.target.value }))}
                placeholder="https://yourwebsite.com"
                className="w-full px-4 py-3 rounded-xl"
                style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--theme-text)' }}>Profile Picture</label>
              <div className="space-y-3">
                <label htmlFor="cv-picture-upload" className="cursor-pointer block">
                  <div className="border-2 border-dashed rounded-xl p-4 transition-colors hover:border-[var(--theme-primary)]"
                    style={{ borderColor: 'var(--theme-surface)' }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Upload className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
                      <span className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>
                        {cv.picture ? 'Change Picture' : 'Upload Picture'}
                      </span>
                    </div>
                    <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Click to upload (JPG, PNG, max 2MB)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/gif,image/webp"
                    className="hidden"
                    id="cv-picture-upload"
                    onChange={async (e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        try {
                          const formData = new FormData()
                          formData.append('file', file)
                          formData.append('folder', 'cv')
                          
                          const res = await fetch('/api/files', {
                            method: 'POST',
                            body: formData,
                          })
                          const data = await res.json()
                          if (data.success) {
                            setCV(prev => ({ ...prev, picture: data.url }))
                          }
                        } catch (error) {
                          console.error('Failed to upload picture:', error)
                        }
                      }
                    }}
                  />
                </label>
                
                {cv.picture && (
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: 'var(--theme-background)' }}>
                    <img 
                      src={cv.picture} 
                      alt="CV Profile" 
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: 'var(--theme-text)' }}>Picture uploaded</p>
                      <p className="text-xs" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>Will appear on CV preview</p>
                    </div>
                    <button
                      onClick={() => setCV(prev => ({ ...prev, picture: '' }))}
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.section>

        {/* Summary */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
            <FileText className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
            Professional Summary
          </h2>
          <textarea
            value={cv.summary}
            onChange={(e) => setCV(prev => ({ ...prev, summary: e.target.value }))}
            placeholder="Write a brief professional summary..."
            rows={4}
            className="w-full p-4 rounded-xl resize-none focus:outline-none"
            style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
          />
        </motion.section>

        {/* Work Experience */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Briefcase className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
              Work Experience
            </h2>
            <button
              onClick={addWorkExperience}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-4">
            {cv.workExperience.map((exp, index) => (
              <div key={exp._id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-background)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateWorkExperience(index, 'role', e.target.value)}
                      placeholder="Job Title"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={(e) => updateWorkExperience(index, 'company', e.target.value)}
                      placeholder="Company"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={exp.location}
                      onChange={(e) => updateWorkExperience(index, 'location', e.target.value)}
                      placeholder="Location"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={(e) => updateWorkExperience(index, 'startDate', e.target.value)}
                        placeholder="Start Date"
                        className="px-3 py-2 rounded-lg flex-1"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={(e) => updateWorkExperience(index, 'endDate', e.target.value)}
                        placeholder="End Date"
                        className="px-3 py-2 rounded-lg flex-1"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                        disabled={exp.current}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="p-2 rounded-lg ml-2"
                    style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <input
                    type="checkbox"
                    id={`current-${exp._id}`}
                    checked={exp.current}
                    onChange={(e) => updateWorkExperience(index, 'current', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor={`current-${exp._id}`} className="text-sm" style={{ color: 'var(--theme-text)' }}>
                    I currently work here
                  </label>
                </div>
                
                <div className="mb-3">
                  <div className="flex gap-4 mb-2">
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--theme-text)' }}>
                      <input
                        type="radio"
                        name={`descType-${exp._id}`}
                        checked={exp.descriptionType === 'paragraph'}
                        onChange={() => updateWorkExperience(index, 'descriptionType', 'paragraph')}
                        className="rounded"
                      />
                      <span className="text-sm">Paragraph</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--theme-text)' }}>
                      <input
                        type="radio"
                        name={`descType-${exp._id}`}
                        checked={exp.descriptionType === 'bullets'}
                        onChange={() => updateWorkExperience(index, 'descriptionType', 'bullets')}
                        className="rounded"
                      />
                      <span className="text-sm">Bullet Points</span>
                    </label>
                  </div>
                  
                  {exp.descriptionType === 'paragraph' ? (
                    <textarea
                      value={exp.description}
                      onChange={(e) => updateWorkExperience(index, 'description', e.target.value)}
                      placeholder="Write a paragraph about your responsibilities and achievements..."
                      rows={3}
                      className="w-full p-3 rounded-lg resize-none"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                  ) : (
                    <div className="space-y-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <div key={achIndex} className="flex gap-2">
                          <span className="text-sm pt-2" style={{ color: 'var(--theme-text)' }}>-</span>
                          <input
                            type="text"
                            value={achievement}
                            onChange={(e) => {
                              const newAchievements = [...exp.achievements]
                              newAchievements[achIndex] = e.target.value
                              updateWorkExperience(index, 'achievements', newAchievements)
                            }}
                            placeholder="Achievement or responsibility..."
                            className="flex-1 px-3 py-2 rounded-lg text-sm"
                            style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                          />
                          {exp.achievements.length > 1 && (
                            <button
                              onClick={() => {
                                const newAchievements = exp.achievements.filter((_, i) => i !== achIndex)
                                updateWorkExperience(index, 'achievements', newAchievements)
                              }}
                              className="p-2 rounded-lg"
                              style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        onClick={() => updateWorkExperience(index, 'achievements', [...exp.achievements, ''])}
                        className="flex items-center gap-1 text-sm px-2 py-1 rounded"
                        style={{ color: 'var(--theme-primary)' }}
                      >
                        <Plus className="h-3 w-3" /> Add bullet point
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {cv.workExperience.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                No work experience added yet. Click "Add" to add one.
              </p>
            )}
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Code className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
              Projects
            </h2>
            <button
              onClick={addProject}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-4">
            {cv.projects.map((project, index) => (
              <div key={project._id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-background)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={project.name}
                      onChange={(e) => updateProject(index, 'name', e.target.value)}
                      placeholder="Project name *"
                      className="px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={project.company}
                      onChange={(e) => updateProject(index, 'company', e.target.value)}
                      placeholder="Company (optional)"
                      className="px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={project.role}
                      onChange={(e) => updateProject(index, 'role', e.target.value)}
                      placeholder="Your role (optional)"
                      className="px-3 py-2 rounded-lg text-sm"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={project.startDate}
                        onChange={(e) => updateProject(index, 'startDate', e.target.value)}
                        placeholder="Start date"
                        className="flex-1 px-3 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      />
                      <input
                        type="text"
                        value={project.endDate}
                        onChange={(e) => updateProject(index, 'endDate', e.target.value)}
                        placeholder="End date"
                        className="flex-1 px-3 py-2 rounded-lg text-sm"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeProject(index)}
                    className="p-2 rounded-lg ml-2"
                    style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <label className="flex items-center gap-2 mb-3 cursor-pointer" style={{ color: 'var(--theme-text)' }}>
                  <input
                    type="checkbox"
                    checked={project.current}
                    onChange={(e) => updateProject(index, 'current', e.target.checked)}
                    className="rounded"
                  />
                  <span className="text-sm">Currently working on this project</span>
                </label>

                <div className="mb-3">
                  <p className="text-xs mb-2" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>Description Format</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--theme-text)' }}>
                      <input
                        type="radio"
                        name={`projectDescType-${project._id}`}
                        checked={project.descriptionType === 'paragraph'}
                        onChange={() => updateProject(index, 'descriptionType', 'paragraph')}
                        className="rounded"
                      />
                      <span className="text-sm">Paragraph</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer" style={{ color: 'var(--theme-text)' }}>
                      <input
                        type="radio"
                        name={`projectDescType-${project._id}`}
                        checked={project.descriptionType === 'bullets'}
                        onChange={() => updateProject(index, 'descriptionType', 'bullets')}
                        className="rounded"
                      />
                      <span className="text-sm">Bullet Points</span>
                    </label>
                  </div>
                </div>

                {project.descriptionType === 'paragraph' ? (
                  <textarea
                    value={project.description}
                    onChange={(e) => updateProject(index, 'description', e.target.value)}
                    placeholder="Describe the project, your contributions, and outcomes..."
                    rows={4}
                    className="w-full p-3 rounded-lg resize-none"
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                  />
                ) : (
                  <div className="space-y-2">
                    {project.highlights.map((highlight, hlIndex) => (
                      <div key={hlIndex} className="flex gap-2">
                        <span className="text-sm pt-2" style={{ color: 'var(--theme-text)' }}>-</span>
                        <input
                          type="text"
                          value={highlight}
                          onChange={(e) => {
                            const newHighlights = [...project.highlights]
                            newHighlights[hlIndex] = e.target.value
                            updateProject(index, 'highlights', newHighlights)
                          }}
                          placeholder="Key highlight or achievement..."
                          className="flex-1 px-3 py-2 rounded-lg text-sm"
                          style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                        />
                        {project.highlights.length > 1 && (
                          <button
                            onClick={() => {
                              const newHighlights = project.highlights.filter((_, i) => i !== hlIndex)
                              updateProject(index, 'highlights', newHighlights)
                            }}
                            className="p-2 rounded-lg"
                            style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                          >
                            <X className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => updateProject(index, 'highlights', [...project.highlights, ''])}
                      className="flex items-center gap-1 text-sm px-2 py-1 rounded"
                      style={{ color: 'var(--theme-primary)' }}
                    >
                      <Plus className="h-3 w-3" /> Add highlight
                    </button>
                  </div>
                )}
              </div>
            ))}
            {cv.projects.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                No projects added yet. Click "Add" to add one.
              </p>
            )}
          </div>
        </motion.section>

        {/* Education */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <GraduationCap className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
              Education
            </h2>
            <button
              onClick={addEducation}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-4">
            {cv.education.map((edu, index) => (
              <div key={edu._id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-background)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1">
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                      placeholder="Degree"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                      placeholder="Institution"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={edu.location}
                      onChange={(e) => updateEducation(index, 'location', e.target.value)}
                      placeholder="Location"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(index, 'year', e.target.value)}
                      placeholder="Year"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                  </div>
                  <button
                    onClick={() => removeEducation(index)}
                    className="p-2 rounded-lg ml-2"
                    style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {cv.education.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                No education added yet. Click "Add" to add one.
              </p>
            )}
          </div>
        </motion.section>

        {/* Skills */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Code className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
              Skills
            </h2>
            <button
              onClick={addSkillCategory}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
            >
              <Plus className="h-4 w-4" /> Add Category
            </button>
          </div>
          <div className="space-y-4">
            {cv.skills.map((skill, index) => (
              <div key={skill._id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-background)' }}>
                <div className="flex justify-between items-start mb-3">
                  <input
                    type="text"
                    value={skill.category}
                    onChange={(e) => updateSkillCategory(index, 'category', e.target.value)}
                    placeholder="Skill Category (e.g., Frontend)"
                    className="px-3 py-2 rounded-lg flex-1"
                    style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                  />
                  <button
                    onClick={() => removeSkillCategory(index)}
                    className="p-2 rounded-lg ml-2"
                    style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <input
                  type="text"
                  value={skill.items.join(', ')}
                  onChange={(e) => updateSkillCategory(index, 'items', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                  placeholder="Skills (comma separated)"
                  className="w-full px-3 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                />
              </div>
            ))}
            {cv.skills.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                No skills added yet. Click "Add Category" to add one.
              </p>
            )}
          </div>
        </motion.section>

        {/* Languages */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Languages className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
              Languages
            </h2>
            <button
              onClick={addLanguage}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {cv.languages.map((lang, index) => (
              <div key={lang._id} className="flex gap-3">
                <input
                  type="text"
                  value={lang.name}
                  onChange={(e) => updateLanguage(index, 'name', e.target.value)}
                  placeholder="Language"
                  className="px-3 py-2 rounded-lg flex-1"
                  style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
                />
                <select
                  value={lang.proficiency}
                  onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                  className="px-3 py-2 rounded-lg"
                  style={{ backgroundColor: 'var(--theme-background)', color: 'var(--theme-text)' }}
                >
                  <option value="Native">Native</option>
                  <option value="Fluent">Fluent</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Basic">Basic</option>
                </select>
                <button
                  onClick={() => removeLanguage(index)}
                  className="p-2 rounded-lg"
                  style={{ backgroundColor: 'var(--theme-background)', color: '#EF4444' }}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {cv.languages.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                No languages added yet.
              </p>
            )}
          </div>
        </motion.section>

        {/* Certifications */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl border"
          style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: 'var(--theme-text)' }}>
              <Award className="h-5 w-5" style={{ color: 'var(--theme-primary)' }} />
              Certifications
            </h2>
            <button
              onClick={addCertification}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
            >
              <Plus className="h-4 w-4" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {cv.certifications.map((cert, index) => (
              <div key={cert._id} className="p-4 rounded-xl" style={{ backgroundColor: 'var(--theme-background)' }}>
                <div className="flex justify-between items-start mb-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1">
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(index, 'name', e.target.value)}
                      placeholder="Certification Name"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={cert.issuer}
                      onChange={(e) => updateCertification(index, 'issuer', e.target.value)}
                      placeholder="Issuer"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                    <input
                      type="text"
                      value={cert.date}
                      onChange={(e) => updateCertification(index, 'date', e.target.value)}
                      placeholder="Date"
                      className="px-3 py-2 rounded-lg"
                      style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                    />
                  </div>
                  <button
                    onClick={() => removeCertification(index)}
                    className="p-2 rounded-lg ml-2"
                    style={{ backgroundColor: 'var(--theme-surface)', color: '#EF4444' }}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
            {cv.certifications.length === 0 && (
              <p className="text-center py-4" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
                No certifications added yet.
              </p>
            )}
          </div>
        </motion.section>
      </div>
      )}
    </div>
  )
}
