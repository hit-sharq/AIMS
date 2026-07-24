export const dynamic = 'force-dynamic'

import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request, { params }: { params: { token: string } }) {
  try {
    const body = await req.json().catch(() => ({}))
    const { senderName, senderEmail, subject, body: msgBody } = body || {}

    const job = await prisma.job.findUnique({
      where: { id: params.token },
    })

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 })
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderName: senderName || "Client",
      senderRole: "CLIENT",
      subject: subject || `Re: ${job.title}`,
      body: msgBody || "",
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(newMessage, { status: 201 })
  } catch (error) {
    console.error("Failed to send message:", error)
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
