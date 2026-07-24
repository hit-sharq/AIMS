"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import "@/components/app/admin.css"

type Message = {
  id: string
  senderName: string
  senderRole: string
  subject: string
  body: string
  createdAt: string
}

type ProjectData = {
  id: string
  name: string
  type: string
  stage: string
  status: string
  progress: number
  client: string
  clientName?: string
  clientCompany?: string
  createdAt?: string
  fathomMeetingId?: string
  fathomSummary?: string
  deliverables?: string[]
  brief?: any
  call?: any
  callSummary?: any
  understanding?: any
  projectBrief?: any
  synthesis?: any
  proposal?: any
  quote?: any
  roomName?: string
  messages?: Message[]
}

const STAGES = [
  "intake", "brief", "call", "understanding",
  "workshop", "synthesis", "proposal", "quote", "approval",
]

export default function PublicProjectPage() {
  const params = useParams()
  const token = params.token as string
  const user = null
  const isLoaded = true
  const [data, setData] = useState<ProjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [msgName, setMsgName] = useState("")
  const [msgEmail, setMsgEmail] = useState("")
  const [msgSubject, setMsgSubject] = useState("")
  const [msgBody, setMsgBody] = useState("")
  const [msgSending, setMsgSending] = useState(false)
  const [msgSent, setMsgSent] = useState(false)
  const [msgError, setMsgError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/public/project/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Project not found")
        return res.json()
      })
      .then((d) => setData(d))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [token])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    setMsgSending(true)
    setMsgError(null)

    try {
      const res = await fetch(`/api/public/project/${token}/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          senderName: msgName,
          senderEmail: msgEmail,
          subject: msgSubject,
          body: msgBody,
        }),
      })

      if (!res.ok) throw new Error("Failed to send message")

      const newMessage = await res.json()
      setData((prev) => (prev ? { ...prev, messages: [...(prev.messages || []), newMessage] } : prev))
      setMsgSent(true)
      setMsgSubject("")
      setMsgBody("")
    } catch (err: any) {
      setMsgError(err.message || "Something went wrong")
    } finally {
      setMsgSending(false)
    }
  }

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: "center", fontFamily: "var(--font-mono)", color: "var(--ink-3)" }}>
        Loading project portal…
      </div>
    )
  }

  if (error || !data) {
    return (
      <div style={{ padding: 60, textAlign: "center", maxWidth: 480, margin: "0 auto" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "1.6rem", color: "var(--ink)", marginBottom: 12 }}>Project Not Found</h1>
        <p style={{ fontSize: "0.92rem", color: "var(--ink-3)", marginBottom: 24 }}>The requested project link may be invalid or expired.</p>
        <Link href="/" className="btn btn-signal">Return Home</Link>
      </div>
    )
  }

  const currentStageIndex = STAGES.indexOf(data.stage)
  const currentStageLabel = data.stage ? data.stage.toUpperCase() : "INTAKE"

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>
      <div style={{ borderBottom: "1px solid var(--line)", paddingBottom: 24, marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16, marginBottom: 12 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", color: "var(--ink)", fontWeight: 500 }}>
            {data.name}
          </h1>
          <p style={{ fontSize: "0.92rem", color: "var(--ink-3)", marginBottom: 8 }}>
            Client: <span style={{ color: "var(--ink-2)" }}>{data.client || data.clientName || "Valued Client"}</span>
          </p>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span className={`admin-badge admin-badge-${data.status}`}>{data.status}</span>
          <span className="chip">{currentStageLabel}</span>
          {data.createdAt && <span className="tiny muted">{new Date(data.createdAt).toLocaleDateString()}</span>}
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", marginBottom: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
          Progress
        </h2>
        <div style={{ width: "100%", height: 6, background: "var(--line)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{ width: `${data.progress || 20}%`, height: "100%", background: "var(--signal)", borderRadius: 3, transition: "width 0.3s ease" }} />
        </div>
        <p className="tiny muted" style={{ marginTop: 6 }}>{data.progress || 20}% complete</p>
      </div>

      {/* Messaging Panel */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--ink-3)", marginBottom: 12, borderBottom: "1px solid var(--line)", paddingBottom: 8 }}>
          Project Communication
        </h2>
        <form onSubmit={handleSendMessage} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input className="admin-input" placeholder="Your Name" value={msgName} onChange={(e) => setMsgName(e.target.value)} required />
          <input className="admin-input" type="email" placeholder="Your Email" value={msgEmail} onChange={(e) => setMsgEmail(e.target.value)} required />
          <input className="admin-input" placeholder="Subject" value={msgSubject} onChange={(e) => setMsgSubject(e.target.value)} required />
          <textarea className="admin-input" placeholder="Message details..." value={msgBody} onChange={(e) => setMsgBody(e.target.value)} required rows={3} />
          <button type="submit" className="btn btn-signal" disabled={msgSending}>
            {msgSending ? "Sending…" : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  )
}
