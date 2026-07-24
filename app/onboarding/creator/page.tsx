"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHead, PageWrap } from "@/components/app/Page"
import { ShieldCheck, Sparkles, ArrowRight, CheckCircle2, User, DollarSign, FileCode, Layers } from "lucide-react"

export default function CreatorOnboardingPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    name: "",
    email: "",
    title: "",
    level: "SENIOR",
    skills: "",
    hourlyRate: "",
    cvUrl: "",
    linkedInUrl: "",
    gitHubUrl: "",
    portfolioUrl: "",
    bio: "",
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.name.trim() || !form.email.trim() || !form.title.trim()) {
      setError("Please fill in your Name, Email, and Primary Title.")
      return
    }

    setLoading(true)

    try {
      const skillsArray = form.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch("/api/creator/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: skillsArray.length > 0 ? skillsArray : ["React", "Node.js", "TypeScript", "PostgreSQL"],
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Creator onboarding failed.")

      setResult(data)
      localStorage.setItem("jitume_user_role", "creator")
      window.dispatchEvent(new CustomEvent("jitume_role_change", { detail: { role: "creator" } }))
    } catch (err: any) {
      setError(err?.message || "Onboarding submission failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrap>
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
        <PageHead
          eyebrow="Supply Network Onboarding · Creator Portal"
          title="Onboard as a Creator / Talent Specialist"
          desc="Register your developer, designer, or architectural capabilities. Our AI Gateway parses your profile, tags weighted skills, and routes matched high-value client projects directly to your dashboard."
        />

        {result ? (
          <div className="glass-panel p-8 sm:p-12 text-center animate-in fade-in max-w-3xl mx-auto mt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 text-xs font-mono font-bold text-emerald-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              PROFILE AI VERIFIED
            </span>

            <h3 className="mt-4 text-3xl font-extrabold text-slate-900">
              Welcome to Jitume AIMS Creator Network, {result.user?.name}!
            </h3>

            <p className="mt-2 text-base text-slate-700 max-w-lg mx-auto font-sans leading-relaxed">
              We&apos;ve registered your <strong className="text-slate-950">{result.profile?.title}</strong> ({result.profile?.level} Level) profile and generated your AI capability matrix.
            </p>

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => router.push("/dashboard/projects")}
                className="btn btn-signal btn-md font-mono text-xs uppercase tracking-wider gap-2"
              >
                View Matched Jobs Pool <ArrowRight size={16} />
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-8">
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-mono text-rose-700">
                {error}
              </div>
            )}

            {/* Section 1: Personal & Role Details */}
            <div className="glass-panel p-8 backdrop-blur-2xl">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200/80">
                <User className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Personal & Capability Details</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. alex@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Primary Title / Role <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Full-Stack Engineer"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={form.level}
                    onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  >
                    <option value="JUNIOR">Junior (1-2 yrs)</option>
                    <option value="MID">Mid-Level (3-4 yrs)</option>
                    <option value="SENIOR">Senior (5+ yrs)</option>
                    <option value="LEAD">Lead / Architect (8+ yrs)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Section 2: Technical Skills & Compensation */}
            <div className="glass-panel p-8 backdrop-blur-2xl">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200/80">
                <FileCode className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Technical Skills & Compensation</h3>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                      Target Hourly Rate (USD)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g. 85"
                      value={form.hourlyRate}
                      onChange={(e) => setForm({ ...form, hourlyRate: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                      GitHub Profile URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/your-handle"
                      value={form.gitHubUrl}
                      onChange={(e) => setForm({ ...form, gitHubUrl: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Core Skill Set Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Node.js, PostgreSQL, Tailwind CSS"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Bio / Software Engineering Summary
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Brief summary of your technical background, software architecture experience, and past projects..."
                    value={form.bio}
                    onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-signal btn-lg font-mono text-xs uppercase tracking-wider gap-2 flex items-center justify-center disabled:opacity-50 py-4 text-sm"
              >
                {loading ? (
                  <span>Registering Profile & Skill Matrix…</span>
                ) : (
                  <>
                    <span>Complete Creator Onboarding</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </PageWrap>
  )
}
