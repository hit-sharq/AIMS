export const dynamic = 'force-dynamic'

import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { PageWrap } from "@/components/app/Page"
import { Sparkles, Cpu, ShieldCheck, ArrowRight, FolderGit2, CheckCircle2 } from "lucide-react"
import CreatorMatchedJobsWidget from "../projects/CreatorMatchedJobsWidget"
import "./app.css"

export default async function CreatorOverviewPage() {
  // Fetch sample/active creator
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

  const skillNames = creator?.skills.map((s) => s.skill.name).join(", ") || "React, Node.js, TypeScript, UI/UX"
  const matches = creator?.matches || []

  return (
    <PageWrap>
      <div className="jitume-dashboard py-6 space-y-8">
        
        {/* Creator Hero Header */}
        <div className="jitume-welcome">
          <span className="eyebrow inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Jitume AIMS · Supply Talent Network
          </span>
          <h1 className="jitume-headline text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mt-2">
            Creator Portal: Your Next Big Project Awaits.
          </h1>
          <p className="jitume-sub text-base text-slate-600 mt-2 font-sans">
            Welcome back, <strong className="text-slate-900">{creator?.user.name || "Creator Specialist"}</strong>. Our AI Matchmaker engine automatically scans active client intakes and routes high-value opportunities matching your verified technical stack.
          </p>
        </div>

        {/* 2 Simple Glass Widgets as requested */}
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Widget 1: AI Match Status */}
          <div className="glass-panel p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 mb-4">
                <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
                  <Cpu className="h-4 w-4 text-indigo-600 animate-pulse" />
                  AI Match Status
                </h3>
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
              </div>

              <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5 text-indigo-950 font-sans">
                <p className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider mb-1">
                  Active Talent Radar
                </p>
                <p className="text-sm leading-relaxed">
                  AI is currently scanning for high-value client jobs matching your verified skills: <strong className="font-semibold text-indigo-900">{skillNames}</strong>.
                </p>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Verification Gate:</span>
                  <span className="font-bold text-emerald-700">✓ Verified</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Capability Level:</span>
                  <span className="font-bold text-slate-900">{creator?.level || "SENIOR"}</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Target Hourly Rate:</span>
                  <span className="font-bold text-slate-900">${creator?.hourlyRate || 85}/hr</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-200/80">
              <Link
                href="/onboarding/creator"
                className="btn btn-ghost btn-sm w-full font-mono text-xs gap-1.5 justify-center"
              >
                Update Skill Tags & Profile →
              </Link>
            </div>
          </div>

          {/* Widget 2: Recent Job Matches */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FolderGit2 className="h-5 w-5 text-indigo-600" />
                Recent AI Job Matches ({matches.length})
              </h3>
              <Link href="/dashboard/projects" className="text-xs font-mono font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All Matches <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {matches.length === 0 ? (
              <div className="glass-panel p-8 text-center text-slate-500 font-mono text-xs">
                No recent matches pending. Use Client Intake to trigger AI Matchmaker.
              </div>
            ) : (
              <CreatorMatchedJobsWidget matches={matches.slice(0, 2)} />
            )}
          </div>

        </div>

      </div>
    </PageWrap>
  )
}
