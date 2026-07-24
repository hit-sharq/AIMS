"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Briefcase, ShieldCheck, ArrowLeft, Menu, X, Cpu } from "lucide-react"
import "./admin.css"

const ESSENTIAL_ADMIN_NAV = [
  { href: "/admin", label: "Overview", icon: Cpu },
  { href: "/admin/jobs", label: "Active Jobs", icon: Briefcase },
  { href: "/admin/creators", label: "Talent Network", icon: ShieldCheck },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-layout">
      {sidebarOpen && <div className="admin-backdrop" onClick={() => setSidebarOpen(false)} />}
      <aside className={cn("admin-sidebar", sidebarOpen && "admin-sidebar--open")}>
        <div className="admin-sidebar-head">
          <Link href="/" className="admin-brand" onClick={() => setSidebarOpen(false)}>
            <span className="admin-brand-mark" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 17 L9 6 L13 13 L19 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19" cy="4" r="2.2" fill="currentColor" />
              </svg>
            </span>
            <span className="admin-brand-word">
              Jitume AIMS
              <em>Mission Control</em>
            </span>
          </Link>
          <button className="admin-sidebar-close" onClick={() => setSidebarOpen(false)} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="admin-nav">
          {ESSENTIAL_ADMIN_NAV.map((item) => {
            const active = pathname === item.href
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className={cn("admin-nav-item", active && "admin-nav-item--active")} onClick={() => setSidebarOpen(false)}>
                <Icon size={18} strokeWidth={1.8} />
                <span className="admin-nav-label">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="admin-sidebar-foot">
          <Link href="/dashboard/overview" className="admin-back" onClick={() => setSidebarOpen(false)}>
            <ArrowLeft size={14} /> Back to Creator Portal
          </Link>
        </div>
      </aside>

      <main className="admin-main">
        <button className="admin-mobile-toggle" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
          <Menu size={22} />
        </button>
        {children}
      </main>
    </div>
  )
}
