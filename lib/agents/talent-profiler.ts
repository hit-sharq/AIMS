import { GoogleGenerativeAI } from "@google/generative-ai"

export async function runTalentProfilerAgent(bio: string, rawSkills: string[], title: string) {
  const prompt = `You are the Talent Profiler Agent. Analyze the provided developer bio, title, and raw skills. Extract a normalized list of technical skills and evaluate experience level.
Title: ${title}
Bio: ${bio}
Raw Skills: ${rawSkills.join(", ")}

Return STRICTLY a JSON object matching this schema with NO extra commentary or markdown formatting:
{
  "level": "JUNIOR" | "MID" | "SENIOR" | "LEAD",
  "skills": [
    { "name": "React", "weight": 90 }
  ]
}`

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (apiKey) {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const response = await model.generateContent(prompt)
      const text = response.response.text() || ""

      const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim()
      const parsed = JSON.parse(cleanJson)

      if (parsed.level && Array.isArray(parsed.skills)) {
        return parsed
      }
    }
  } catch (err) {
    console.warn("Talent Profiler AI fallback activated:", err)
  }

  // Robust Heuristic Fallback
  const detectedLevel = title.toLowerCase().includes("lead") || title.toLowerCase().includes("architect")
    ? "LEAD"
    : title.toLowerCase().includes("senior") || title.toLowerCase().includes("sr")
    ? "SENIOR"
    : title.toLowerCase().includes("mid")
    ? "MID"
    : "SENIOR"

  const normalizedSkills = (rawSkills.length > 0 ? rawSkills : ["React", "Node.js", "TypeScript", "PostgreSQL", "Next.js"]).map((name) => ({
    name: name.trim(),
    weight: 90,
  }))

  return {
    level: detectedLevel,
    skills: normalizedSkills,
  }
}
