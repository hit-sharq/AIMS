export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const notifications = await prisma.notification.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  })

  const unread = await prisma.notification.count({
    where: { read: false },
  })

  return NextResponse.json({ notifications, unread })
}

export async function POST(req: Request) {
  const body = await req.json()
  const firstUser = await prisma.user.findFirst()
  if (!firstUser) return NextResponse.json({ error: "No user found" }, { status: 400 })

  const notification = await prisma.notification.create({
    data: {
      userId: firstUser.id,
      title: body.title,
      message: body.message,
      refId: body.refId,
    },
  })

  return NextResponse.json(notification, { status: 201 })
}
