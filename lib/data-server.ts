import { prisma } from "@/lib/prisma"

export async function getProjects() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { updatedAt: "desc" },
      include: {
        client: true,
        skills: { include: { skill: true } },
        matches: { include: { creator: true } },
      },
    })
    return jobs.map(j => ({
      ...j,
      name: j.title,
      client: j.client?.name || "Client Business",
      stage: j.status,
      progress: j.status === "ASSIGNED" ? 100 : j.status === "MATCHING" ? 65 : 30,
    }))
  } catch (err) {
    return []
  }
}

export async function getProject(id: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id },
      include: {
        client: true,
        skills: { include: { skill: true } },
        matches: {
          include: {
            creator: {
              include: { user: true, skills: { include: { skill: true } } },
            },
          },
        },
      },
    })
    if (!job) return null
    return {
      ...job,
      name: job.title,
      client: job.client?.name || "Client Business",
      stage: job.status,
      progress: job.status === "ASSIGNED" ? 100 : job.status === "MATCHING" ? 65 : 30,
    }
  } catch (err) {
    return null
  }
}
