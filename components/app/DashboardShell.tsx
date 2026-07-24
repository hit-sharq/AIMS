"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  FolderOpen,
  UserCheck,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  X,
  Cpu,
} from "lucide-react"
import { useState } from "react"

import "./dashboard.css"

const CREATOR_NAV = [
  { href: "/dashboard/overview", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Matched Jobs", icon: FolderOpen },
  { href: "/dashboard/contracts", label: "Active Contracts", icon: Briefcase },
  { href: "/onboarding/creator", label: "My Profile", icon: UserCheck },
]

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="dash-layout">
      {mobileOpen && <div className="dash-backdrop" onClick={() => setMobileOpen(false)} />}
      <aside className={cn("dash-sidebar", collapsed && "dash-sidebar--collapsed", mobileOpen && "dash-sidebar--mobile-open")}>
        <div className="dash-sidebar-head">
          <Link href="/" className="dash-brand" onClick={() => setMobileOpen(false)}>
            <span className="dash-brand-mark" aria-hidden>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M3 17 L9 6 L13 13 L19 4" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="19" cy="4" r="2.2" fill="currentColor" />
              </svg>
            </span>
            {!collapsed && (
              <span className="dash-brand-word">
                Jitume AIMS
                <em>Creator Portal</em>
              </span>
            )}
          </Link>
          <div className="dash-sidebar-actions">
            <button className="dash-collapse" onClick={() => setCollapsed((v) => !v)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
            <button className="dash-sidebar-close" onClick={() => setMobileOpen(false)} aria-label="Close menu">
              <X size={20} />
            </button>
          </div>
        </div>

        <nav className="dash-nav">
          {CREATOR_NAV.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard/overview" && pathname.startsWith(item.href))
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className={cn("dash-nav-item", active && "dash-nav-item--active")} title={collapsed ? item.label : undefined} onClick={() => setMobileOpen(false)}>
                <Icon size={18} strokeWidth={1.8} />
                {!collapsed && <span className="dash-nav-label">{item.label}</span>}
              </Link>
            )
          })}
        </nav>

        <div className="dash-sidebar-foot">
          <span className="dash-ai-status">
            <span className="dash-ai-dot" />
            {!collapsed && <span>AI Matcher Active</span>}
          </span>
        </div>
      </aside>

      <main className="dash-main">
        <div className="dash-toolbar">
          <button className="dash-mobile-toggle" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
          </button>
        </div>
        {children}
      </main>
    </div>
  )
}
