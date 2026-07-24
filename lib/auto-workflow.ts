import { prisma } from "@/lib/prisma"

export async function processAutoWorkflow(jobId: string) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: jobId },
      include: {
        skills: true,
        matches: true,
      },
    })
    return { success: true, job }
  } catch (err) {
    return { success: false }
  }
}
