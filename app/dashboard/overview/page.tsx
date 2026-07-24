export const dynamic = 'force-dynamic'

import Link from "next/link"
import { getProjects } from "@/lib/data-server"
import { PageWrap } from "@/components/app/Page"
import { Sparkles, Plus, CheckCircle2, ArrowRight, Cpu, ShieldCheck, Activity, TrendingUp, Clock, FileText, ChevronRight } from "lucide-react"
import QuickIntakeWidget from "./QuickIntakeWidget"
import "./app.css"

function stageLabel(s: any) {
  return s?.stage ? s.stage.replace(/([A-Z])/g, " $1").replace(/^./, (m: string) => m.toUpperCase()) : "Brief Intake"
}

export default async function OverviewPage() {
  const projects = await getProjects()
  const activeProjects = (projects || []).slice(0, 5)

  const stages = [
    { num: "1", title: "Intake & Discovery", desc: "Brief intake & client goals", status: "Complete", badge: "complete" },
    { num: "2", title: "Discovery Call", desc: "Interactive session & transcript", status: "Active (92%)", badge: "active" },
    { num: "3", title: "Contact Report", desc: "AI executive synthesis", status: "Queue (7)", badge: "queue" },
    { num: "4", title: "Production Sync", desc: "Scope & deliverable alignment", status: "Queue (12)", badge: "queue" },
    { num: "5", title: "Proposal", desc: "HTML briefing generation", status: "Pending", badge: "pending" },
    { num: "6", title: "Quote", desc: "Fixed-fee milestone schedule", status: "Pending", badge: "pending" },
    { num: "7", title: "Client Approval", desc: "Authorized project kickoff", status: "Planned", badge: "planned" },
  ]

  return (
    <PageWrap>
      <div className="jitume-dashboard">
        
        {/* Welcome Section */}
        <div className="jitume-welcome">
          <span className="eyebrow">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Jitume Agency OS · Intelligence Workspace
          </span>
          <h1 className="jitume-headline">Welcome to Jitume Agency OS</h1>
          <p className="jitume-sub">
            The operating system for creative intelligence. Turn client conversations and briefs into structured project intelligence, proposals, and human-approved deliverables.
          </p>
        </div>

        {/* Quick Intake Widget */}
        <section className="mt-8">
          <QuickIntakeWidget />
        </section>

        {/* 7-Stage Workflow Visualization */}
        <section className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Project Workflow: Active Engine</h2>
              <p className="text-xs text-slate-600 font-sans">Dual-Agent orchestration pipeline tracking client progress from brief intake to final kickoff.</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 font-mono text-xs font-bold text-indigo-700">
              Active Stage: 2
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {stages.map((st) => (
              <div key={st.num} className={`wf-card ${st.badge === "active" ? "wf-card-active" : ""}`}>
                <div className="wf-card-num">{st.num}</div>
                <h3 className="wf-card-title">{st.title}</h3>
                <p className="wf-card-desc">{st.desc}</p>
                <div className="mt-4">
                  <span
                    className={`wf-badge ${
                      st.badge === "complete"
                        ? "wf-badge-complete"
                        : st.badge === "active"
                        ? "wf-badge-active"
                        : st.badge === "queue"
                        ? "wf-badge-queue"
                        : "wf-badge-pending"
                    }`}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {st.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Overview Section */}
        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          
          {/* Active Projects Table */}
          <section className="lg:col-span-2 glass-panel p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2Icon />
                Active Client Projects
              </h3>
              <Link href="/dashboard/projects" className="text-xs font-mono text-indigo-600 font-bold hover:underline flex items-center gap-1">
                View All ({projects.length}) <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead>
                  <tr className="border-b border-slate-200/60 font-mono text-slate-500 uppercase tracking-wider text-[11px]">
                    <th className="pb-3 pt-1 font-semibold">Project Name</th>
                    <th className="pb-3 pt-1 font-semibold">Client</th>
                    <th className="pb-3 pt-1 font-semibold">Stage</th>
                    <th className="pb-3 pt-1 font-semibold">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {activeProjects.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-8 text-center text-slate-500 font-mono">
                        No active projects. Use the Quick Intake widget above to launch a new project.
                      </td>
                    </tr>
                  ) : (
                    activeProjects.map((p: any) => (
                      <tr key={p.id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3.5 font-bold text-slate-900">
                          <Link href={`/dashboard/projects/${p.id}`} className="hover:text-indigo-600">
                            {p.name}
                          </Link>
                        </td>
                        <td className="py-3.5 text-slate-600 font-medium">{p.client}</td>
                        <td className="py-3.5">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-[11px] text-slate-700">
                            {stageLabel(p)}
                          </span>
                        </td>
                        <td className="py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-indigo-600 rounded-full"
                                style={{ width: `${p.progress || 35}%` }}
                              />
                            </div>
                            <span className="font-mono text-slate-600 text-[11px]">{p.progress || 35}%</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* AI Agent Status & Agency Performance */}
          <aside className="space-y-6">
            
            {/* AI Agent Status Widget */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-600" />
                  AI Agent Status
                </h3>
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Execution Agent */}
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center">
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-indigo-100 bg-indigo-50 font-mono text-lg font-extrabold text-indigo-700">
                    85%
                  </div>
                  <h4 className="mt-3 text-xs font-bold text-slate-900">Execution Agent</h4>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">● Processing</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">15 active tasks</p>
                </div>

                {/* Meta-Agent Auditor */}
                <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-center">
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-full border-4 border-emerald-100 bg-emerald-50 font-mono text-lg font-extrabold text-emerald-700">
                    94%
                  </div>
                  <h4 className="mt-3 text-xs font-bold text-slate-900">Meta-Agent Auditor</h4>
                  <p className="text-[11px] text-emerald-600 font-medium mt-0.5">● Active Verification</p>
                  <p className="text-[10px] text-slate-500 font-mono mt-1">10 audits passed</p>
                </div>
              </div>
            </div>

            {/* Agency Performance KPI */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/80">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  Agency Performance
                </h3>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600">Workflow Efficiency</span>
                    <span className="font-bold text-slate-900">89%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "89%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-mono mb-1">
                    <span className="text-slate-600">Auto-Audit Rate</span>
                    <span className="font-bold text-slate-900">94.2%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-600 rounded-full" style={{ width: "94.2%" }} />
                  </div>
                </div>
              </div>
            </div>

          </aside>
        </div>

      </div>
    </PageWrap>
  )
}

function FolderGit2Icon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>
      <circle cx="12" cy="13" r="2"/>
    </svg>
  )
}
