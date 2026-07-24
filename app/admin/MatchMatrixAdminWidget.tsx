"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, ArrowRight, Sparkles, ExternalLink } from "lucide-react";

export default function MatchMatrixAdminWidget({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs);
  const [loadingMatchId, setLoadingMatchId] = useState<string | null>(null);

  async function handleApproveMatch(matchId: string) {
    setLoadingMatchId(matchId);

    try {
      const res = await fetch("/api/matches/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, action: "approve_admin" }),
      });

      if (!res.ok) throw new Error("Match approval failed.");

      setJobs((current) =>
        current.map((job) => ({
          ...job,
          matches: job.matches.map((m: any) =>
            m.id === matchId ? { ...m, status: "ADMIN_APPROVED" } : m
          ),
        }))
      );
    } catch (err) {
      alert("Failed to approve match.");
    } finally {
      setLoadingMatchId(null);
    }
  }

  return (
    <div className="space-y-8">
      {jobs.map((job) => (
        <div key={job.id} className="glass-panel p-6 sm:p-8 backdrop-blur-2xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-slate-200/80">
            <div>
              <div className="flex items-center gap-2">
                <span className="eyebrow text-[10px] tracking-wider text-indigo-600 font-mono">
                  JOB ID: {job.id.slice(0, 10)}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 font-mono text-[11px] font-bold text-slate-800">
                  {job.projectType}
                </span>
              </div>
              <h3 className="mt-2 text-2xl font-bold text-slate-900">{job.title}</h3>
              <p className="mt-1 text-xs text-slate-600 font-sans max-w-3xl leading-relaxed">{job.description}</p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
              <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 font-bold text-indigo-700">
                Budget: ${job.budgetMin?.toLocaleString()} - ${job.budgetMax?.toLocaleString()}
              </span>
              <span className="rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-700">
                Timeline: {job.timeline}
              </span>
            </div>
          </div>

          {/* Required Skill Tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-slate-500 font-bold">Required Skills:</span>
            {job.skills.map((js: any) => (
              <span key={js.id} className="rounded-full bg-white border border-slate-200 px-3 py-0.5 text-xs font-mono text-slate-800 shadow-2xs">
                {js.skill.name}
              </span>
            ))}
          </div>

          {/* Ranked Candidate Cards Grid */}
          <div className="mt-6">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 mb-4">
              AI RANKED CREATOR CANDIDATE (TOP MATCH)
            </h4>

            {job.matches.length === 0 ? (
              <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-6 text-center text-xs font-mono text-slate-500 max-w-md">
                AI Matchmaker is scanning registered creator pool...
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {job.matches.map((m: any) => {
                  const isApproved = m.status === "ADMIN_APPROVED" || m.status === "ACCEPTED_BY_CREATOR";
                  const isLoading = loadingMatchId === m.id;

                  return (
                    <div
                      key={m.id}
                      className={`rounded-2xl border p-5 transition-all flex flex-col justify-between max-w-md ${
                        isApproved
                          ? "border-emerald-300 bg-emerald-50/70 shadow-sm"
                          : "border-slate-200/90 bg-white/95 shadow-2xs hover:border-indigo-300"
                      }`}
                    >
                      <div>
                        {/* Properly formatted and separated Rank & Percentage Badges */}
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                            TOP MATCH
                          </span>
                          <span className="rounded-full bg-indigo-600 px-3 py-0.5 font-mono text-xs font-extrabold text-white shadow-xs">
                            {m.confidenceScore}% MATCH
                          </span>
                        </div>

                        <div className="mt-4">
                          <h5 className="text-base font-bold text-slate-900">{m.creator.user.name}</h5>
                          <p className="text-xs font-mono text-indigo-600 font-semibold mt-0.5">{m.creator.title}</p>
                        </div>

                        {m.aiReasoning && (
                          <div className="mt-3 text-xs text-slate-600 font-sans leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                            <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
                              AI Rationale:
                            </span>
                            {m.aiReasoning}
                          </div>
                        )}
                      </div>

                      <div className="mt-5 pt-3 border-t border-slate-200/70 flex items-center justify-between">
                        <span
                          className={`text-[11px] font-mono font-bold uppercase ${
                            isApproved ? "text-emerald-700" : "text-slate-500"
                          }`}
                        >
                          {m.status === "ADMIN_APPROVED"
                            ? "✓ Admin Approved"
                            : m.status === "ACCEPTED_BY_CREATOR"
                            ? "✓ Accepted by Creator"
                            : "AI Proposed Match"}
                        </span>

                        {!isApproved && (
                          <button
                            onClick={() => handleApproveMatch(m.id)}
                            disabled={isLoading}
                            className="btn btn-signal btn-sm font-mono text-[11px] px-3.5 py-1.5"
                          >
                            {isLoading ? "Approving…" : "Approve Match"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
