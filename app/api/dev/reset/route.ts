import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  return handleReset()
}

export async function POST() {
  return handleReset()
}

async function handleReset() {
  try {
    // Clean wipe of all database tables
    await prisma.match.deleteMany({})
    await prisma.jobSkill.deleteMany({})
    await prisma.job.deleteMany({})
    await prisma.creatorSkill.deleteMany({})
    await prisma.creatorProfile.deleteMany({})
    await prisma.clientProfile.deleteMany({})
    await prisma.user.deleteMany({})

    return NextResponse.json({
      success: true,
      message: "Database wiped clean. Ready for testing.",
      timestamp: new Date().toISOString(),
    })
  } catch (err: any) {
    console.error("Database Reset Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to wipe database." }, { status: 500 })
  }
}
