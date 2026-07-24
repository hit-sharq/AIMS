"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShieldCheck, Briefcase, Users, Cpu, Plus, Sparkles, FolderGit2, UserCheck, ShieldAlert } from "lucide-react"

import "./header.css"

export function BrandMark({ titleSubtitle }: { titleSubtitle?: string }) {
  return (
    <Link href="/" className="brandmark" aria-label="Jitume AIMS Home">
      <span className="brandmark-mark" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 17 L9 6 L13 13 L19 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19" cy="4" r="2.2" fill="currentColor" />
        </svg>
      </span>
      <span className="brandmark-word">
        JITUME AIMS
        <em>{titleSubtitle || "AI Talent Marketplace"}</em>
      </span>
    </Link>
  )
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Route-based Role Isolation
  const isAdmin = pathname.startsWith("/admin")

  return (
    <header className="topbar">
      <div className="topbar-inner">
        {/* Brand Header */}
        <div className="topbar-left">
          <BrandMark titleSubtitle={isAdmin ? "Mission Control" : "AI Talent Marketplace"} />
        </div>

        {/* Dynamic Role-Isolated Navigation Links */}
        <nav className={`topnav ${open ? "open" : ""}`}>
          {isAdmin ? (
            // Admin View Links ONLY
            <>
              <Link
                href="/admin"
                className={`topnav-link ${pathname === "/admin" ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <Cpu size={14} style={{ marginRight: 6 }} /> Match Matrix Engine
              </Link>
              <Link
                href="/admin/jobs"
                className={`topnav-link ${pathname === "/admin/jobs" ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <Briefcase size={14} style={{ marginRight: 6 }} /> Active Jobs
              </Link>
              <Link
                href="/admin/creators"
                className={`topnav-link ${pathname === "/admin/creators" ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <ShieldCheck size={14} style={{ marginRight: 6 }} /> Talent Network
              </Link>
            </>
          ) : (
            // Public / Client / Creator Standard Links
            <>
              <Link
                href="/intake"
                className={`topnav-link ${pathname === "/intake" ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <Plus size={14} style={{ marginRight: 6 }} /> Post a Job
              </Link>
              <Link
                href="/onboarding/creator"
                className={`topnav-link ${pathname === "/onboarding/creator" ? "active" : ""}`}
                onClick={() => setOpen(false)}
              >
                <UserCheck size={14} style={{ marginRight: 6 }} /> Join as Creator
              </Link>
            </>
          )}
        </nav>

        {/* Right Action Dock */}
        <div className="topbar-right">
          <div className="flex items-center gap-2">
            {isAdmin ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-100/90 border border-indigo-300 px-3.5 py-1.5 text-xs font-mono font-extrabold text-indigo-800 shadow-2xs">
                <ShieldAlert size={14} className="text-indigo-600" />
                Admin Oversight
              </span>
            ) : (
              <Link href="/admin" className="btn btn-signal btn-sm font-mono text-xs gap-1.5">
                <ShieldAlert size={14} />
                <span>Admin Mission Control</span>
              </Link>
            )}
          </div>

          <button className={`topbar-burger ${open ? "open" : ""}`} onClick={() => setOpen((v) => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
