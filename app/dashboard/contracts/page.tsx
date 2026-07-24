export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PageWrap } from "@/components/app/Page"
import { CheckCircle2, Briefcase, Sparkles, ArrowRight } from "lucide-react"

export default async function ActiveContractsPage() {
  const matches = await prisma.match.findMany({
    where: { status: "ACCEPTED_BY_CREATOR" },
    orderBy: { updatedAt: "desc" },
    include: {
      job: { include: { client: true, skills: { include: { skill: true } } } },
      creator: { include: { user: true } },
    },
  })

  return (
    <PageWrap>
      <div className="py-6 space-y-8">
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5 mb-2">
            <Briefcase className="h-3.5 w-3.5 text-emerald-600" />
            Creator Supply Network · Active Contracts
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Active Contracts ({matches.length})
          </h1>
          <p className="text-sm font-sans text-slate-600 mt-1">
            Jobs you have accepted through the AI Matchmaker engine. Contract milestones and deliverables.
          </p>
        </div>

        {matches.length === 0 ? (
          <div className="glass-panel p-10 text-center text-slate-500">
            <p className="text-lg font-bold text-slate-900">No active contracts yet</p>
            <p className="text-xs font-mono text-slate-600 mt-1">
              Go to <Link href="/dashboard/projects" className="text-indigo-600 font-bold hover:underline">Matched Jobs</Link> to accept an AI-routed project lead.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {matches.map((m) => (
              <div key={m.id} className="glass-panel p-6 border-emerald-300 bg-emerald-50/50">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-emerald-100 border border-emerald-300 px-3 py-1 font-mono text-xs font-bold text-emerald-800">
                    ACTIVE CONTRACT
                  </span>
                  <span className="font-mono text-xs font-bold text-indigo-700">
                    {m.confidenceScore}% AI MATCH
                  </span>
                </div>

                <h3 className="mt-4 text-xl font-bold text-slate-900">{m.job.title}</h3>
                <p className="mt-2 text-xs text-slate-600 font-sans line-clamp-2">{m.job.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-slate-900">
                    Budget: ${m.job.budgetMin?.toLocaleString()} - ${m.job.budgetMax?.toLocaleString()}
                  </span>
                  <span className="text-slate-600">Timeline: {m.job.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrap>
  )
}
