import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { runMatchmakerForJob } from "@/lib/matchmaker"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, description, projectType, budgetMin, budgetMax, timeline, requiredLevel, skills, clientEmail, clientName } = body

    if (!title || !description) {
      return NextResponse.json({ error: "Job title and description are required." }, { status: 400 })
    }

    const email = clientEmail || "client@jitume.com"
    const name = clientName || "Client Business"

    // 1. Ensure Client User exists
    let clientUser = await prisma.user.findUnique({ where: { email } })
    if (!clientUser) {
      clientUser = await prisma.user.create({
        data: {
          email,
          name,
          role: "CLIENT",
          clientProfile: { create: { companyName: name, industry: projectType || "Technology" } },
        },
      })
    }

    // 2. Create Job
    const job = await prisma.job.create({
      data: {
        clientId: clientUser.id,
        title,
        description,
        projectType: projectType || "E-Commerce",
        budgetMin: budgetMin ? parseFloat(budgetMin) : 5000,
        budgetMax: budgetMax ? parseFloat(budgetMax) : 25000,
        timeline: timeline || "8 Weeks",
        requiredLevel: requiredLevel || "MID",
        status: "ACTIVE",
      },
    })

    // 3. Process Skill Tags
    const skillList: string[] = Array.isArray(skills) && skills.length > 0
      ? skills
      : [projectType || "E-Commerce", "Full-Stack", "UI/UX"]

    for (const skillName of skillList) {
      const trimmed = skillName.trim()
      if (!trimmed) continue

      let skill = await prisma.skill.findUnique({ where: { name: trimmed } })
      if (!skill) {
        skill = await prisma.skill.create({ data: { name: trimmed, category: "Technology" } })
      }

      await prisma.jobSkill.upsert({
        where: { jobId_skillId: { jobId: job.id, skillId: skill.id } },
        create: { jobId: job.id, skillId: skill.id, weight: 85 },
        update: {},
      })
    }

    // 4. Run AI Match Matrix
    const matches = await runMatchmakerForJob(job.id)

    return NextResponse.json({
      success: true,
      job,
      matchesCount: matches.length,
      matches,
    })
  } catch (err: any) {
    console.error("Job Creation Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to create job intake." }, { status: 500 })
  }
}
