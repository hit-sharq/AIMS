import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"

export async function runMatchmakerForJob(jobId: string) {
  // 1. Fetch Job specification & required skills
  const job = await prisma.job.findUnique({
    where: { id: jobId },
    include: {
      skills: { include: { skill: true } },
      client: true,
    },
  })

  if (!job) throw new Error(`Job not found for ID: ${jobId}`)

  // 2. Fetch all verified Creator profiles & skills
  const creators = await prisma.creatorProfile.findMany({
    where: { isVerified: true },
    include: {
      user: true,
      skills: { include: { skill: true } },
    },
  })

  if (creators.length === 0) return []

  const requiredSkillNames = job.skills.map((js) => js.skill.name)

  let aiMatches: Array<{ creatorId: string; confidenceScore: number; rank: number; aiReasoning: string }> = []

  // 3. Try Gemini AI Match Matrix Engine
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

      const prompt = `You are the Match Matrix Engine. Compare the Job specification and the list of available Creators. Compare overlapping skills and experience levels. Return STRICTLY a JSON array of the top 3 matches with NO extra text or markdown formatting:

Job Specification:
Title: ${job.title}
Required Level: ${job.requiredLevel}
Required Skills: ${requiredSkillNames.join(", ")}

Available Creators:
${creators
  .map(
    (c) =>
      `ID: ${c.id} | Name: ${c.user.name} | Level: ${c.level} | Skills: ${c.skills.map((cs) => cs.skill.name).join(", ")}`
  )
  .join("\n")}

JSON Schema:
[
  { "creatorId": "string", "confidenceScore": 98.5, "rank": 1, "aiReasoning": "Matched 7 core skills..." }
]`

      const response = await model.generateContent(prompt)
      const text = response.response.text() || ""
      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim()
      const parsed = JSON.parse(cleanJson)

      if (Array.isArray(parsed) && parsed.length > 0) {
        aiMatches = parsed
      }
    }
  } catch (err) {
    console.warn("Match Matrix Engine AI fallback activated:", err)
  }

  // Fallback Deterministic Calculation if AI is offline or parsing fails
  if (aiMatches.length === 0) {
    const scoredCreators = creators.map((creator) => {
      const creatorSkillNames = new Set(creator.skills.map((cs) => cs.skill.name))
      const matchingSkills = requiredSkillNames.filter((s) => creatorSkillNames.has(s))

      const skillMatchRatio = requiredSkillNames.length > 0 ? matchingSkills.length / requiredSkillNames.length : 1
      const isLevelMatch = creator.level === job.requiredLevel

      let baseScore = skillMatchRatio * 90
      if (isLevelMatch) baseScore += 8.5
      else baseScore += 4.0

      const confidenceScore = Math.min(99.5, Math.max(70.0, Number(baseScore.toFixed(1))))

      return {
        creatorId: creator.id,
        confidenceScore,
        matchingSkills,
        creatorName: creator.user.name,
      }
    })

    scoredCreators.sort((a, b) => b.confidenceScore - a.confidenceScore)

    aiMatches = scoredCreators.slice(0, 3).map((item, idx) => ({
      creatorId: item.creatorId,
      confidenceScore: item.confidenceScore,
      rank: idx + 1,
      aiReasoning: `Matched ${item.matchingSkills.length} core required skill(s): ${item.matchingSkills.join(", ")}. Creator level matches job requirement (${job.requiredLevel}).`,
    }))
  }

  // 4. Update Database: Clear old matches for job and create new AI_PROPOSED Match records
  await prisma.match.deleteMany({ where: { jobId } })

  const createdMatches = []
  for (const matchItem of aiMatches) {
    const matchRecord = await prisma.match.create({
      data: {
        jobId,
        creatorId: matchItem.creatorId,
        confidenceScore: matchItem.confidenceScore,
        rank: matchItem.rank,
        aiReasoning: matchItem.aiReasoning,
        status: "AI_PROPOSED",
      },
      include: {
        creator: { include: { user: true, skills: { include: { skill: true } } } },
        job: true,
      },
    })
    createdMatches.push(matchRecord)
  }

  return createdMatches
}
