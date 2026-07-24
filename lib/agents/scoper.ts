import { GoogleGenerativeAI } from "@google/generative-ai"

export async function runScoperAgent(projectTitle: string, projectDescription: string, budgetMax?: number) {
  const prompt = `You are the Scoper Agent. Analyze the client's raw project idea and budget. Deduce the required tech stack and experience level needed.
Project Title: ${projectTitle}
Project Description: ${projectDescription}
Budget Max: $${budgetMax || 25000}

Return STRICTLY a JSON object matching this schema with NO extra commentary or markdown formatting:
{
  "requiredLevel": "JUNIOR" | "MID" | "SENIOR" | "LEAD",
  "requiredSkills": [
    { "name": "Node.js", "weight": 90 }
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

      if (parsed.requiredLevel && Array.isArray(parsed.requiredSkills)) {
        return parsed
      }
    }
  } catch (err) {
    console.warn("Scoper AI fallback activated:", err)
  }

  // Robust Scoper Fallback
  const isHighBudget = (budgetMax || 0) >= 20000
  const requiredLevel = isHighBudget ? "SENIOR" : "MID"

  const extractedSkills = ["React", "Node.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Next.js"].map((name) => ({
    name,
    weight: 90,
  }))

  return {
    requiredLevel,
    requiredSkills: extractedSkills,
  }
}
