export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const user = await prisma.user.findFirst({
      select: { id: true, email: true, name: true, role: true },
    })

    return NextResponse.json({ user: user || null })
  } catch (error) {
    console.error("Failed to get client session:", error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
