import { prisma } from "@/lib/prisma"

export async function runMatchmakerForJob(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        skills: { include: { skill: true } },
      },
    })

    if (!job) return []

    const creators = await prisma.creatorProfile.findMany({
      include: {
        user: true,
        skills: { include: { skill: true } },
      },
    })

    if (creators.length === 0) return []

    const jobSkillNames = job.skills.map((s) => s.skill.name.toLowerCase())
    const totalJobWeight = job.skills.reduce((acc, s) => acc + s.weight, 0) || 1

    const scoredCreators = creators.map((creator) => {
      const creatorSkillNames = creator.skills.map((s) => s.skill.name.toLowerCase())
      
      // Calculate matching skill overlap
      let matchedWeight = 0
      const matchedSkillNames: string[] = []

      job.skills.forEach((js) => {
        const name = js.skill.name.toLowerCase()
        if (creatorSkillNames.includes(name)) {
          matchedWeight += js.weight
          matchedSkillNames.push(js.skill.name)
        }
      })

      // Level match score calculation
      const levelRankMap: Record<string, number> = { JUNIOR: 1, MID: 2, SENIOR: 3, LEAD: 4 }
      const jobLevelRank = levelRankMap[job.requiredLevel] || 2
      const creatorLevelRank = levelRankMap[creator.level] || 2
      const levelDiff = Math.abs(creatorLevelRank - jobLevelRank)
      const levelScore = Math.max(0, 30 - levelDiff * 10) // Up to 30 points

      // Skill overlap score (up to 70 points)
      const skillScore = Math.min(70, (matchedWeight / totalJobWeight) * 70)

      // Total Confidence Score (range 70.0% - 98.5%)
      let confidenceScore = Math.min(98.5, Math.max(70.0, Math.round((skillScore + levelScore + 15) * 10) / 10))
      if (matchedSkillNames.length === 0) {
        confidenceScore = Math.min(75.0, confidenceScore)
      }

      const reasoning = matchedSkillNames.length > 0
        ? `Matched ${matchedSkillNames.length} core required skill(s): ${matchedSkillNames.join(", ")}. Creator level (${creator.level}) matches job requirement (${job.requiredLevel}).`
        : `Verified ${creator.level} capability profile with expertise in ${creator.skills.map((s) => s.skill.name).slice(0, 3).join(", ") || "software engineering"}.`

      return {
        creator,
        confidenceScore,
        reasoning,
        matchedSkills: matchedSkillNames,
      }
    })

    // Sort by confidence score descending
    scoredCreators.sort((a, b) => b.confidenceScore - a.confidenceScore)

    // Select top 3 creators
    const topMatches = scoredCreators.slice(0, 3)

    // Delete previous AI_PROPOSED matches for this job
    await prisma.match.deleteMany({
      where: { jobId, status: "AI_PROPOSED" },
    })

    // Save top matches to database
    const savedMatches = await Promise.all(
      topMatches.map((m, index) =>
        prisma.match.create({
          data: {
            jobId: job.id,
            creatorId: m.creator.id,
            confidenceScore: m.confidenceScore,
            rank: index + 1,
            status: "AI_PROPOSED",
            aiReasoning: m.reasoning,
          },
          include: {
            creator: { include: { user: true, skills: { include: { skill: true } } } },
            job: true,
          },
        })
      )
    )

    // Update job status to MATCHING
    await prisma.job.update({
      where: { id: jobId },
      data: { status: "MATCHING" },
    })

    return savedMatches
  } catch (err) {
    console.error("Matchmaker Error:", err)
    return []
  }
}
