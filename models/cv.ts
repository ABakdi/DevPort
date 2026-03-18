import mongoose, { Schema, Document } from 'mongoose'

export interface CVProject {
  _id?: string
  name: string
  company?: string
  role?: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  highlights: string[]
}

export interface WorkExperience {
  _id?: string
  company: string
  location: string
  role: string
  startDate: string
  endDate: string
  current: boolean
  description: string
  achievements: string[]
}

export interface Education {
  _id?: string
  degree: string
  institution: string
  location: string
  year: string
  description?: string
}

export interface Skill {
  _id?: string
  category: string
  items: string[]
}

export interface Language {
  _id?: string
  name: string
  proficiency: string
}

export interface Certification {
  _id?: string
  name: string
  issuer: string
  date: string
  url?: string
}

export interface ICV extends Document {
  displayName: string
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
  updatedAt: Date
}

const WorkExperienceSchema = new Schema({
  company: { type: String, required: true },
  location: { type: String, default: '' },
  role: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  achievements: [{ type: String }]
})

const CVProjectSchema = new Schema({
  name: { type: String, required: true },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  startDate: { type: String, required: true },
  endDate: { type: String, default: '' },
  current: { type: Boolean, default: false },
  description: { type: String, default: '' },
  highlights: [{ type: String }]
})

const EducationSchema = new Schema({
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, default: '' },
  year: { type: String, required: true },
  description: { type: String, default: '' }
})

const SkillSchema = new Schema({
  category: { type: String, required: true },
  items: [{ type: String }]
})

const LanguageSchema = new Schema({
  name: { type: String, required: true },
  proficiency: { type: String, required: true }
})

const CertificationSchema = new Schema({
  name: { type: String, required: true },
  issuer: { type: String, required: true },
  date: { type: String, required: true },
  url: { type: String, default: '' }
})

const CustomSectionSchema = new Schema({
  title: { type: String, required: true },
  content: { type: String, default: '' }
})

const CVSchema = new Schema<ICV>({
  displayName: { type: String, default: '' },
  summary: {
    type: String,
    default: '',
    maxlength: [1000, 'Summary cannot exceed 1000 characters']
  },
  phone: { type: String, default: '' },
  address: { type: String, default: '' },
  linkedin: { type: String, default: '' },
  whatsapp: { type: String, default: '' },
  website: { type: String, default: '' },
  workExperience: [WorkExperienceSchema],
  projects: [CVProjectSchema],
  education: [EducationSchema],
  skills: [SkillSchema],
  languages: [LanguageSchema],
  certifications: [CertificationSchema],
  customSections: [CustomSectionSchema],
  previewSettings: {
    fontFamily: { type: String, default: 'Arial, sans-serif' },
    fontSize: { type: Number, default: 10 },
    pageWidth: { type: String, default: '210mm' }
  },
  template: { type: String, default: 'classic' }
}, {
  timestamps: true
})

export const CV = mongoose.models.CV || mongoose.model<ICV>('CV', CVSchema)
