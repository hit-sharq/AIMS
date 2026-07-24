import { prisma } from "../lib/prisma"

async function wipe() {
  await prisma.match.deleteMany({})
  await prisma.jobSkill.deleteMany({})
  await prisma.creatorSkill.deleteMany({})
  await prisma.job.deleteMany({})
  await prisma.creatorProfile.deleteMany({})
  await prisma.clientProfile.deleteMany({})
  await prisma.user.deleteMany({})
  console.log("Wiped all marketplace data.")
}

wipe()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
