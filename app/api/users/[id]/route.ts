export const dynamic = 'force-dynamic'
import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json()
    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        role: body.role,
      },
    })
    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: "Failed to update user" }, { status: 400 })
  }
}
