import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { matchId, action, adminEmail } = body

    if (!matchId || !action) {
      return NextResponse.json({ error: "matchId and action are required." }, { status: 400 })
    }

    const match = await prisma.match.findUnique({
      where: { id: matchId },
      include: { job: true, creator: { include: { user: true } } },
    })

    if (!match) {
      return NextResponse.json({ error: "Match record not found." }, { status: 404 })
    }

    let newStatus: "ADMIN_APPROVED" | "ACCEPTED_BY_CREATOR" | "DECLINED_BY_CREATOR" | "REJECTED_BY_ADMIN" = "ADMIN_APPROVED"

    if (action === "approve_admin") {
      newStatus = "ADMIN_APPROVED"
      await prisma.match.update({
        where: { id: matchId },
        data: {
          status: newStatus,
          approvedAt: new Date(),
        },
      })
      // Send notification to creator
      await prisma.notification.create({
        data: {
          userId: match.creator.userId,
          title: "New Job Match Approved by Committee!",
          message: `The AI Matchmaker matched you for "${match.job.title}" with ${match.confidenceScore}% confidence score.`,
          refId: match.job.id,
        },
      })
    } else if (action === "accept_creator") {
      newStatus = "ACCEPTED_BY_CREATOR"
      await prisma.match.update({
        where: { id: matchId },
        data: {
          status: newStatus,
          respondedAt: new Date(),
        },
      })
      // Update job to ASSIGNED
      await prisma.job.update({
        where: { id: match.jobId },
        data: { status: "ASSIGNED" },
      })
    } else if (action === "decline_creator") {
      newStatus = "DECLINED_BY_CREATOR"
      await prisma.match.update({
        where: { id: matchId },
        data: {
          status: newStatus,
          respondedAt: new Date(),
        },
      })
    } else if (action === "reject_admin") {
      newStatus = "REJECTED_BY_ADMIN"
      await prisma.match.update({
        where: { id: matchId },
        data: { status: newStatus },
      })
    }

    return NextResponse.json({
      success: true,
      matchId,
      status: newStatus,
    })
  } catch (err: any) {
    console.error("Match Response Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to respond to match." }, { status: 500 })
  }
}
