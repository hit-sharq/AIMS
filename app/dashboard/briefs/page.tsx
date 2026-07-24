export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { PageHead, PageWrap } from "@/components/app/Page"
import { Empty } from "@/components/app/ui"

export default async function BriefsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <PageWrap>
      <PageHead eyebrow="Intake" title="Project Briefs" desc="AI-deduced project specifications and requirements." />
      {jobs.length === 0 ? (
        <Empty title="No briefs yet" hint="Project briefs are generated dynamically during intake." />
      ) : (
        <div className="feat-list">
          {jobs.map((j: any) => (
            <div key={j.id} className="glass-card flex items-center justify-between p-4 my-2">
              <div>
                <span className="tiny muted">{j.projectType}</span>
                <p style={{ fontWeight: 600, color: "var(--ink)" }}>{j.title}</p>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-600">{j.requiredLevel} LEVEL</span>
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  )
}
