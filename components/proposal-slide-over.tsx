"use client";

import { useState, useEffect } from "react";
import { Archive, RotateCcw, Edit2, Check, X, Sparkles } from "lucide-react";
import type { ProposalCard } from "@/components/mission-control";

type ProposalSlideOverProps = {
  proposal: ProposalCard | null;
  onClose: () => void;
  onDispatch?: (id: string) => Promise<void>;
  onArchive?: (id: string, action: "archive" | "restore" | "delete") => Promise<void>;
  onUpdateContent?: (id: string, newContent: string) => void;
  isSending?: boolean;
};

export function ProposalSlideOver({
  proposal,
  onClose,
  onDispatch,
  onArchive,
  onUpdateContent,
  isSending = false,
}: ProposalSlideOverProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (proposal) {
      setEditedContent(proposal.content || "");
      setIsEditing(false);
      setSaveError(null);
    }
  }, [proposal]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && proposal) {
        if (isEditing) {
          setIsEditing(false);
          setEditedContent(proposal.content || "");
        } else {
          onClose();
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [proposal, isEditing, onClose]);

  if (!proposal) return null;

  const isDispatched = proposal.status === "dispatched";
  const isArchived = proposal.projectStatus === "archived";
  const canApprove = proposal.confidenceScore > 90 && !isDispatched && !isArchived;

  const problemText =
    proposal.discoveryNotes ||
    proposal.fathomNotes ||
    proposal.problem ||
    "Client requires custom high-scale full-stack application with automated data integration and clear delivery milestones.";

  const extractedDeliverables =
    proposal.deliverables && proposal.deliverables.length > 0
      ? proposal.deliverables
      : [
          "Core Web Platform Architecture & Design System",
          "API Integration & Automated Business Workflow",
          "Production Handoff & Quality Assurance Audit",
        ];

  const investmentText = proposal.investment || "Fixed-Fee Milestone Schedule / Customized Package Quote";
  const timelineText = proposal.timeline || "3 to 4 weeks from contract authorization to production deployment";

  async function handleSaveChanges() {
    setIsSaving(true);
    setSaveError(null);

    try {
      const response = await fetch("/api/proposals/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          proposalId: proposal!.id,
          content: editedContent,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save proposal edits.");
      }

      proposal!.content = editedContent;
      if (onUpdateContent) {
        onUpdateContent(proposal!.id, editedContent);
      }
      setIsEditing(false);
    } catch (err: any) {
      setSaveError(err?.message || "Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="proposal-title"
      className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-md transition-opacity animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isEditing) onClose();
      }}
    >
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-6 sm:pl-10">
        <div className="w-screen max-w-2xl border-l border-slate-200 bg-white/95 backdrop-blur-3xl shadow-2xl transition-transform ease-in-out duration-300 overflow-y-auto flex flex-col justify-between text-slate-900">
          
          {/* Sticky White Glass Header */}
          <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/90 px-6 py-6 backdrop-blur-2xl sm:px-10">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block h-2 w-2 rounded-full ${
                      isArchived
                        ? "bg-slate-400"
                        : isDispatched
                        ? "bg-emerald-500 shadow-[0_0_8px_#10b981]"
                        : proposal.confidenceScore > 90
                        ? "bg-indigo-600 shadow-[0_0_8px_#4f46e5]"
                        : "bg-amber-500"
                    }`}
                  />
                  <p className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" />
                    Contact Synthesis Report
                  </p>
                </div>
                <h2
                  id="proposal-title"
                  className="mt-2 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl"
                >
                  {proposal.title}
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {onArchive && !isEditing && (
                  <button
                    type="button"
                    onClick={async () => {
                      await onArchive(proposal.id, isArchived ? "restore" : "archive");
                      onClose();
                    }}
                    title={isArchived ? "Restore to active queue" : "Archive proposal"}
                    className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition"
                  >
                    {isArchived ? <RotateCcw className="h-5 w-5" /> : <Archive className="h-5 w-5" />}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (isEditing) {
                      setIsEditing(false);
                      setEditedContent(proposal.content || "");
                    } else {
                      onClose();
                    }
                  }}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition"
                  aria-label="Close panel"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Quick Metadata Pills */}
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <span className="font-semibold text-slate-900">
                {proposal.client}
              </span>
              <span className="text-slate-400">·</span>
              <span className="font-mono text-slate-600">{proposal.recipientEmail}</span>
              <span className="text-slate-400">·</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 font-mono text-indigo-700">
                Confidence: <strong>{proposal.confidenceScore}%</strong>
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-slate-700">
                Meta Cycles: <strong>{proposal.iterations}</strong>
              </span>
            </div>
          </div>

          {/* Body / Synthesized Data */}
          <div className="flex-1 px-6 py-8 space-y-10 sm:px-10">
            
            {saveError && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-mono text-rose-700">
                {saveError}
              </div>
            )}

            {/* Executive Status Banner */}
            <div className="rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
                    Audit Status
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-900">
                    {isEditing
                      ? "Human-in-the-Loop Refinement Mode"
                      : isArchived
                      ? "Archived Record"
                      : isDispatched
                      ? "Dispatched to Client"
                      : proposal.confidenceScore > 90
                      ? "Approved for Client Dispatch"
                      : "Pending Additional Meta-Agent Cycles"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-mono font-bold uppercase tracking-wider ${
                    isEditing
                      ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      : isArchived
                      ? "bg-slate-100 text-slate-600 border border-slate-200"
                      : isDispatched
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : proposal.confidenceScore > 90
                      ? "bg-indigo-100 text-indigo-800 border border-indigo-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {isEditing ? "Refining" : isArchived ? "Archived" : isDispatched ? "Delivered" : "Ready"}
                </span>
              </div>
            </div>

            {/* 1. Client Context / Problem */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">01</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Client Context & Problem Statement
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-slate-700 font-sans">
                {problemText}
              </p>
            </section>

            {/* 2. Proposed Solution & Scope */}
            <section className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">02</span>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                    Proposed Solution & Scope
                  </h3>
                </div>
                {isEditing && (
                  <span className="text-[11px] font-mono text-indigo-600 uppercase tracking-wider font-semibold">
                    [Live Editor Active]
                  </span>
                )}
              </div>

              {isEditing ? (
                <div className="space-y-2">
                  <p className="text-xs text-slate-500">
                    Edit the proposal markup directly below. HTML formatting will render live upon saving.
                  </p>
                  <textarea
                    value={editedContent}
                    onChange={(e) => setEditedContent(e.target.value)}
                    rows={12}
                    className="w-full rounded-2xl border border-indigo-200 bg-white p-4 font-mono text-xs text-slate-900 leading-relaxed outline-none focus:border-indigo-600 focus:ring-4 focus:ring-indigo-100 shadow-inner"
                    placeholder="Enter updated proposal HTML markup..."
                  />
                </div>
              ) : proposal.content ? (
                <div
                  className="prose prose-slate max-w-none text-slate-800 text-sm leading-relaxed bg-slate-50 p-6 border border-slate-200 rounded-2xl font-sans"
                  dangerouslySetInnerHTML={{ __html: proposal.content }}
                />
              ) : (
                <p className="text-sm leading-relaxed text-slate-700">
                  {proposal.solution || "Architected end-to-end software platform using modern stack."}
                </p>
              )}
            </section>

            {/* 3. Key Deliverables */}
            <section className="space-y-3">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-indigo-600">03</span>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Key Deliverables
                </h3>
              </div>
              <ul className="space-y-2.5 pt-1">
                {extractedDeliverables.map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm text-slate-800">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-xs border border-emerald-200">
                      ✓
                    </span>
                    <span className="leading-6">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4 & 5. Investment & Timeline */}
            <div className="grid gap-6 sm:grid-cols-2">
              <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">04. Investment</p>
                <h4 className="text-lg font-bold text-slate-900">Estimated Budget</h4>
                <p className="text-sm text-slate-700 pt-1">{investmentText}</p>
              </section>

              <section className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-5">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-600">05. Schedule</p>
                <h4 className="text-lg font-bold text-slate-900">Execution Timeline</h4>
                <p className="text-sm text-slate-700 pt-1">{timelineText}</p>
              </section>
            </div>

            {/* Meta-Audit Verification */}
            {proposal.metaAuditNotes && (
              <section className="space-y-2 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5">
                <p className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-700">
                  Meta-Agent Audit Log
                </p>
                <p className="text-xs text-slate-700 leading-relaxed font-mono">
                  {proposal.metaAuditNotes}
                </p>
              </section>
            )}
          </div>

          {/* Sticky White Glass Footer Actions */}
          <div className="sticky bottom-0 z-10 border-t border-slate-200 bg-white/90 px-6 py-5 backdrop-blur-2xl sm:px-10 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (isEditing) {
                    setIsEditing(false);
                    setEditedContent(proposal.content || "");
                  } else {
                    onClose();
                  }
                }}
                className="px-4 py-2.5 text-xs font-mono font-semibold text-slate-600 hover:text-slate-950 transition"
              >
                {isEditing ? "Cancel" : "Close Briefing"}
              </button>

              {onArchive && !isEditing && (
                <button
                  type="button"
                  onClick={async () => {
                    await onArchive(proposal.id, isArchived ? "restore" : "archive");
                    onClose();
                  }}
                  className="btn btn-ghost btn-sm font-mono text-xs gap-1.5"
                >
                  {isArchived ? (
                    <>
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>Restore</span>
                    </>
                  ) : (
                    <>
                      <Archive className="h-3.5 w-3.5" />
                      <span>Archive</span>
                    </>
                  )}
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isDispatched && !isArchived && (
                <>
                  {isEditing ? (
                    <button
                      type="button"
                      disabled={isSaving}
                      onClick={handleSaveChanges}
                      className="btn btn-signal btn-sm font-mono text-xs gap-2"
                    >
                      <Check className="h-4 w-4" />
                      <span>{isSaving ? "Saving changes…" : "Save changes"}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(true);
                        setEditedContent(proposal.content || "");
                      }}
                      className="btn btn-ghost btn-sm font-mono text-xs gap-1.5"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span>Refine</span>
                    </button>
                  )}
                </>
              )}

              {!isEditing && !isDispatched && !isArchived && onDispatch && (
                <button
                  type="button"
                  disabled={isSending || !canApprove}
                  onClick={async () => {
                    await onDispatch(proposal.id);
                    onClose();
                  }}
                  className="btn btn-signal btn-sm font-mono text-xs disabled:opacity-40"
                >
                  {isSending ? (
                    <span>Dispatching…</span>
                  ) : (
                    <span>Approve & Send Proposal</span>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
