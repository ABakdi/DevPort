import { Metadata } from "next"
import Link from "next/link"
import { connectToDatabase } from "@/lib/mongodb"
import { CV } from "@/models/cv"
import { Profile } from "@/models/profile"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'CV | DevPort',
  description: 'Professional resume and CV',
}

async function getCVData() {
  await connectToDatabase()
  
  const cv = await CV.findOne().lean()
  const profile = await Profile.findOne().lean()
  
  return { cv: cv || {}, profile: profile || {} }
}

export default async function CVPage() {
  const { cv, profile } = await getCVData()

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--theme-background)' }}>
      {/* Navbar */}
      <header 
        className="sticky top-0 z-50 backdrop-blur-xl border-b"
        style={{ 
          backgroundColor: 'color-mix(in srgb, var(--theme-background) 80%, transparent)',
          borderColor: 'var(--theme-surface)'
        }}
      >
        <nav className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center text-black font-black"
              style={{ backgroundColor: 'var(--theme-primary)' }}
            >
              D
            </div>
            <span className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>
              DevPort
            </span>
          </Link>
          
          <div className="flex items-center gap-4">
            {[
              { href: "/", label: "Home" },
              { href: "/blog", label: "Blog" },
              { href: "/about", label: "About" },
              { href: "/projects", label: "Work" },
            ].map(link => (
              <Link 
                key={link.href} 
                href={link.href}
                className="text-sm font-medium transition-colors hover:text-[var(--theme-primary)]"
                style={{ color: 'var(--theme-text)', opacity: 0.7 }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <header className="text-center mb-12">
          <div 
            className="w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold"
            style={{ backgroundColor: 'var(--theme-primary)', color: '#000' }}
          >
            {profile.name ? profile.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2) : 'AB'}
          </div>
          <h1 className="text-4xl font-black mb-2" style={{ color: 'var(--theme-text)' }}>
            {cv.displayName || profile.name || 'Your Name'}
          </h1>
          <p className="text-xl mb-4" style={{ color: 'var(--theme-primary)' }}>
            {profile.title || 'Your Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
            {profile.email && <span className="flex items-center gap-1">📧 {profile.email}</span>}
            {cv.phone && <span className="flex items-center gap-1">📱 {cv.phone}</span>}
            {cv.address && <span className="flex items-center gap-1">📍 {cv.address}</span>}
            {cv.linkedin && <span className="flex items-center gap-1">💼 <a href={cv.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--theme-primary)]">LinkedIn</a></span>}
            {cv.whatsapp && <span className="flex items-center gap-1">💬 <a href={`https://wa.me/${cv.whatsapp.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--theme-primary)]">WhatsApp</a></span>}
            {cv.website && <span className="flex items-center gap-1">🌐 <a href={cv.website} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--theme-primary)]">{cv.website.replace(/^https?:\/\//, '')}</a></span>}
          </div>
        </header>

        {/* Summary */}
        {cv.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
              Professional Summary
            </h2>
            <p style={{ color: 'var(--theme-text)', opacity: 0.8, lineHeight: 1.7 }}>{cv.summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {cv.workExperience && cv.workExperience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
              Work Experience
            </h2>
            <div className="space-y-6">
              {cv.workExperience.map((exp: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>{exp.role}</h3>
                      <p style={{ color: 'var(--theme-primary)' }}>{exp.company}</p>
                    </div>
                    <div className="text-right text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                      {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                      {exp.location && <br />}{exp.location}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="mb-2" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{exp.description}</p>
                  )}
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
                      {exp.achievements.map((achievement: string, i: number) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {cv.projects && cv.projects.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
              Projects
            </h2>
            <div className="space-y-6">
              {cv.projects.map((project: any, index: number) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-lg" style={{ color: 'var(--theme-text)' }}>{project.name}</h3>
                      {(project.company || project.role) && (
                        <p style={{ color: 'var(--theme-primary)' }}>
                          {project.role}{project.role && project.company && ' at '}{project.company}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                      {project.startDate} - {project.current ? 'Present' : project.endDate}
                    </div>
                  </div>
                  {project.description && (
                    <p className="mb-2" style={{ color: 'var(--theme-text)', opacity: 0.8 }}>{project.description}</p>
                  )}
                  {project.highlights && project.highlights.length > 0 && (
                    <ul className="list-disc list-inside space-y-1" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
                      {project.highlights.map((highlight: string, i: number) => (
                        <li key={i}>{highlight}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {cv.education && cv.education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
              Education
            </h2>
            <div className="space-y-4">
              {cv.education.map((edu: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <h3 className="font-bold" style={{ color: 'var(--theme-text)' }}>{edu.degree}</h3>
                    <p style={{ color: 'var(--theme-primary)' }}>{edu.institution}</p>
                  </div>
                  <div className="text-right text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                    {edu.year}
                    {edu.location && <br />}{edu.location}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {cv.skills && cv.skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
              Skills
            </h2>
            <div className="space-y-3">
              {cv.skills.map((skill: any, index: number) => (
                <div key={index}>
                  <h3 className="font-semibold mb-2" style={{ color: 'var(--theme-text)' }}>{skill.category}</h3>
                  <div className="flex flex-wrap gap-2">
                    {skill.items && skill.items.map((item: string, i: number) => (
                      <span 
                        key={i}
                        className="px-3 py-1 rounded-full text-sm"
                        style={{ backgroundColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages */}
        {cv.languages && cv.languages.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
              Languages
            </h2>
            <div className="flex flex-wrap gap-4">
              {cv.languages.map((lang: any, index: number) => (
                <div key={index} className="flex items-center gap-2">
                  <span style={{ color: 'var(--theme-text)' }}>{lang.name}</span>
                  <span style={{ color: 'var(--theme-text)', opacity: 0.5 }}>-</span>
                  <span style={{ color: 'var(--theme-primary)' }}>{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {cv.certifications && cv.certifications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold mb-4 pb-2 border-b" style={{ borderColor: 'var(--theme-surface)', color: 'var(--theme-text)' }}>
              Certifications
            </h2>
            <div className="space-y-3">
              {cv.certifications.map((cert: any, index: number) => (
                <div key={index} className="flex justify-between">
                  <div>
                    <h3 className="font-semibold" style={{ color: 'var(--theme-text)' }}>{cert.name}</h3>
                    <p style={{ color: 'var(--theme-primary)' }}>{cert.issuer}</p>
                  </div>
                  <div className="text-right text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
                    {cert.date}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="py-8 border-t text-center" style={{ borderColor: 'var(--theme-surface)', backgroundColor: 'var(--theme-background)' }}>
        <p className="text-sm" style={{ color: 'var(--theme-text)', opacity: 0.6 }}>
          &copy; {new Date().getFullYear()} {profile.name || 'DevPort'}. All rights reserved.
        </p>
      </footer>
    </div>
  )
}
