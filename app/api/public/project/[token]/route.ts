export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(_req: Request, { params }: { params: { token: string } }) {
  try {
    const token = params.token

    const job = await prisma.job.findFirst({
      where: {
        OR: [
          { id: token },
        ],
      },
      include: {
        client: true,
        skills: { include: { skill: true } },
        matches: { include: { creator: true } },
      },
    })

    if (!job) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    return NextResponse.json({
      id: job.id,
      name: job.title,
      type: job.projectType,
      stage: job.status,
      status: job.status,
      progress: job.status === "ASSIGNED" ? 100 : job.status === "MATCHING" ? 65 : 30,
      client: job.client?.name || "Valued Client",
      clientName: job.client?.name,
      createdAt: job.createdAt.toISOString(),
      deliverables: job.skills.map((s: any) => s.skill.name),
      messages: [],
    })
  } catch (error) {
    console.error("Failed to fetch public project:", error)
    return NextResponse.json({ error: "Failed to load project" }, { status: 500 })
  }
}
