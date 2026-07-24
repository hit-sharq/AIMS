import { prisma } from "@/lib/prisma"

export async function runAutoWorkflow(jobId?: string, params?: any) {
  try {
    if (jobId) {
      const job = await prisma.job.findUnique({
        where: { id: jobId },
        include: {
          skills: true,
          matches: true,
        },
      })
      return { success: true, job }
    }
    return { success: true }
  } catch (err) {
    return { success: false }
  }
}

export const processAutoWorkflow = runAutoWorkflow
