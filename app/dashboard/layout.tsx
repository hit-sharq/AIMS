import type React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full min-h-screen bg-[#f8fafc] pt-24 px-4 sm:px-6 lg:px-8">
      {children}
    </main>
  )
}
