import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { runScoperAgent } from "@/lib/agents/scoper"
import { runMatchmakerForJob } from "@/lib/matchmaker"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { clientName, clientEmail, companyName, title, description, projectType, budgetMin, budgetMax, timeline } = body

    if (!clientEmail || !title || !description) {
      return NextResponse.json({ error: "Missing required fields: clientEmail, title, description." }, { status: 400 })
    }

    // 1. Trigger Agent 2: Scoper Agent
    const scoperOutput = await runScoperAgent(title, description, budgetMax ? Number(budgetMax) : undefined)

    // 2. Upsert Client User & Profile
    const clientUser = await prisma.user.upsert({
      where: { email: clientEmail },
      create: {
        email: clientEmail,
        name: clientName || "Valued Client",
        role: "CLIENT",
        clientProfile: {
          create: {
            companyName: companyName || clientName || "Independent Client",
            industry: projectType || "Technology",
          },
        },
      },
      update: {
        name: clientName || undefined,
      },
    })

    // 3. Create Job Record (status: ACTIVE)
    const job = await prisma.job.create({
      data: {
        clientId: clientUser.id,
        title,
        description,
        projectType: projectType || "Full-Stack Web App",
        budgetMin: budgetMin ? Number(budgetMin) : 10000,
        budgetMax: budgetMax ? Number(budgetMax) : 30000,
        budgetCurrency: "USD",
        timeline: timeline || "6 Weeks",
        requiredLevel: scoperOutput.requiredLevel as any,
        status: "ACTIVE",
      },
    })

    // 4. Create JobSkills in Prisma
    for (const rSkill of scoperOutput.requiredSkills) {
      const skill = await prisma.skill.upsert({
        where: { name: rSkill.name },
        create: { name: rSkill.name, category: "Technology" },
        update: {},
      })

      await prisma.jobSkill.create({
        data: {
          jobId: job.id,
          skillId: skill.id,
          weight: rSkill.weight || 90,
          isRequired: true,
        },
      })
    }

    // 5. Trigger Agent 3: Match Matrix Engine automatically
    const matches = await runMatchmakerForJob(job.id)

    return NextResponse.json({
      success: true,
      message: "Job intake successfully scoped and active! Match Matrix Engine triggered.",
      jobId: job.id,
      scoperOutput,
      matchesCount: matches.length,
      matches,
    })
  } catch (err: any) {
    console.error("Job Creation Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to create job intake." }, { status: 500 })
  }
}
