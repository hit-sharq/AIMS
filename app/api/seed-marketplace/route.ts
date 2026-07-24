import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { runMatchmakerForJob } from "@/lib/matchmaker"

export async function GET() {
  try {
    // 0. Purge all existing data for clean single happy path
    await prisma.match.deleteMany({})
    await prisma.jobSkill.deleteMany({})
    await prisma.creatorSkill.deleteMany({})
    await prisma.job.deleteMany({})
    await prisma.creatorProfile.deleteMany({})
    await prisma.clientProfile.deleteMany({})
    await prisma.user.deleteMany({})

    // 1. Seed Core Master Skills
    const skillNames = [
      "React", "Node.js", "TypeScript", "PostgreSQL", "UI/UX", "Tailwind CSS", "Next.js"
    ]

    for (const name of skillNames) {
      await prisma.skill.upsert({
        where: { name },
        create: { name, category: "Technology" },
        update: {},
      })
    }

    // 2. Seed Single Happy Path Creator: Sharlmon Musundi
    const creatorUser = await prisma.user.create({
      data: {
        email: "sharlmon19@gmail.com",
        name: "Sharlmon Musundi",
        role: "CREATOR",
        creatorProfile: {
          create: {
            title: "Senior Full-Stack Engineer & AI Architect",
            bio: "Specializing in Next.js, Node.js, Prisma, and Autonomous AI systems. 7+ years building enterprise web applications.",
            level: "SENIOR",
            hourlyRate: 95,
            cvUrl: "https://github.com/sharlmon",
            gitHubUrl: "https://github.com/sharlmon",
            linkedInUrl: "https://linkedin.com/in/sharlmon",
            portfolioUrl: "https://sharl-tech.co.ke",
            isVerified: true,
            aiTaggingSummary: "AI Verified Profile for Sharlmon Musundi (SENIOR Level). Top skills: React, Node.js, TypeScript, PostgreSQL, Next.js, Tailwind CSS.",
          },
        },
      },
      include: { creatorProfile: true },
    })

    const creatorProfile = creatorUser.creatorProfile!

    for (const sName of skillNames) {
      const skill = await prisma.skill.findUnique({ where: { name: sName } })
      if (skill) {
        await prisma.creatorSkill.create({
          data: { creatorId: creatorProfile.id, skillId: skill.id, weight: 95, experienceYears: 7 },
        })
      }
    }

    // 3. Seed Single Happy Path Job: Enterprise E-Commerce Platform
    const clientUser = await prisma.user.create({
      data: {
        email: "acme.corp@client.com",
        name: "Acme Global Technologies",
        role: "CLIENT",
        clientProfile: { create: { companyName: "Acme Global Technologies", industry: "E-Commerce" } },
      },
    })

    const job = await prisma.job.create({
      data: {
        clientId: clientUser.id,
        title: "Enterprise E-Commerce Platform & Design System",
        description: "Looking for a senior full-stack creator to build a modern Next.js 14 e-commerce platform with automated payment workflows and a custom glassmorphism design system.",
        projectType: "E-Commerce",
        budgetMin: 15000,
        budgetMax: 35000,
        budgetCurrency: "USD",
        timeline: "8 Weeks",
        requiredLevel: "SENIOR",
        status: "ACTIVE",
      },
    })

    for (const rSkill of skillNames) {
      const skill = await prisma.skill.findUnique({ where: { name: rSkill } })
      if (skill) {
        await prisma.jobSkill.create({
          data: { jobId: job.id, skillId: skill.id, weight: 90, isRequired: true },
        })
      }
    }

    // 4. Trigger AI Matchmaker for single job -> results in TOP MATCH
    const matches = await runMatchmakerForJob(job.id)

    return NextResponse.json({
      success: true,
      message: "Marketplace database successfully seeded with single Happy Path creator and job!",
      jobId: job.id,
      matchesCount: matches.length,
      matches,
    })
  } catch (err: any) {
    console.error("Seed Marketplace Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to seed marketplace." }, { status: 500 })
  }
}
