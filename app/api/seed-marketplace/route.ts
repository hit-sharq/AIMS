import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    // Purge all legacy seed mock data
    await prisma.match.deleteMany({})
    await prisma.jobSkill.deleteMany({})
    await prisma.creatorSkill.deleteMany({})
    await prisma.job.deleteMany({})
    await prisma.creatorProfile.deleteMany({})
    await prisma.clientProfile.deleteMany({})
    await prisma.user.deleteMany({})

    // Seed master technical skill tags only
    const skillNames = [
      "React", "Node.js", "TypeScript", "PostgreSQL", "UI/UX", "Tailwind CSS", "Next.js", "Python", "Docker"
    ]

    for (const name of skillNames) {
      await prisma.skill.upsert({
        where: { name },
        create: { name, category: "Technology" },
        update: {},
      })
    }

    return NextResponse.json({
      success: true,
      message: "Marketplace database reset to blank slate. Master skill tags initialized.",
    })
  } catch (err: any) {
    console.error("Seed Reset Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to reset seed marketplace." }, { status: 500 })
  }
}
