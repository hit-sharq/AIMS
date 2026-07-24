export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        client: true,
        skills: { include: { skill: true } },
        matches: { include: { creator: true } },
      },
    })
    const formatted = jobs.map((j) => ({
      ...j,
      name: j.title,
      client: j.client?.name || "Client Business",
      stage: j.status,
      progress: j.status === "ASSIGNED" ? 100 : j.status === "MATCHING" ? 65 : 30,
    }))
    return NextResponse.json({ projects: formatted })
  } catch (error) {
    console.error("Failed to fetch projects:", error)
    return NextResponse.json({ error: "Failed to load projects", projects: [] }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const firstClient = await prisma.user.findFirst({ where: { role: "CLIENT" } })
    
    let clientId = firstClient?.id
    if (!clientId) {
      const newClient = await prisma.user.create({
        data: {
          name: body.client || "Valued Client",
          email: body.email || `client_${Date.now()}@marketplace.com`,
          role: "CLIENT",
        },
      })
      clientId = newClient.id
    }

    const job = await prisma.job.create({
      data: {
        clientId,
        title: body.name || "Software Project Intake",
        description: body.objective || body.description || "Client project intake requirements.",
        projectType: body.type || "Full-Stack Web App",
        budgetMin: 500000,
        budgetMax: 2500000,
        budgetCurrency: "KES",
        timeline: body.timeline || "6 Weeks",
        requiredLevel: "MID",
        status: "ACTIVE",
      },
    })

    return NextResponse.json(job, { status: 201 })
  } catch (error) {
    console.error("Failed to create project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }
}
