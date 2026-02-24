"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion } from "framer-motion"
import { Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

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
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Check your email
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
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
          className="text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          Email address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            disabled={state === "sending"}
            required
            className="w-full h-12 pl-11 pr-4 rounded-lg border border-slate-200 dark:border-[#1F2937] bg-white dark:bg-[#0D1117] text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#00E5FF] focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
        className="w-full h-12 bg-[#00E5FF] hover:bg-[#00E5FF]/90 text-black font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
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

      <p className="text-xs text-slate-500 text-center">
        A secure link will be emailed to you and expires in 15 minutes.
      </p>
    </form>
  )
}
