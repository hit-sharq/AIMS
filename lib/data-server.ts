import { prisma } from "@/lib/prisma"

export async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        brief: true,
        proposal: true,
        quote: true,
        call: true,
        transcript: true,
        approvals: true,
      },
    })
  } catch (err) {
    try {
      return await prisma.project.findMany({
        orderBy: { updatedAt: "desc" },
      })
    } catch {
      return []
    }
  }
}

export async function getProject(id: string) {
  try {
    return await prisma.project.findUnique({
      where: { id },
      include: {
        brief: true,
        call: true,
        transcript: true,
        projectBrief: true,
        synthesis: true,
        proposal: true,
        quote: true,
        approvals: { orderBy: { createdAt: "desc" } },
      },
    })
  } catch (err) {
    try {
      return await prisma.project.findUnique({
        where: { id },
      })
    } catch {
      return null
    }
  }
}
