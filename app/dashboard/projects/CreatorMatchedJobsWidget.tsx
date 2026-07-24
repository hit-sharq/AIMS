"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

export default function CreatorMatchedJobsWidget({ matches: initialMatches }: { matches: any[] }) {
  const [matches, setMatches] = useState(initialMatches);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function handleRespond(matchId: string, action: "accept_creator" | "decline_creator") {
    setLoadingId(matchId);

    try {
      const res = await fetch("/api/matches/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ matchId, action }),
      });

      if (!res.ok) throw new Error("Response failed.");

      const newStatus = action === "accept_creator" ? "ACCEPTED_BY_CREATOR" : "DECLINED_BY_CREATOR";

      setMatches((current) =>
        current.map((m) => (m.id === matchId ? { ...m, status: newStatus } : m))
      );
    } catch (err) {
      alert("Failed to respond to job match.");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {matches.map((m) => {
        const isAccepted = m.status === "ACCEPTED_BY_CREATOR";
        const isDeclined = m.status === "DECLINED_BY_CREATOR";
        const isLoading = loadingId === m.id;

        return (
          <div
            key={m.id}
            className={`glass-panel p-6 sm:p-8 flex flex-col justify-between transition-all ${
              isAccepted
                ? "border-emerald-400 bg-emerald-50/70"
                : isDeclined
                ? "opacity-60 bg-slate-100/70"
                : "hover:border-indigo-300"
            }`}
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 font-mono text-xs font-bold text-slate-800">
                  {m.job.projectType}
                </span>
                <span className="rounded-full bg-indigo-600 px-3.5 py-1 font-mono text-xs font-extrabold text-white shadow-xs">
                  {m.confidenceScore}% MATCH
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-bold text-slate-900">{m.job.title}</h3>
              <p className="mt-2 text-xs text-slate-600 font-sans leading-relaxed line-clamp-3">
                {m.job.description}
              </p>

              {m.aiReasoning && (
                <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/80 p-3 text-xs text-indigo-900 font-sans">
                  <span className="font-mono font-bold uppercase tracking-wider text-[10px] text-indigo-700 block mb-1">
                    AI Match Matrix Rationale:
                  </span>
                  {m.aiReasoning}
                </div>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs font-mono pt-3 border-t border-slate-200/60">
                <span className="font-bold text-slate-900">
                  Budget: ${m.job.budgetMin?.toLocaleString()} - ${m.job.budgetMax?.toLocaleString()}
                </span>
                <span className="text-slate-600 font-medium">Timeline: {m.job.timeline}</span>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center justify-between">
              <span
                className={`text-xs font-mono font-bold uppercase ${
                  isAccepted
                    ? "text-emerald-700"
                    : isDeclined
                    ? "text-rose-600"
                    : "text-slate-600"
                }`}
              >
                {isAccepted
                  ? "✓ Match Accepted & Contract Kickoff"
                  : isDeclined
                  ? "✕ Match Declined"
                  : m.status === "ADMIN_APPROVED"
                  ? "✓ Admin Approved Match"
                  : "AI Proposed Match"}
              </span>

              {!isAccepted && !isDeclined && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRespond(m.id, "decline_creator")}
                    disabled={isLoading}
                    className="btn btn-ghost btn-sm font-mono text-xs text-slate-600 hover:text-rose-600"
                  >
                    Decline
                  </button>
                  <button
                    onClick={() => handleRespond(m.id, "accept_creator")}
                    disabled={isLoading}
                    className="btn btn-signal btn-sm font-mono text-xs gap-1.5"
                  >
                    <CheckCircle2 size={14} />
                    <span>{isLoading ? "Processing…" : "Accept Job"}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
