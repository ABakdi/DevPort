import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { LoginForm } from "@/components/admin/login-form"
import { authOptions } from "@/lib/auth"

export default async function LoginPage() {
  const session = await getServerSession(authOptions)

  if (session) {
    redirect("/admin")
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--theme-background)' }}>
      <header className="p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm transition-colors"
          style={{ color: 'var(--theme-text)', opacity: 0.7 }}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to site
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center text-black font-black" style={{ background: 'linear-gradient(135deg, var(--theme-primary), var(--theme-secondary))' }}>
                D
              </div>
              <span className="font-bold text-xl" style={{ color: 'var(--theme-text)' }}>DevPort</span>
            </Link>
            <h1 className="text-2xl font-black mb-2" style={{ color: 'var(--theme-text)' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--theme-text)', opacity: 0.7 }}>
              Sign in to access your admin dashboard
            </p>
          </div>

          <div className="border rounded-2xl p-8" style={{ backgroundColor: 'var(--theme-surface)', borderColor: 'var(--theme-surface)' }}>
            <LoginForm />
          </div>

          <p className="text-xs text-center mt-6" style={{ color: 'var(--theme-text)', opacity: 0.5 }}>
            Only authorized users can access the admin area.
          </p>
        </div>
      </main>
    </div>
  )
}
