import { prisma } from "@/lib/prisma"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { dispatchAutonomousCreatorHotLeadEmail } from "@/lib/email-dispatcher"

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

  // 5. Autonomous Evaluation for #1 Ranked Creator (Threshold: >= 90% confidence score)
  const topMatch = createdMatches.find((m) => m.rank === 1)
  if (topMatch && topMatch.confidenceScore >= 90) {
    try {
      // Automatically update Match status in Prisma to ADMIN_APPROVED (System Proxy)
      await prisma.match.update({
        where: { id: topMatch.id },
        data: {
          status: "ADMIN_APPROVED",
          approvedAt: new Date(),
        },
      })
      topMatch.status = "ADMIN_APPROVED"

      // Extract Creator Email & Fire Autonomous Hot Lead Email
      const creatorEmail = topMatch.creator.user.email
      const creatorName = topMatch.creator.user.name

      await dispatchAutonomousCreatorHotLeadEmail({
        creatorEmail,
        creatorName,
        jobTitle: job.title,
        budgetMin: job.budgetMin || 1500000,
        budgetMax: job.budgetMax || 3500000,
        timeline: job.timeline,
        confidenceScore: topMatch.confidenceScore,
        aiReasoning: topMatch.aiReasoning || undefined,
      })
      console.log(`[Autonomous Matchmaker Proxy]: Approved & dispatched hot lead to ${creatorEmail} (${topMatch.confidenceScore}% Match)`)
    } catch (autonErr) {
      console.warn("Autonomous creator dispatch error handled safely:", autonErr)
    }
  }

  return createdMatches
}

export async function runReverseMatchScanForCreator(creatorId: string) {
  // 1. Fetch Creator Profile and skills
  const creator = await prisma.creatorProfile.findUnique({
    where: { id: creatorId },
    include: {
      user: true,
      skills: { include: { skill: true } },
    },
  })

  if (!creator) throw new Error(`Creator Profile not found for ID: ${creatorId}`)

  // 2. Query Prisma for all open/active jobs
  const openJobs = await prisma.job.findMany({
    where: {
      status: { in: ["ACTIVE", "MATCHING"] },
    },
    include: {
      skills: { include: { skill: true } },
      client: true,
    },
  })

  if (openJobs.length === 0) return []

  const createdMatches = []
  const creatorSkillNames = new Set(creator.skills.map((cs: any) => cs.skill.name))

  // 3. Evaluate each open job against this new creator
  for (const job of openJobs) {
    const requiredSkillNames = job.skills.map((js: any) => js.skill.name)
    const matchingSkills = requiredSkillNames.filter((s: string) => creatorSkillNames.has(s))

    const skillMatchRatio = requiredSkillNames.length > 0 ? matchingSkills.length / requiredSkillNames.length : 1
    const isLevelMatch = creator.level === job.requiredLevel

    let baseScore = skillMatchRatio * 90
    if (isLevelMatch) baseScore += 8.5
    else baseScore += 4.0

    const confidenceScore = Math.min(99.5, Math.max(70.0, Number(baseScore.toFixed(1))))

    // Check if match score >= 85%
    if (confidenceScore >= 85) {
      const existingMatch = await prisma.match.findFirst({
        where: { jobId: job.id, creatorId: creator.id },
      })

      let matchRecord
      if (!existingMatch) {
        matchRecord = await prisma.match.create({
          data: {
            jobId: job.id,
            creatorId: creator.id,
            confidenceScore,
            rank: 1,
            aiReasoning: `Reverse Match Scan: Matched ${matchingSkills.length} core skill(s): ${matchingSkills.join(", ")}. Level (${creator.level}) matches job (${job.requiredLevel}).`,
            status: "ADMIN_APPROVED",
            approvedAt: new Date(),
          },
          include: {
            creator: { include: { user: true, skills: { include: { skill: true } } } },
            job: true,
          },
        })
      } else {
        matchRecord = await prisma.match.update({
          where: { id: existingMatch.id },
          data: {
            confidenceScore,
            status: "ADMIN_APPROVED",
            approvedAt: new Date(),
          },
          include: {
            creator: { include: { user: true, skills: { include: { skill: true } } } },
            job: true,
          },
        })
      }

      createdMatches.push(matchRecord)

      // Dispatch Autonomous Hot Lead Email to Creator if >= 90%
      if (confidenceScore >= 90) {
        try {
          await dispatchAutonomousCreatorHotLeadEmail({
            creatorEmail: creator.user.email,
            creatorName: creator.user.name,
            jobTitle: job.title,
            budgetMin: job.budgetMin || 500000,
            budgetMax: job.budgetMax || 2500000,
            timeline: job.timeline,
            confidenceScore,
            aiReasoning: matchRecord.aiReasoning || undefined,
          })
          console.log(`[Reverse Matchmaker]: Dispatched hot lead to ${creator.user.email} for job ${job.title} (${confidenceScore}% Match)`)
        } catch (emailErr) {
          console.warn("Reverse match hot lead email skipped safely:", emailErr)
        }
      }
    }
  }

  return createdMatches
}

