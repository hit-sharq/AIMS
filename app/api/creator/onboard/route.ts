import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { runTalentProfilerAgent } from "@/lib/agents/talent-profiler"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, title, bio, skills, hourlyRate, cvUrl, gitHubUrl, linkedInUrl, portfolioUrl } = body

    if (!name || !email || !title) {
      return NextResponse.json({ error: "Missing required fields: name, email, title." }, { status: 400 })
    }

    const rawSkillArray = typeof skills === "string" ? skills.split(",").map((s) => s.trim()).filter(Boolean) : Array.isArray(skills) ? skills : []

    // 1. Trigger Agent 1: Talent Profiler Agent
    const aiProfiling = await runTalentProfilerAgent(bio || "", rawSkillArray, title)

    // 2. Upsert User in Prisma
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        name,
        role: "CREATOR",
      },
      update: {
        name,
        role: "CREATOR",
      },
    })

    // 3. Upsert Creator Profile
    const profile = await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        title,
        bio: bio || null,
        level: aiProfiling.level as any,
        hourlyRate: hourlyRate ? Number(hourlyRate) : 95,
        cvUrl: cvUrl || null,
        gitHubUrl: gitHubUrl || null,
        linkedInUrl: linkedInUrl || null,
        portfolioUrl: portfolioUrl || null,
        isVerified: true,
        aiTaggingSummary: `Talent Profiler AI analyzed level: ${aiProfiling.level}. Extracted skills: ${aiProfiling.skills.map((s: any) => `${s.name} (${s.weight}%)`).join(", ")}.`,
      },
      update: {
        title,
        bio: bio || null,
        level: aiProfiling.level as any,
        hourlyRate: hourlyRate ? Number(hourlyRate) : 95,
        cvUrl: cvUrl || null,
        gitHubUrl: gitHubUrl || null,
        linkedInUrl: linkedInUrl || null,
        portfolioUrl: portfolioUrl || null,
        isVerified: true,
        aiTaggingSummary: `Talent Profiler AI updated level: ${aiProfiling.level}. Extracted skills: ${aiProfiling.skills.map((s: any) => `${s.name} (${s.weight}%)`).join(", ")}.`,
      },
    })

    // 4. Map CreatorSkills with AI-assigned weights
    for (const item of aiProfiling.skills) {
      const skillName = item.name
      const weight = item.weight || 85

      const skill = await prisma.skill.upsert({
        where: { name: skillName },
        create: { name: skillName, category: "Technology" },
        update: {},
      })

      await prisma.creatorSkill.upsert({
        where: { creatorId_skillId: { creatorId: profile.id, skillId: skill.id } },
        create: {
          creatorId: profile.id,
          skillId: skill.id,
          weight,
          experienceYears: aiProfiling.level === "LEAD" ? 8 : aiProfiling.level === "SENIOR" ? 5 : 3,
        },
        update: {
          weight,
        },
      })
    }

    return NextResponse.json({
      success: true,
      message: "Creator profile successfully onboarded via Talent Profiler Agent!",
      profileId: profile.id,
      aiProfiling,
    })
  } catch (err: any) {
    console.error("Creator Onboarding Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to onboard creator." }, { status: 500 })
  }
}
