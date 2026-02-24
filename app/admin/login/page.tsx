import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LoginForm } from "@/components/admin/login-form"

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#05070a] flex flex-col">
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 hover:text-[#00E5FF] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-[#00E5FF] rounded-lg flex items-center justify-center text-black font-black">
                D
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-white">DevPort</span>
            </Link>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Welcome back
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Sign in to access your admin dashboard
            </p>
          </div>

          <div className="bg-white dark:bg-[#0D1117] border border-slate-200 dark:border-[#1F2937] rounded-2xl p-8">
            <LoginForm />
          </div>

          <p className="text-xs text-slate-500 text-center mt-6">
            Only authorized users can access the admin area.
          </p>
        </div>
      </main>
    </div>
  )
}
