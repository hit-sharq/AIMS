export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Briefcase, Sparkles, Plus, ArrowRight } from "lucide-react"

export default async function AdminActiveJobsPage() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      skills: { include: { skill: true } },
      matches: { include: { creator: { include: { user: true } } } },
    },
  })

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 gap-4">
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5 mb-2">
            <Briefcase className="h-3.5 w-3.5 text-indigo-600" />
            Jitume AIMS · Demand Management
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Active Jobs ({jobs.length})
          </h1>
        </div>
        <Link href="/intake" className="btn btn-signal btn-sm font-mono text-xs gap-1.5 self-start sm:self-auto">
          <Plus size={14} /> Post New Client Job
        </Link>
      </div>

      {jobs.length === 0 ? (
        <div className="glass-panel p-10 text-center text-slate-500">
          <p className="text-lg font-bold text-slate-900">No active jobs found</p>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Waiting for client intakes. Click "+ Post New Client Job" above or test client intake at /intake.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {jobs.map((job) => (
            <div key={job.id} className="glass-panel p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-slate-200/80 gap-3">
                <div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-3 py-0.5 font-mono text-xs font-bold text-indigo-700">
                    {job.projectType}
                  </span>
                  <h3 className="mt-2 text-2xl font-bold text-slate-900">{job.title}</h3>
                  <p className="text-xs text-slate-600 font-sans mt-1 max-w-3xl">{job.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
                  <span className="rounded-full bg-white border border-slate-200 px-3 py-1 font-bold text-slate-900">
                    Budget: KSh {job.budgetMin?.toLocaleString()} - KSh {job.budgetMax?.toLocaleString()}
                  </span>
                  <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-700">
                    {job.timeline}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs font-mono text-slate-500 font-semibold mr-1">Skills:</span>
                  {job.skills.map((js) => (
                    <span key={js.id} className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-xs font-mono text-slate-700">
                      {js.skill.name}
                    </span>
                  ))}
                </div>

                <Link href="/admin" className="text-xs font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1">
                  View Match Matrix <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
