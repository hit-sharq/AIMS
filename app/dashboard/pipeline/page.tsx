export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import { DashboardShell } from "@/components/app/DashboardShell"
import { PageHead } from "@/components/app/Page"

const STAGES = [
  { id: "ACTIVE", label: "Active Jobs", color: "#4a90d9" },
  { id: "MATCHING", label: "Matching", color: "#e67e22" },
  { id: "ASSIGNED", label: "Assigned", color: "#27ae60" },
  { id: "COMPLETED", label: "Completed", color: "#2ecc71" },
]

export default async function PipelinePage() {
  const jobs = await prisma.job.findMany({
    include: { client: true, skills: { include: { skill: true } } },
    orderBy: { updatedAt: "desc" },
  })

  const totalValue = jobs.reduce((sum: number, j: any) => sum + (j.budgetMax || 0), 0)

  const byStage = STAGES.reduce((acc: Record<string, typeof jobs>, stage: any) => {
    acc[stage.id] = jobs.filter((j: any) => j.status === stage.id)
    return acc
  }, {} as Record<string, typeof jobs>)

  return (
    <DashboardShell>
      <div className="admin-content">
        <PageHead
          eyebrow="Dashboard"
          title="Pipeline"
          desc="Revenue demand pipeline from intake to matched contract."
          actions={
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--ink-2)" }}>
                {jobs.length} jobs · KSh {totalValue.toLocaleString()} pipeline
              </div>
            </div>
          }
        />

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, marginBottom: 32 }}>
          {STAGES.map((stage) => {
            const count = byStage[stage.id]?.length || 0
            const stageValue = byStage[stage.id]?.reduce((sum: number, j: any) => sum + (j.budgetMax || 0), 0) || 0
            return (
              <div key={stage.id} style={{ background: "var(--bg)", border: "2px solid var(--ink)", padding: 18 }}>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.08em", color: stage.color, marginBottom: 8 }}>
                  {stage.label}
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "1.6rem", fontWeight: 700, color: "var(--ink)" }}>
                  {count}
                </div>
                {stageValue > 0 && (
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--ink-2)", marginTop: 4 }}>
                    KSh {stageValue.toLocaleString()}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
          {STAGES.map((stage) => (
            <div key={stage.id} style={{ background: "var(--bg)", border: "2px solid var(--ink)" }}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid var(--line)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em", color: stage.color, fontWeight: 700 }}>
                  {stage.label}
                </span>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", color: "var(--ink-3)" }}>
                  {(byStage[stage.id]?.length || 0)}
                </span>
              </div>
              <div style={{ padding: 12 }}>
                {(byStage[stage.id]?.length || 0) === 0 ? (
                  <div style={{ padding: 24, textAlign: "center", color: "var(--ink-3)", fontSize: "0.82rem" }}>
                    No jobs
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {byStage[stage.id]?.map((j: any) => (
                      <div
                        key={j.id}
                        style={{ display: "block", padding: 14, background: "var(--surface-2)", border: "1px solid var(--line)" }}
                      >
                        <div style={{ fontWeight: 600, color: "var(--ink)", fontSize: "0.92rem", marginBottom: 4 }}>
                          {j.title}
                        </div>
                        <div style={{ fontSize: "0.78rem", color: "var(--ink-2)", marginBottom: 6 }}>
                          {j.client?.name || "Client"}
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span style={{
                            fontFamily: "var(--font-mono)", fontSize: "0.65rem", textTransform: "uppercase",
                            letterSpacing: "0.05em", padding: "2px 8px", background: "var(--bg)", border: "1px solid var(--line)",
                            color: j.status === "ACTIVE" ? "var(--signal)" : "#27ae60"
                          }}>
                            {j.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardShell>
  )
}
