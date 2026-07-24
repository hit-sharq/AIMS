export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { PageHead, PageWrap } from "@/components/app/Page"
import { Empty } from "@/components/app/ui"

export default async function WorkshopsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <PageWrap>
      <PageHead eyebrow="Discovery" title="Strategy Workshops" desc="Discovery sessions and requirement workshops." />
      {jobs.length === 0 ? (
        <Empty title="No workshop sessions yet" hint="Strategy workshops are scheduled upon client demand." />
      ) : (
        <div className="feat-list">
          {jobs.map((j: any) => (
            <div key={j.id} className="glass-card flex items-center justify-between p-4 my-2">
              <div>
                <span className="tiny muted">{j.projectType}</span>
                <p style={{ fontWeight: 600, color: "var(--ink)" }}>{j.title}</p>
              </div>
              <span className="font-mono text-xs font-bold text-slate-700">{j.timeline}</span>
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  )
}
