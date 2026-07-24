"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"

type Project = {
  id: string
  name: string
  type: string
  stage: string
  status: string
}

export default function ClientDashboardPage() {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/projects")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data.projects)) {
          setProjects(data.projects)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="py-16 text-center font-mono text-slate-500">
        Loading client projects…
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200 pb-6 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Client Portal Dashboard
          </h1>
          <p className="text-sm font-sans text-slate-600 mt-1">
            Manage your project intakes and developer match reviews.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/intake" className="btn btn-signal btn-sm font-mono text-xs gap-1.5">
            <Plus size={14} /> Submit New Brief
          </Link>
        </div>
      </div>

      <div className="space-y-4">
        {projects.length === 0 ? (
          <div className="glass-panel p-8 text-center text-slate-500">
            <p className="text-sm font-semibold text-slate-700">No active client projects found.</p>
            <p className="text-xs font-mono text-slate-500 mt-1">
              Submit a 10-Second Micro-Intake to initiate a developer match.
            </p>
          </div>
        ) : (
          projects.map((p) => (
            <div key={p.id} className="glass-card flex items-center justify-between p-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                <span className="text-xs font-mono text-indigo-600 font-semibold">Stage: {p.stage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
