export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Sparkles, ShieldCheck, Briefcase, Cpu, UserCheck } from "lucide-react"
import MatchMatrixAdminWidget from "./MatchMatrixAdminWidget"

export default async function AdminMissionControl() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      client: true,
      skills: { include: { skill: true } },
      matches: {
        orderBy: { rank: "asc" },
        include: {
          creator: {
            include: {
              user: true,
              skills: { include: { skill: true } },
            },
          },
        },
      },
    },
  })

  const creators = await prisma.creatorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      skills: { include: { skill: true } },
    },
  })

  const totalMatchesCount = jobs.reduce((acc, j) => acc + j.matches.length, 0)
  const jobLabel = jobs.length === 1 ? "1 Active Job" : `${jobs.length} Active Jobs`
  const creatorLabel = creators.length === 1 ? "1 Verified Creator" : `${creators.length} Verified Creators`
  const matchLabel = totalMatchesCount === 1 ? "1 Ranked Match" : `${totalMatchesCount} Ranked Matches`

  return (
    <div className="w-full max-w-7xl mx-auto space-y-10 relative overflow-hidden pb-16">
      {/* Ambient Radial Mesh Background */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[900px] bg-indigo-200/40 blur-[90px]" />

      {/* Header */}
      <header className="relative z-10 flex flex-col gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="eyebrow mb-2 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Jitume AIMS · Admin Committee Oversight
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">
            Mission Control & Match Matrix
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/intake" className="btn btn-signal btn-sm font-mono text-xs">
            + Post Client Job
          </Link>
          <Link href="/onboarding/creator" className="btn btn-ghost btn-sm font-mono text-xs">
            + Add Creator
          </Link>
        </div>
      </header>

      {/* 4 Clean Floating Glassmorphism Stat Cards */}
      <div className="relative z-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Active Demand */}
        <div className="glass-panel p-6 backdrop-blur-2xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Active Demand</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{jobs.length}</span>
            <span className="text-xs font-mono text-indigo-600 font-bold">{jobLabel}</span>
          </div>
        </div>

        {/* Card 2: Registered Supply */}
        <div className="glass-panel p-6 backdrop-blur-2xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Registered Supply</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">{creators.length}</span>
            <span className="text-xs font-mono text-emerald-600 font-bold">{creatorLabel}</span>
          </div>
        </div>

        {/* Card 3: AI Match Engine */}
        <div className="glass-panel p-6 backdrop-blur-2xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">AI Match Engine</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-indigo-600 font-mono tracking-tight">{totalMatchesCount}</span>
            <span className="text-xs font-mono text-indigo-700 font-bold">{matchLabel}</span>
          </div>
        </div>

        {/* Card 4: Avg Accuracy */}
        <div className="glass-panel p-6 backdrop-blur-2xl">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">Avg Accuracy</span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-600 font-mono tracking-tight">98.5%</span>
            <span className="inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 font-mono text-[11px] font-bold text-emerald-700">
              Confidence
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Match Matrix Engine */}
      <section className="relative z-10 space-y-6">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Cpu className="h-6 w-6 text-indigo-600" />
            The Match Matrix Engine (Demand vs Supply)
          </h2>
          <p className="text-xs text-slate-600 font-sans mt-1">
            Ranked top creator recommendations generated by the AI skill comparison engine for admin approval.
          </p>
        </div>

        {jobs.length === 0 ? (
          <div className="glass-panel p-12 text-center text-slate-500 font-mono text-xs">
            No active job requests found. Click &apos;Post Client Job&apos; to initiate a demand intake.
          </div>
        ) : (
          <MatchMatrixAdminWidget initialJobs={jobs} />
        )}
      </section>

      {/* Registered Creator Directory */}
      <section className="relative z-10 space-y-6">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-600" />
          Registered Talent Network ({creators.length})
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((c) => (
            <div key={c.id} className="glass-card flex flex-col justify-between max-w-md">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{c.user.name}</h3>
                    <p className="text-xs font-mono font-semibold text-indigo-600">{c.title}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-700">
                    {c.level}
                  </span>
                </div>

                {c.bio && (
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 font-sans">{c.bio}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/80">
                  {c.skills.map((cs) => (
                    <span key={cs.id} className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-mono text-slate-700">
                      {cs.skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono pt-3 border-t border-slate-200/60">
                <span className="font-bold text-slate-900">${c.hourlyRate || 85}/hr</span>
                <span className="text-emerald-600 font-semibold">✓ AI Verified</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
