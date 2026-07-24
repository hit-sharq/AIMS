import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, company } = body || {}

    if (!name?.trim() || !email?.trim()) {
      return NextResponse.json({ error: "Name and email are required." }, { status: 400 })
    }

    const existing = await prisma.user.findFirst({
      where: { email: email.trim().toLowerCase() },
    })

    if (existing) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 })
    }

    const user = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        name: name.trim(),
        role: "CLIENT",
        clientProfile: {
          create: {
            companyName: company || name,
            industry: "Technology",
          },
        },
      },
    })

    return NextResponse.json({ id: user.id, email: user.email, name: user.name, role: user.role }, { status: 201 })
  } catch (error) {
    console.error("Failed to create client:", error)
    return NextResponse.json({ error: "Failed to create client account" }, { status: 500 })
  }
}
