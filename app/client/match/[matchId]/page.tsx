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
    <main className="min-h-screen bg-[#f8fafc] flex flex-col items-center pt-24 pb-16 px-4 font-sans relative overflow-hidden">
      {/* Ambient Radial Mesh Glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[800px] bg-indigo-200/40 blur-[100px]" />

      <div className="w-full max-w-2xl mx-auto space-y-6 relative z-10">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="eyebrow inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-mono font-bold">
            <Sparkles size={13} /> Jitume AIMS · Verified Developer Match
          </span>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight sm:text-5xl">
            Your AI Match is Ready.
          </h1>
          <p className="text-sm text-slate-600 font-sans max-w-md mx-auto">
            Our AI Matchmaker engine evaluated your requirements for <strong>{job.title}</strong> and matched this top creator.
          </p>
        </div>

        {/* Glassmorphism 3.0 Card */}
        <div className="bg-white/70 backdrop-blur-xl border border-white shadow-xl rounded-3xl p-8 space-y-6">
          {/* Top Bar: Confidence Score & Match Rank */}
          <div className="flex items-center justify-between pb-5 border-b border-slate-200/80">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                MATCH RANK #{match.rank}
              </span>
              <span className="font-mono text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <ShieldCheck size={14} /> AI Verified
              </span>
            </div>
            <span className="rounded-full bg-indigo-600 px-4 py-1.5 font-mono text-sm font-extrabold text-white shadow-sm">
              {match.confidenceScore}% MATCH
            </span>
          </div>

          {/* Creator Profile Overview */}
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">{creatorUser.name}</h2>
                <p className="text-sm font-mono font-semibold text-indigo-600 mt-0.5">{creator.title}</p>
              </div>
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 font-mono text-xs font-bold text-emerald-700">
                {creator.level}
              </span>
            </div>

            {creator.bio && (
              <p className="text-xs text-slate-600 font-sans leading-relaxed pt-2">
                {creator.bio}
              </p>
            )}

            {/* Matched Skill Tags */}
            <div className="pt-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Verified Skill Tags:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {creator.skills.map((cs) => (
                  <span
                    key={cs.id}
                    className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 font-mono text-xs text-slate-800"
                  >
                    {cs.skill.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* AI Rationale Box */}
          {match.aiReasoning && (
            <div className="bg-slate-50/90 rounded-2xl p-5 border border-slate-200/80 space-y-2">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
                <Cpu size={14} /> AI Match Rationale:
              </span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                {match.aiReasoning}
              </p>
            </div>
          )}

          {/* Rate & Portfolio Links */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-200/70 text-xs font-mono">
            <span className="text-slate-900 font-bold">Rate: ${creator.hourlyRate || 95}/hr</span>
            {creator.portfolioUrl && (
              <a
                href={creator.portfolioUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 font-bold hover:underline flex items-center gap-1"
              >
                View GitHub / Portfolio <ExternalLink size={12} />
              </a>
            )}
          </div>

          {/* Call To Action Kickoff Button */}
          <KickoffButton jobTitle={job.title} creatorName={creatorUser.name} />
        </div>

        {/* Back Link */}
        <div className="text-center pt-2">
          <Link href="/" className="text-xs font-mono text-slate-500 hover:text-slate-800 transition inline-flex items-center gap-1">
            <ArrowLeft size={12} /> Return to Jitume AIMS Home
          </Link>
        </div>
      </div>
    </main>
  )
}
