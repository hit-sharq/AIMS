"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useUser, UserButton } from "@clerk/nextjs"
import { Bell, X, Check, Users, ShieldCheck, Briefcase, LayoutDashboard, ShieldAlert, Sparkles, FolderGit2, Cpu, BarChart3, Settings } from "lucide-react"
import { RoleSelectorModal } from "@/components/app/RoleSelectorModal"

import "./header.css"

export function BrandMark({ compact }: { compact?: boolean }) {
  return (
    <Link href="/" className="brandmark" aria-label="JITUME Agency OS home">
      <span className="brandmark-mark" aria-hidden>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          <path d="M3 17 L9 6 L13 13 L19 4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="19" cy="4" r="2.2" fill="currentColor" />
        </svg>
      </span>
      {!compact && (
        <span className="brandmark-word">
          JITUME
          <em>Agency OS</em>
        </span>
      )}
    </Link>
  )
}

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [roleModalOpen, setRoleModalOpen] = useState(false)
  const { user, isLoaded, isSignedIn } = useUser()
  const [userRole, setUserRole] = useState<"creator" | "client" | null>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [unread, setUnread] = useState(0)
  const notifRef = useRef<HTMLDivElement>(null)

  const syncRole = () => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("synthos_user_role")
      if (saved === "creator" || saved === "client") {
        setUserRole(saved as "creator" | "client")
      } else {
        setUserRole(null)
      }
    }
  }

  useEffect(() => {
    syncRole()
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("synthos_user_role")
      if (!saved) {
        setRoleModalOpen(true)
      }
    }

    const handleRoleEvent = () => syncRole()
    window.addEventListener("storage", syncRole)
    window.addEventListener("synthos_role_change", handleRoleEvent)

    return () => {
      window.removeEventListener("storage", syncRole)
      window.removeEventListener("synthos_role_change", handleRoleEvent)
    }
  }, [])

  useEffect(() => {
    if (isSignedIn && userRole === "creator") {
      fetch("/api/notifications")
        .then(res => res.json())
        .then(data => {
          setNotifications(data.notifications || [])
          setUnread(data.unread || 0)
        })
        .catch(() => {})
    }
  }, [isSignedIn, userRole])

  const markAsRead = async (id: string) => {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" })
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n))
    setUnread(Math.max(0, unread - 1))
  }

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id)
    setNotifOpen(false)
    if (n.refId) {
      router.push(`/dashboard/projects/${n.refId}`)
    }
  }

  const markAllAsRead = async () => {
    await Promise.all(notifications.filter(n => !n.read).map(n => fetch(`/api/notifications/${n.id}`, { method: "PATCH" })))
    setNotifications(notifications.map(n => ({ ...n, read: true })))
    setUnread(0)
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }

    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside)
      document.addEventListener("touchstart", handleClickOutside as any)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("touchstart", handleClickOutside as any)
    }
  }, [notifOpen])

  return (
    <>
      <HeaderContent
        open={open}
        setOpen={setOpen}
        pathname={pathname}
        isSignedIn={!!isSignedIn}
        userRole={userRole}
        isLoaded={isLoaded}
        notifRef={notifRef}
        notifOpen={notifOpen}
        setNotifOpen={setNotifOpen}
        unread={unread}
        notifications={notifications}
        handleNotificationClick={handleNotificationClick}
        markAllAsRead={markAllAsRead}
        onOpenRoleModal={() => setRoleModalOpen(true)}
      />
      <RoleSelectorModal
        isOpen={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false)
          syncRole()
        }}
      />
    </>
  )
}

function HeaderContent({
  open,
  setOpen,
  pathname,
  isSignedIn,
  userRole,
  isLoaded,
  notifRef,
  notifOpen,
  setNotifOpen,
  unread,
  notifications,
  handleNotificationClick,
  markAllAsRead,
  onOpenRoleModal,
}: any) {
  const isInternalRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")

  return (
    <header className="topbar">
      <div className="topbar-inner">
        <div className="topbar-left">
          <BrandMark />
        </div>

        <nav className={`topnav ${open ? "open" : ""}`}>
          <Link href="/dashboard/overview" className={`topnav-link ${pathname === "/dashboard/overview" || pathname === "/" ? "active" : ""}`} onClick={() => setOpen(false)}>
            <LayoutDashboard size={14} style={{ marginRight: 6 }} /> Dashboard
          </Link>
          <Link href="/admin" className={`topnav-link ${pathname.startsWith("/admin") ? "active" : ""}`} onClick={() => setOpen(false)}>
            <ShieldAlert size={14} style={{ marginRight: 6 }} /> Workflow
          </Link>
          <Link href="/dashboard/projects" className={`topnav-link ${pathname.startsWith("/dashboard/projects") ? "active" : ""}`} onClick={() => setOpen(false)}>
            <FolderGit2 size={14} style={{ marginRight: 6 }} /> Projects
          </Link>
          <Link href="/meeting/demo" className={`topnav-link ${pathname.startsWith("/meeting") ? "active" : ""}`} onClick={() => setOpen(false)}>
            <Cpu size={14} style={{ marginRight: 6 }} /> Agents
          </Link>
          <Link href="/intake" className={`topnav-link ${pathname === "/intake" ? "active" : ""}`} onClick={() => setOpen(false)}>
            Start Project
          </Link>
        </nav>

        <div className="topbar-right">
          {/* Mode Badge & Role Switcher */}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => onOpenRoleModal()}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.84rem",
              fontWeight: 600,
              background: userRole === "creator" ? "rgba(79, 70, 229, 0.1)" : userRole === "client" ? "rgba(5, 150, 105, 0.1)" : "rgba(255, 255, 255, 0.8)",
              color: userRole === "creator" ? "#4f46e5" : userRole === "client" ? "#059669" : "#334155",
              border: userRole === "creator" ? "1px solid rgba(79, 70, 229, 0.25)" : userRole === "client" ? "1px solid rgba(5, 150, 105, 0.25)" : "1px solid rgba(203, 213, 225, 0.8)",
              borderRadius: "100px",
              padding: "7px 16px",
              cursor: "pointer",
            }}
          >
            {userRole === "creator" ? <ShieldCheck size={16} /> : userRole === "client" ? <Briefcase size={16} /> : <Users size={16} />}
            <span>{userRole === "creator" ? "Creator Mode" : userRole === "client" ? "Client Mode" : "Select Role"}</span>
          </button>

          {!isLoaded ? (
            <div style={{ width: 32, height: 32, background: "rgba(15, 23, 42, 0.05)", borderRadius: "50%" }} />
          ) : isSignedIn ? (
            <>
              {userRole === "creator" && (
                <div ref={notifRef} style={{ position: "relative" }}>
                  <button className="iconbtn" aria-label="Notifications" title="Notifications" onClick={() => setNotifOpen((v: any) => !v)}>
                    <Bell size={18} strokeWidth={1.8} />
                    {unread > 0 && <span className="iconbtn-count">{unread}</span>}
                  </button>
                  {notifOpen && (
                    <div className="notif-dropdown">
                      <div className="notif-head">
                        <span style={{ fontWeight: 600, fontSize: "0.86rem" }}>Notifications</span>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          {unread > 0 && (
                            <button className="notif-mark-read" onClick={markAllAsRead}>
                              <Check size={12} /> Mark all read
                            </button>
                          )}
                          <button className="notif-close" onClick={() => setNotifOpen(false)}><X size={14} /></button>
                        </div>
                      </div>
                      <div className="notif-list">
                        {notifications.length === 0 ? (
                          <div className="notif-item">
                            <p style={{ fontSize: "0.84rem", color: "var(--ink)" }}>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((n: any) => (
                            <div key={n.id} className={`notif-item ${!n.read ? "notif-item--unread" : ""}`} onClick={() => handleNotificationClick(n)} style={{ cursor: "pointer" }}>
                              <p style={{ fontSize: "0.84rem", color: "var(--ink)", fontWeight: !n.read ? 600 : 400 }}>{n.title}</p>
                              <p style={{ fontSize: "0.78rem", color: "var(--ink-3)", marginTop: 2 }}>{n.message}</p>
                              <span className="tiny muted" style={{ marginTop: 4, display: "block" }}>{new Date(n.createdAt).toLocaleString()}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
              <UserButton afterSignOutUrl="/" />
            </>
          ) : (
            <Link href="/sign-in" className="btn btn-signal btn-sm">Get Started</Link>
          )}
          <button className={`topbar-burger ${open ? "open" : ""}`} onClick={() => setOpen((v: any) => !v)} aria-label="Menu">
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
