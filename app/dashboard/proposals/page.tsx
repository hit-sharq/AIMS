export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { PageHead, PageWrap } from "@/components/app/Page"
import { Empty } from "@/components/app/ui"

export default async function ProposalsPage() {
  const matches = await prisma.match.findMany({
    include: { job: true, creator: { include: { user: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <PageWrap>
      <PageHead eyebrow="Delivery" title="Proposals & Matches" desc="AI-drafted candidate proposals and capability ratings." />
      {matches.length === 0 ? (
        <Empty title="No proposals yet" hint="The AI Matchmaker builds candidate proposals dynamically upon client intake." />
      ) : (
        <div className="feat-list">
          {matches.map((m: any) => (
            <div key={m.id} className="glass-card flex items-center justify-between p-4 my-2">
              <div>
                <span className="tiny muted">{m.job.title}</span>
                <p style={{ fontWeight: 600, color: "var(--ink)" }}>{m.creator.user.name}</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600">{m.confidenceScore}% AI Confidence</span>
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  )
}
