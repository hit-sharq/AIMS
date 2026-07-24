export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: { read: true },
    })
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.notification.delete({
      where: { id: params.id },
    })
    return NextResponse.json({ ok: true })
  } catch (err) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }
}
