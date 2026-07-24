import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { dispatchMatchApprovedEmails } from "@/lib/email-dispatcher"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { matchId, action } = body

    if (!matchId) {
      return NextResponse.json({ error: "Missing required parameter: matchId" }, { status: 400 })
    }

    const isApproval = action === "approve_admin" || action === "APPROVE" || action === "ACCEPT"
    const newStatus = isApproval ? "ADMIN_APPROVED" : "REJECTED"

    // 1. Update Match Status in Prisma
    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status: newStatus as any,
        approvedAt: isApproval ? new Date() : null,
      },
      include: {
        job: {
          include: {
            client: true,
          },
        },
        creator: {
          include: {
            user: true,
          },
        },
      },
    })

    let emailDispatchResults = { creatorEmailSent: false, clientEmailSent: false }

    // 2. Trigger Resend Email Dispatcher if Match is Approved
    if (isApproval && updatedMatch.creator?.user?.email && updatedMatch.job?.client?.email) {
      emailDispatchResults = await dispatchMatchApprovedEmails({
        creatorEmail: updatedMatch.creator.user.email,
        creatorName: updatedMatch.creator.user.name,
        clientEmail: updatedMatch.job.client.email,
        clientName: updatedMatch.job.client.name,
        jobTitle: updatedMatch.job.title,
        confidenceScore: updatedMatch.confidenceScore,
        jobId: updatedMatch.job.id,
        matchId: updatedMatch.id,
      })
    }

    return NextResponse.json({
      success: true,
      message: `Match status successfully updated to ${newStatus}. Emails dispatched via Resend.`,
      matchId: updatedMatch.id,
      status: updatedMatch.status,
      emailDispatchResults,
    })
  } catch (err: any) {
    console.error("Match Response Error:", err)
    return NextResponse.json({ error: err?.message || "Failed to respond to match." }, { status: 500 })
  }
}
