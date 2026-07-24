import { prisma } from "../lib/prisma"
import { runMatchmakerForJob } from "../lib/matchmaker"

async function main() {
  console.log("Seeding Jitume AIMS AI Talent Marketplace...")

  const skillNames = ["React", "Node.js", "TypeScript", "PostgreSQL", "UI/UX", "Tailwind CSS"]
  for (const name of skillNames) {
    await prisma.skill.upsert({
      where: { name },
      create: { name, category: "Technology" },
      update: {},
    })
  }

  console.log("Seeding complete.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
