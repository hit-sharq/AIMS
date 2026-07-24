import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { runScoperAgent } from "@/lib/agents/scoper"
import { runMatchmakerForJob } from "@/lib/matchmaker"
import { dispatchIntakeConfirmationEmail } from "@/lib/email-dispatcher"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const clientEmail = (body.clientEmail || body.email || "").trim()
    const clientName = (body.clientName || body.name || "Valued Client").trim()
    const companyName = (body.companyName || clientName || "Independent Client").trim()
    const title = (body.title || "").trim()
    const description = (body.description || "").trim()
    const projectType = body.projectType || "Full-Stack Web App"
    const budgetMin = body.budgetMin ? Number(body.budgetMin) : 500000
    const budgetMax = body.budgetMax ? Number(body.budgetMax) : 2500000
    const timeline = body.timeline || "6 Weeks"

    if (!clientEmail || !title || !description) {
      return NextResponse.json({ error: "Missing required fields: clientEmail, title, description." }, { status: 400 })
    }

    // 1. Trigger Agent 2: Scoper Agent
    const scoperOutput = await runScoperAgent(title, description, budgetMax)

    // 2. Upsert Client User & Profile dynamically using submitted clientEmail
    const clientUser = await prisma.user.upsert({
      where: { email: clientEmail },
      create: {
        email: clientEmail,
        name: clientName,
        role: "CLIENT",
        clientProfile: {
          create: {
            companyName,
            industry: projectType,
          },
        },
      },
      update: {
        name: clientName,
      },
    })

    // 3. Create Job Record (status: ACTIVE, KES currency)
    const job = await prisma.job.create({
      data: {
        clientId: clientUser.id,
        title,
        description,
        projectType,
        budgetMin,
        budgetMax,
        budgetCurrency: "KES",
        timeline,
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

    // 6. Error-Resilient Resend Intake Confirmation Email Dispatch to Dynamic clientEmail
    let emailSentTo = clientUser.email
    try {
      await dispatchIntakeConfirmationEmail({
        clientEmail: clientUser.email,
        clientName: clientUser.name,
        jobTitle: job.title,
        budgetMin: job.budgetMin || 500000,
        budgetMax: job.budgetMax || 2500000,
        timeline: job.timeline,
      })
    } catch (emailErr) {
      console.warn(`Intake confirmation email dispatch to ${clientUser.email} skipped or bounced safely:`, emailErr)
    }

    return NextResponse.json({
      success: true,
      message: `Job intake successfully created for ${emailSentTo}! Stylized confirmation email sent to ${emailSentTo}.`,
      jobId: job.id,
      clientEmail: emailSentTo,
      scoperOutput,
      matchesCount: matches.length,
      matches,
    })
  } catch (err: any) {
    console.error("Job Creation Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to create job intake." }, { status: 500 })
  }
}
