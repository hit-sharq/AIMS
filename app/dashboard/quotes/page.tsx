export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { PageHead, PageWrap } from "@/components/app/Page"
import { Empty } from "@/components/app/ui"

export default async function QuotesPage() {
  const jobs = await prisma.job.findMany({
    include: { client: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <PageWrap>
      <PageHead eyebrow="Commercial" title="Quotes & Budgets" desc="Client project budgets and cost breakdowns in KSh." />
      {jobs.length === 0 ? (
        <Empty title="No quotes yet" hint="Project quotes are generated dynamically during intake." />
      ) : (
        <div className="feat-list">
          {jobs.map((j: any) => (
            <div key={j.id} className="glass-card flex items-center justify-between p-4 my-2">
              <div>
                <span className="tiny muted">{j.projectType}</span>
                <p style={{ fontWeight: 600, color: "var(--ink)" }}>{j.title}</p>
              </div>
              <span className="font-mono text-xs font-bold text-indigo-600">
                KSh {j.budgetMin?.toLocaleString()} - KSh {j.budgetMax?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  )
}
