"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ClientLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/client/dashboard")
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Client Access</h1>
          <p className="text-xs text-slate-600 mt-1 font-sans">Log in to view your projects and matched talent.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Email Address <span className="text-indigo-600">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              placeholder="client@company.com"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Password <span className="text-indigo-600">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-sm"
          >
            {loading ? "Signing in…" : "Sign In to Client Portal"}
          </button>
        </form>

        <p className="text-xs font-mono text-center text-slate-500">
          Don&apos;t have an account?{" "}
          <Link href="/client/signup" className="text-indigo-600 hover:underline font-bold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
