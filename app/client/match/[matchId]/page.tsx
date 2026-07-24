export const dynamic = "force-dynamic"

import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ShieldCheck, Sparkles, Cpu, ExternalLink, ArrowLeft } from "lucide-react"
import KickoffButton from "./KickoffButton"

export default async function ClientMatchReviewPage({ params }: { params: { matchId: string } }) {
  const match = await prisma.match.findUnique({
    where: { id: params.matchId },
    include: {
      job: {
        include: {
          client: true,
          skills: { include: { skill: true } },
        },
      },
      creator: {
        include: {
          user: true,
          skills: { include: { skill: true } },
        },
      },
    },
  })

  if (!match) {
    notFound()
  }

  const creator = match.creator
  const creatorUser = creator.user
  const job = match.job

  return (
    <main className="min-h-screen w-full bg-[#f8fafc] flex flex-col items-center pt-32 pb-20 px-4 font-sans">
      {/* Ambient Light Mesh */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[900px] bg-indigo-200/40 blur-[100px]" />

      {/* Header */}
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8 text-center tracking-tight sm:text-5xl">
        Your AI Developer Match is Ready
      </h1>

      {/* The Match Card (Strict Glass Tokens) */}
      <div className="w-full max-w-3xl bg-white/60 backdrop-blur-xl border border-white/80 shadow-2xl rounded-3xl p-10 flex flex-col gap-6 relative z-10">
        {/* Top Bar: Confidence Score & Rank */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-6 border-b border-slate-200/80">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-3.5 py-1 rounded-lg border border-slate-200">
              TOP MATCH RANK #{match.rank}
            </span>
            <span className="font-mono text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <ShieldCheck size={15} /> AI Verified
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-indigo-100 text-indigo-700 font-mono font-bold text-sm px-4.5 py-1.5 rounded-full border border-indigo-200 shadow-2xs">
            <Sparkles size={14} className="text-indigo-600" />
            <span>{match.confidenceScore}% MATCH</span>
          </div>
        </div>

        {/* Project Header */}
        <div>
          <span className="text-xs font-mono text-slate-500 uppercase tracking-wider font-bold">Project Deliverable</span>
          <h2 className="text-xl font-bold text-slate-900 mt-1">{job.title}</h2>
        </div>

        {/* Creator Details */}
        <div className="space-y-4 pt-2 border-t border-slate-200/60">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-3xl font-bold text-slate-900">{creatorUser.name}</h3>
              <p className="text-sm font-mono font-semibold text-indigo-600 mt-1">{creator.title}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3.5 py-1 font-mono text-xs font-bold text-emerald-700">
                {creator.level}
              </span>
              <span className="font-mono text-sm font-bold text-slate-900">
                ${creator.hourlyRate || 95}/hr
              </span>
            </div>
          </div>

          {creator.bio && (
            <p className="text-sm text-slate-600 font-sans leading-relaxed">
              {creator.bio}
            </p>
          )}

          {/* Matched Skill Tags */}
          <div className="pt-2">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Verified Technical Stack:
            </span>
            <div className="flex flex-wrap gap-2">
              {creator.skills.map((cs) => (
                <span
                  key={cs.id}
                  className="rounded-full bg-slate-100 border border-slate-200 px-3.5 py-1 font-mono text-xs text-slate-800 font-medium"
                >
                  {cs.skill.name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* AI Reasoning (Frosted Darker Box) */}
        {match.aiReasoning && (
          <div className="bg-white/40 p-6 rounded-2xl border border-white/50 text-slate-700 leading-relaxed font-sans text-sm space-y-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <Cpu size={15} /> AI Matchmaker Rationale:
            </span>
            <p className="text-slate-700 text-xs sm:text-sm">
              {match.aiReasoning}
            </p>
          </div>
        )}

        {/* External Portfolio Link */}
        {creator.portfolioUrl && (
          <div className="flex justify-end pt-2">
            <a
              href={creator.portfolioUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-mono font-bold text-indigo-600 hover:underline inline-flex items-center gap-1"
            >
              View GitHub / Portfolio <ExternalLink size={12} />
            </a>
          </div>
        )}

        {/* Action Button Component */}
        <KickoffButton jobTitle={job.title} creatorName={creatorUser.name} />
      </div>

      {/* Return Link */}
      <div className="mt-8 text-center relative z-10">
        <Link href="/" className="text-xs font-mono text-slate-500 hover:text-slate-900 transition inline-flex items-center gap-1">
          <ArrowLeft size={12} /> Return to Jitume AIMS Home
        </Link>
      </div>
    </main>
  )
}
