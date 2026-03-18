"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Mail, Loader2, Check, AlertCircle } from "lucide-react"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("sending")
    setErrorMessage("")

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setStatus("success")
        setFormData({ name: "", email: "", subject: "", message: "" })
        setTimeout(() => setStatus("idle"), 5000)
      } else {
        const data = await res.json()
        setErrorMessage(data.error || "Failed to send message")
        setStatus("error")
        setTimeout(() => setStatus("idle"), 5000)
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.")
      setStatus("error")
      setTimeout(() => setStatus("idle"), 5000)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <section id="contact-section" className="py-16">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl overflow-hidden"
          style={{ 
            backgroundColor: 'var(--theme-surface)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        >
          {/* Header */}
          <div 
            className="p-8 pb-0"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-primary) 10%, var(--theme-surface)), color-mix(in srgb, var(--theme-secondary) 10%, var(--theme-surface)))`
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
              Get In Touch
            </h2>
            <p style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
              Have a question or want to work together? Drop me a message!
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <label 
                  htmlFor="name" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: 'var(--theme-background)',
                    color: 'var(--theme-text)',
                    borderColor: 'var(--theme-surface)'
                  }}
                  placeholder="Your name"
                />
              </div>
              <div>
                <label 
                  htmlFor="email" 
                  className="block text-sm font-medium mb-2"
                  style={{ color: 'var(--theme-text)' }}
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                  style={{ 
                    backgroundColor: 'var(--theme-background)',
                    color: 'var(--theme-text)',
                    borderColor: 'var(--theme-surface)'
                  }}
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div className="mb-4">
              <label 
                htmlFor="subject" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--theme-text)' }}
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all"
                style={{ 
                  backgroundColor: 'var(--theme-background)',
                  color: 'var(--theme-text)',
                  borderColor: 'var(--theme-surface)'
                }}
                placeholder="What's this about?"
              />
            </div>

            <div className="mb-6">
              <label 
                htmlFor="message" 
                className="block text-sm font-medium mb-2"
                style={{ color: 'var(--theme-text)' }}
              >
                Message
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className="w-full px-4 py-3 rounded-xl focus:outline-none focus:ring-2 transition-all resize-none"
                style={{ 
                  backgroundColor: 'var(--theme-background)',
                  color: 'var(--theme-text)',
                  borderColor: 'var(--theme-surface)'
                }}
                placeholder="Your message..."
              />
            </div>

            {status === "error" && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#FEE2E2' }}>
                <AlertCircle className="h-4 w-4" style={{ color: '#DC2626' }} />
                <p className="text-sm" style={{ color: '#DC2626' }}>{errorMessage}</p>
              </div>
            )}

            {status === "success" && (
              <div className="mb-4 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: '#D1FAE5' }}>
                <Check className="h-4 w-4" style={{ color: '#059669' }} />
                <p className="text-sm" style={{ color: '#059669' }}>Message sent successfully! I'll get back to you soon.</p>
              </div>
            )}

            <button
              type="submit"
              disabled={status === "sending" || status === "success"}
              className="w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ 
                background: status === "success" 
                  ? '#10B981' 
                  : 'linear-gradient(90deg, var(--theme-primary), var(--theme-secondary))',
                color: status === "success" ? '#fff' : '#000'
              }}
            >
              {status === "sending" ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Sending...
                </>
              ) : status === "success" ? (
                <>
                  <Check className="h-5 w-5" />
                  Sent!
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Send Message
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
