"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function ClientSignupPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      router.push("/client/login?registered=1")
    }, 400)
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="max-w-md w-full glass-panel p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Create Client Account</h1>
          <p className="text-xs text-slate-600 mt-1 font-sans">Register to manage project intakes and review talent recommendations.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Full Name <span className="text-indigo-600">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              placeholder="Alex Kamau"
            />
          </div>

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
              placeholder="alex@enterprise.co.ke"
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1">
              Company Name
            </label>
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              placeholder="Enterprise Solutions Ltd"
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
              minLength={8}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-mono font-bold transition-all shadow-sm"
          >
            {loading ? "Creating account…" : "Create Client Account"}
          </button>
        </form>

        <p className="text-xs font-mono text-center text-slate-500">
          Already have an account?{" "}
          <Link href="/client/login" className="text-indigo-600 hover:underline font-bold">
            Log in
          </Link>
        </p>
      </div>
    </div>
  )
}
