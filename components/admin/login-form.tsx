"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const isDev = process.env.NODE_ENV === "development"

type LoginState = "idle" | "sending" | "success" | "error"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [state, setState] = useState<LoginState>("idle")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setState("sending")
    setError("")

    try {
      const result = await signIn("email", {
        email,
        redirect: false,
        callbackUrl: "/admin",
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      setState("success")
    } catch (err) {
      setState("error")
      setError(err instanceof Error ? err.message : "Failed to send magic link")
    }
  }

  const handleDevLogin = async () => {
    if (!email) return
    
    setState("sending")
    setError("")

    try {
      const res = await fetch("/api/auth/dev-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Dev login failed")
      }

      const data = await res.json()
      
      await signIn("credentials", {
        email: data.user.email,
        userId: data.user._id,
        redirect: true,
        callbackUrl: "/admin",
      })
    } catch (err) {
      setState("error")
      setError(err instanceof Error ? err.message : "Dev login failed")
    }
  }

  if (state === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-emerald-500" />
        </div>
        <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--theme-text)' }}>
          Check your email
        </h3>
        <p className="mb-6" style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
          We sent a magic link to <span className="font-medium">{email}</span>
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setState("idle")
            setEmail("")
          }}
        >
          Send again
        </Button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
          style={{ color: 'var(--theme-text)' }}
        >
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" style={{ color: 'var(--theme-text)', opacity: 0.5 }} />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={state === "sending"}
            required
            className="w-full h-12 pl-11 pr-4 rounded-lg border focus:outline-none focus:ring-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            style={{ 
              borderColor: 'var(--theme-surface)',
              backgroundColor: 'var(--theme-surface)',
              color: 'var(--theme-text)',
              '--tw-ring-color': 'var(--theme-primary)',
            } as any}
          />
        </div>
      </div>

      {state === "error" && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      <Button
        type="submit"
        disabled={state === "sending" || !email}
        className="w-full h-12 font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        style={{ backgroundColor: 'var(--theme-primary)', color: '#000000' }}
      >
        {state === "sending" ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Magic Link"
        )}
      </Button>

      {isDev && (
        <Button
          type="button"
          onClick={handleDevLogin}
          disabled={state === "sending" || !email}
          variant="outline"
          className="w-full h-12 font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          style={{ borderColor: 'var(--theme-primary)', color: 'var(--theme-primary)' }}
        >
          <Zap className="h-5 w-5" />
          Dev Login (Bypass)
        </Button>
      )}

      <p className="text-xs text-center" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
        A secure link will be emailed to you and expires in 15 minutes.
      </p>
    </form>
  )
}
