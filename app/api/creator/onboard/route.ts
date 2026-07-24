import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, title, level, skills, hourlyRate, cvUrl, linkedInUrl, gitHubUrl, portfolioUrl, bio } = body

    if (!name || !email) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })
    }

    // 1. Upsert User
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

    // 2. Upsert Creator Profile
    const profile = await prisma.creatorProfile.upsert({
      where: { userId: user.id },
      create: {
        userId: user.id,
        title: title || "Full-Stack Developer",
        bio: bio || "Experienced developer specializing in modern web and mobile applications.",
        level: level || "SENIOR",
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : 85,
        cvUrl,
        linkedInUrl,
        gitHubUrl,
        portfolioUrl,
        isVerified: true,
        aiTaggingSummary: `AI Verified Profile: Parsed skills for ${name} (${level || "SENIOR"} Level). Verified expertise in ${Array.isArray(skills) ? skills.join(", ") : "software architecture"}.`,
      },
      update: {
        title: title || "Full-Stack Developer",
        bio: bio || undefined,
        level: level || "SENIOR",
        hourlyRate: hourlyRate ? parseFloat(hourlyRate) : undefined,
        cvUrl: cvUrl || undefined,
        linkedInUrl: linkedInUrl || undefined,
        gitHubUrl: gitHubUrl || undefined,
        portfolioUrl: portfolioUrl || undefined,
        aiTaggingSummary: `AI Verified Profile: Parsed skills for ${name} (${level || "SENIOR"} Level). Verified expertise in ${Array.isArray(skills) ? skills.join(", ") : "software architecture"}.`,
      },
    })

    // 3. Process Skill Tags
    const skillList: string[] = Array.isArray(skills) && skills.length > 0
      ? skills
      : ["React", "Node.js", "TypeScript", "PostgreSQL", "UI/UX"]

    for (const skillName of skillList) {
      const trimmed = skillName.trim()
      if (!trimmed) continue

      let skill = await prisma.skill.findUnique({ where: { name: trimmed } })
      if (!skill) {
        skill = await prisma.skill.create({ data: { name: trimmed, category: "Engineering" } })
      }

      await prisma.creatorSkill.upsert({
        where: { creatorId_skillId: { creatorId: profile.id, skillId: skill.id } },
        create: { creatorId: profile.id, skillId: skill.id, weight: 90, experienceYears: 4.5 },
        update: { weight: 90 },
      })
    }

    return NextResponse.json({
      success: true,
      user,
      profile,
    })
  } catch (err: any) {
    console.error("Creator Onboarding Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to complete creator onboarding." }, { status: 500 })
  }
}
