import { NextResponse } from "next/server"
import { runMatchmakerForJob } from "@/lib/matchmaker"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { jobId } = body

    if (!jobId) {
      return NextResponse.json({ error: "Missing required parameter: jobId" }, { status: 400 })
    }

    const matches = await runMatchmakerForJob(jobId)

    return NextResponse.json({
      success: true,
      message: "Match Matrix Engine successfully generated ranked candidate matches!",
      jobId,
      matchesCount: matches.length,
      matches,
    })
  } catch (err: any) {
    console.error("Match Matrix Engine Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to generate matches." }, { status: 500 })
  }
}
