import type React from "react"
import Header from "@/components/app/Header"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#f8fafc]">
      <Header />
      {children}
    </div>
  )
}
