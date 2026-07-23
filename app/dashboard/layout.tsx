import { DashboardShell } from "@/components/app/DashboardShell"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth()
  if (!userId) redirect("/sign-in")

  return <DashboardShell>{children}</DashboardShell>
}
