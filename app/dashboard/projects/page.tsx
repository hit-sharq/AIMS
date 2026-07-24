export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { PageWrap } from "@/components/app/Page"
import { Sparkles, ShieldCheck, Briefcase, Cpu, CheckCircle2, ArrowRight } from "lucide-react"
import CreatorMatchedJobsWidget from "./CreatorMatchedJobsWidget"

export default async function CreatorMatchedJobsPage() {
  // Fetch sample/first creator profile
  const creator = await prisma.creatorProfile.findFirst({
    include: {
      user: true,
      skills: { include: { skill: true } },
      matches: {
        orderBy: { confidenceScore: "desc" },
        include: {
          job: {
            include: {
              client: true,
              skills: { include: { skill: true } },
            },
          },
        },
      },
    },
  })

  // Fetch all active jobs in marketplace
  const allJobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      skills: { include: { skill: true } },
      matches: { include: { creator: true } },
    },
  })

  return (
    <PageWrap>
      <div className="py-6 space-y-8">
        
        {/* Creator Identity & Skill Tags Dock */}
        <div className="glass-panel p-6 sm:p-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="eyebrow inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                Verified Creator Supply Profile
              </span>
              {creator && (
                <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-0.5 font-mono text-xs font-bold text-emerald-700">
                  {creator.level} LEVEL
                </span>
              )}
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              {creator ? creator.user.name : "Talent Network Member"}
            </h1>
            <p className="text-sm font-mono text-indigo-600 font-semibold mt-0.5">
              {creator ? creator.title : "Verified Creator Profile"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 font-bold">Active Skill Tags:</span>
            {creator?.skills.map((cs) => (
              <span key={cs.id} className="rounded-full bg-white border border-slate-200 px-3 py-1 font-mono text-xs font-semibold text-slate-800 shadow-2xs">
                {cs.skill.name}
              </span>
            ))}
          </div>
        </div>

        {/* AI Matched Jobs Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Cpu className="h-5 w-5 text-indigo-600" />
                AI Routed & Matched Jobs Pool
              </h2>
              <p className="text-xs text-slate-600 font-sans mt-0.5">
                Jobs automatically routed to your profile based on skill overlap and capability scoring. Accept or decline to initiate contract.
              </p>
            </div>
          </div>

          {!creator || creator.matches.length === 0 ? (
            <div className="glass-panel p-10 text-center text-slate-500">
              <p className="text-lg font-bold text-slate-900">No active jobs found</p>
              <p className="text-xs font-mono text-slate-600 mt-1">
                Waiting for client intakes. The AI Matchmaker runs comparison scripts continuously whenever a client submits a 10-Second Micro-Intake.
              </p>
            </div>
          ) : (
            <CreatorMatchedJobsWidget matches={creator.matches} />
          )}
        </section>

      </div>
    </PageWrap>
  )
}
