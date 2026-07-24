import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { runMatchmakerForJob } from "@/lib/matchmaker"

export async function GET() {
  try {
    // 1. Seed Core Master Skills
    const skillNames = [
      "React", "Node.js", "TypeScript", "PostgreSQL", "UI/UX", "Tailwind CSS",
      "Next.js", "Python", "GraphQL", "Docker", "Figma", "AWS"
    ]

    for (const name of skillNames) {
      await prisma.skill.upsert({
        where: { name },
        create: { name, category: "Technology" },
        update: {},
      })
    }

    // 2. Seed Test Creators
    const creatorsData = [
      {
        name: "Sharlmon Musundi",
        email: "sharlmon19@gmail.com",
        title: "Senior Full-Stack Engineer & AI Architect",
        bio: "Specializing in Next.js, Node.js, Prisma, and Autonomous AI systems. 7+ years building enterprise applications.",
        level: "SENIOR" as const,
        hourlyRate: 95,
        cvUrl: "https://github.com/sharlmon",
        gitHubUrl: "https://github.com/sharlmon",
        linkedInUrl: "https://linkedin.com/in/sharlmon",
        portfolioUrl: "https://sharl-tech.co.ke",
        skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js", "Tailwind CSS"],
      },
      {
        name: "Sarah Connor",
        email: "sarah.connor@cyber.dev",
        title: "Lead UI/UX & Product Design Specialist",
        bio: "Crafting modern iOS 17 glassmorphism interfaces, design systems, and mobile user experiences.",
        level: "LEAD" as const,
        hourlyRate: 110,
        cvUrl: "https://github.com/sarah-design",
        portfolioUrl: "https://sarahdesign.io",
        skills: ["UI/UX", "Figma", "Tailwind CSS", "React"],
      },
      {
        name: "Alex Rivera",
        email: "alex.rivera@ai-labs.org",
        title: "Mid-Level Backend & Cloud Engineer",
        bio: "Building robust GraphQL APIs, PostgreSQL databases, and Docker microservices.",
        level: "MID" as const,
        hourlyRate: 75,
        gitHubUrl: "https://github.com/alex-rivera",
        skills: ["Node.js", "PostgreSQL", "Python", "Docker", "GraphQL", "AWS"],
      },
    ]

    for (const cData of creatorsData) {
      const user = await prisma.user.upsert({
        where: { email: cData.email },
        create: { email: cData.email, name: cData.name, role: "CREATOR" },
        update: { name: cData.name, role: "CREATOR" },
      })

      const profile = await prisma.creatorProfile.upsert({
        where: { userId: user.id },
        create: {
          userId: user.id,
          title: cData.title,
          bio: cData.bio,
          level: cData.level,
          hourlyRate: cData.hourlyRate,
          cvUrl: cData.cvUrl,
          gitHubUrl: cData.gitHubUrl,
          linkedInUrl: cData.linkedInUrl,
          portfolioUrl: cData.portfolioUrl,
          isVerified: true,
          aiTaggingSummary: `AI Verified Profile for ${cData.name} (${cData.level} Level). Top skills: ${cData.skills.join(", ")}.`,
        },
        update: {
          title: cData.title,
          bio: cData.bio,
          level: cData.level,
          hourlyRate: cData.hourlyRate,
          isVerified: true,
          aiTaggingSummary: `AI Verified Profile for ${cData.name} (${cData.level} Level). Top skills: ${cData.skills.join(", ")}.`,
        },
      })

      for (const sName of cData.skills) {
        const skill = await prisma.skill.findUnique({ where: { name: sName } })
        if (skill) {
          await prisma.creatorSkill.upsert({
            where: { creatorId_skillId: { creatorId: profile.id, skillId: skill.id } },
            create: { creatorId: profile.id, skillId: skill.id, weight: 90, experienceYears: 5 },
            update: { weight: 90 },
          })
        }
      }
    }

    // 3. Seed Test Job
    const clientUser = await prisma.user.upsert({
      where: { email: "acme.corp@client.com" },
      create: {
        email: "acme.corp@client.com",
        name: "Acme Global Technologies",
        role: "CLIENT",
        clientProfile: { create: { companyName: "Acme Global Technologies", industry: "E-Commerce" } },
      },
      update: {},
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

    const requiredSkills = ["React", "Node.js", "TypeScript", "PostgreSQL", "UI/UX", "Tailwind CSS"]
    for (const rSkill of requiredSkills) {
      const skill = await prisma.skill.findUnique({ where: { name: rSkill } })
      if (skill) {
        await prisma.jobSkill.create({
          data: { jobId: job.id, skillId: skill.id, weight: 90, isRequired: true },
        })
      }
    }

    // 4. Trigger AI Matchmaker for seed job
    const matches = await runMatchmakerForJob(job.id)

    return NextResponse.json({
      success: true,
      message: "Marketplace database successfully seeded with test creators, skills, job, and AI match matrix!",
      jobId: job.id,
      matchesCount: matches.length,
      matches,
    })
  } catch (err: any) {
    console.error("Seed Marketplace Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to seed marketplace." }, { status: 500 })
  }
}
