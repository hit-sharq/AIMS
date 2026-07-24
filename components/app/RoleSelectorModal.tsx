"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Sparkles, ShieldCheck, Briefcase, X, ArrowRight } from "lucide-react"

export function RoleSelectorModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const router = useRouter()
  const [selectedRole, setSelectedRole] = useState<"creator" | "client" | null>(null)

  if (!isOpen) return null

  const handleSelectRole = (role: "creator" | "client") => {
    setSelectedRole(role)
    if (typeof window !== "undefined") {
      localStorage.setItem("jitume_user_role", role)
      window.dispatchEvent(new CustomEvent("jitume_role_change", { detail: { role } }))
    }

    onClose()

    if (role === "creator") {
      router.push("/onboarding/creator")
    } else {
      router.push("/intake")
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-white/90 backdrop-blur-2xl p-8 border border-white/80 shadow-2xl space-y-6">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="space-y-2">
          <span className="eyebrow inline-flex items-center gap-1.5 text-indigo-600 font-mono text-xs font-bold">
            <Sparkles size={14} /> Welcome to Jitume AIMS
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Select Your Marketplace Role
          </h2>
          <p className="text-sm text-slate-600 font-sans">
            Choose how you want to interact with the Jitume AIMS AI Talent Marketplace:
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 pt-2">
          {/* Option A: Creator */}
          <div
            onClick={() => handleSelectRole("creator")}
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-indigo-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Join as Creator</h3>
              <p className="text-xs text-slate-600 font-sans mt-1">
                Full-Stack Devs, Designers, and AI Engineers seeking matched client projects.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-mono font-bold text-indigo-600 group-hover:translate-x-1 transition">
              Join Supply Pool <ArrowRight size={14} className="ml-1" />
            </div>
          </div>

          {/* Option B: Client */}
          <div
            onClick={() => handleSelectRole("client")}
            className="group relative rounded-2xl border border-slate-200 bg-white p-6 hover:border-emerald-600 hover:shadow-lg transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-4 group-hover:bg-emerald-600 group-hover:text-white transition">
                <Briefcase size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Post a Job (Client)</h3>
              <p className="text-xs text-slate-600 font-sans mt-1">
                Post project requirements via 10-Second Intake and receive AI-matched creator leads.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-mono font-bold text-emerald-600 group-hover:translate-x-1 transition">
              Submit Job Intake <ArrowRight size={14} className="ml-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
