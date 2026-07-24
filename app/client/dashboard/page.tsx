"use client"

import { useEffect, useState } from "react"
import { ClerkProvider, useUser, useClerk } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Plus, ExternalLink, Trash2 } from "lucide-react"
import "@/components/app/admin.css"

type Project = {
  id: string
  name: string
  type: string
  stage: string
  status: string
  budget?: string
  clientName?: string
  roomName?: string
  fathomMeetingId?: string
  fathomSummary?: string
  publicToken?: string
  slug?: string
}

function ClientDashboardContent() {
  const { user, isLoaded } = useUser()
  const { signOut } = useClerk()
  const router = useRouter()

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded && !user) {
      router.push("/client/login")
    }
  }, [isLoaded, user, router])

  useEffect(() => {
    if (user?.id) {
      fetch(`/api/client/projects?clerkId=${user.id}`)
        .then((res) => res.json())
        .then((data) => {
          if (Array.isArray(data.projects)) {
            setProjects(data.projects)
          }
        })
        .catch(() => {})
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [user])

  if (!isLoaded || loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
        Loading projects…
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--ink)", fontWeight: 500 }}>
            Client Dashboard
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--ink-3)" }}>Welcome, {user?.fullName || user?.primaryEmailAddress?.emailAddress}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link href="/intake" className="btn btn-signal" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
            <Plus size={14} /> Submit New Brief
          </Link>
          <button onClick={() => signOut(() => router.push("/"))} className="btn" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {projects.length === 0 ? (
          <div style={{ padding: 32, textAlign: "center", background: "var(--surface)", border: "1px solid var(--line)" }}>
            <p style={{ color: "var(--ink-2)", fontSize: "0.95rem" }}>No active projects found.</p>
          </div>
        ) : (
          projects.map((p) => (
            <div key={p.id} style={{ padding: 20, background: "var(--surface)", border: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)" }}>{p.name}</h3>
                <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>Stage: {p.stage}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default function ClientDashboardPage() {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "pk_test_placeholder"}>
      <ClientDashboardContent />
    </ClerkProvider>
  )
}
