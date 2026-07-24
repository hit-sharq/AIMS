export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { PageHead, PageWrap } from "@/components/app/Page"
import { Empty } from "@/components/app/ui"

export default async function IntelligencePage() {
  const matches = await prisma.match.findMany({
    include: { job: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <PageWrap>
      <PageHead eyebrow="Analytics" title="AI Intelligence Matrix" desc="Autonomous scoring metrics and capability intelligence." />
      {matches.length === 0 ? (
        <Empty title="No intelligence metrics yet" hint="The AI engine generates intelligence metrics dynamically upon match execution." />
      ) : (
        <div className="feat-list">
          {matches.map((m: any) => (
            <div key={m.id} className="glass-card flex items-center justify-between p-4 my-2">
              <div>
                <span className="tiny muted">{m.job.title}</span>
                <p style={{ fontWeight: 600, color: "var(--ink)" }}>Rank #{m.rank} Candidate Match</p>
              </div>
              <span className="font-mono text-xs font-bold text-emerald-600">{m.confidenceScore}% AI Confidence</span>
            </div>
          ))}
        </div>
      )}
    </PageWrap>
  )
}
