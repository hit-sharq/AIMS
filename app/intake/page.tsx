"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PageHead, PageWrap } from "@/components/app/Page"
import { Sparkles, ArrowRight, CheckCircle2, Cpu, Building2, FileCode, DollarSign, Layers } from "lucide-react"

export default function ClientIntakePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    title: "",
    projectType: "E-Commerce",
    description: "",
    budgetMin: "10000",
    budgetMax: "30000",
    timeline: "8 Weeks",
    requiredLevel: "SENIOR",
    skills: "React, Node.js, TypeScript, UI/UX, PostgreSQL",
  })

  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!form.clientName.trim() || !form.clientEmail.trim() || !form.title.trim() || !form.description.trim()) {
      setError("Please complete all required fields (*).")
      return
    }

    setLoading(true)

    try {
      const skillsArray = form.skills.split(",").map((s) => s.trim()).filter(Boolean)

      const res = await fetch("/api/jobs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          skills: skillsArray,
        }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Failed to submit project request.")

      setResult(data)
    } catch (err: any) {
      setError(err?.message || "Submission failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageWrap>
      <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6">
        <PageHead
          eyebrow="10-Second Micro-Intake · Client Portal"
          title="Post Project Requirements"
          desc="The Jitume AIMS AI Matchmaker acts as a blind middleman. Post your project deliverables and budget—our comparison algorithm matches you with verified top creators."
        />

        {result ? (
          <div className="glass-panel p-8 sm:p-12 text-center animate-in fade-in max-w-3xl mx-auto mt-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 border border-emerald-200 text-emerald-600 mb-4">
              <CheckCircle2 size={36} />
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3.5 py-1 text-xs font-mono font-bold text-indigo-700">
              <Cpu className="h-3.5 w-3.5 animate-spin text-indigo-600" />
              AI SCANNING ACTIVE
            </span>

            <h3 className="mt-4 text-3xl font-extrabold text-slate-900">
              Project Request Submitted!
            </h3>

            <p className="mt-2 text-base text-slate-700 max-w-lg mx-auto font-sans leading-relaxed">
              AI is currently scanning for the perfect creator for <strong className="text-slate-950">&quot;{result.job?.title}&quot;</strong>.
            </p>

            {result.matches && result.matches.length > 0 && (
              <div className="mt-8 text-left border-t border-slate-200/80 pt-6 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  AI Matchmaker Initial Match Rankings ({result.matches.length} Top Creators Ranked)
                </h4>

                <div className="grid gap-4 sm:grid-cols-3">
                  {result.matches.map((m: any) => (
                    <div key={m.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-slate-500">RANK #{m.rank}</span>
                        <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 font-bold text-white text-[11px]">
                          {m.confidenceScore}% MATCH
                        </span>
                      </div>
                      <p className="mt-2 font-bold text-slate-900 text-sm">{m.creator.user.name}</p>
                      <p className="text-[11px] font-mono text-indigo-600">{m.creator.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-8 flex justify-center gap-4">
              <button
                onClick={() => router.push("/dashboard/overview")}
                className="btn btn-signal btn-md font-mono text-xs uppercase tracking-wider gap-2"
              >
                Go to Client Dashboard <ArrowRight size={16} />
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

            {/* Section 1: Client Details */}
            <div className="glass-panel p-8 backdrop-blur-2xl">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200/80">
                <Building2 className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Section 1: Client Details</h3>
              </div>

              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Company / Client Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Acme Global Tech"
                    value={form.clientName}
                    onChange={(e) => setForm({ ...form, clientName: e.target.value })}
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
                    placeholder="e.g. client@acme.com"
                    value={form.clientEmail}
                    onChange={(e) => setForm({ ...form, clientEmail: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Project Scope */}
            <div className="glass-panel p-8 backdrop-blur-2xl">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200/80">
                <FileCode className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Section 2: Project Scope</h3>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                      Project Title <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Next.js E-Commerce Web Application"
                      value={form.title}
                      onChange={(e) => setForm({ ...form, title: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                      Project Type
                    </label>
                    <select
                      value={form.projectType}
                      onChange={(e) => setForm({ ...form, projectType: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                    >
                      <option value="E-Commerce">E-Commerce Web App</option>
                      <option value="AI Integration">AI & LLM Integration</option>
                      <option value="SaaS Platform">SaaS Platform</option>
                      <option value="Mobile App">Mobile Application</option>
                      <option value="UI/UX Redesign">UI/UX Design System</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Detailed Scope & Key Deliverables <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe project goals, required tech stack, key features, and milestones..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                  />
                </div>
              </div>
            </div>

            {/* Section 3: Budget & Timeline */}
            <div className="glass-panel p-8 backdrop-blur-2xl">
              <div className="flex items-center gap-2 mb-6 pb-3 border-b border-slate-200/80">
                <DollarSign className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Section 3: Budget & Timeline</h3>
              </div>

              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                      Min Budget (KES)
                    </label>
                    <input
                      type="number"
                      placeholder="500000"
                      value={form.budgetMin}
                      onChange={(e) => setForm({ ...form, budgetMin: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                      Max Budget (KES)
                    </label>
                    <input
                      type="number"
                      placeholder="2500000"
                      value={form.budgetMax}
                      onChange={(e) => setForm({ ...form, budgetMax: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                      Timeline
                    </label>
                    <select
                      value={form.timeline}
                      onChange={(e) => setForm({ ...form, timeline: e.target.value })}
                      className="w-full rounded-2xl border border-slate-200/80 bg-white/70 backdrop-blur-md px-4 py-3 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
                    >
                      <option value="4 Weeks">4 Weeks</option>
                      <option value="8 Weeks">8 Weeks</option>
                      <option value="12 Weeks">12 Weeks</option>
                      <option value="16 Weeks">16 Weeks</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase text-slate-700 mb-2">
                    Required Skill Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    placeholder="React, Node.js, TypeScript, PostgreSQL, UI/UX"
                    value={form.skills}
                    onChange={(e) => setForm({ ...form, skills: e.target.value })}
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
                  <span>Running AI Matchmaker Engine…</span>
                ) : (
                  <>
                    <span>Submit 10-Second Intake</span>
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
