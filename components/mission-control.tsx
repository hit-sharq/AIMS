"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle, Archive, RotateCcw, Trash2, Check, ExternalLink, Sparkles } from "lucide-react";
import { JoinMeetingButton } from "@/components/JoinMeetingButton";
import { ProposalSlideOver } from "@/components/proposal-slide-over";

export type ProposalCard = {
  id: string;
  projectId?: string;
  type?: string;
  client: string;
  clientEmail?: string;
  serviceLine?: string | null;
  title: string;
  content: string;
  status: string;
  stage?: string;
  projectStatus?: string;
  recipientEmail: string;
  confidenceScore: number;
  iterations: number;
  metaAuditNotes: string;
  approvedAt?: string | null;
  dispatchedAt?: string | null;
  createdAt: string;
  discoveryNotes?: string | null;
  fathomNotes?: string | null;
  problem?: string;
  solution?: string;
  deliverables?: string[];
  investment?: string;
  timeline?: string;
};

type MissionControlProps = {
  proposals: ProposalCard[];
  fetchError?: string | null;
};

type StepDef = {
  title: string;
  description: string;
};

const stepsDefinition: StepDef[] = [
  {
    title: "Discover",
    description: "Input initial client meeting transcript.",
  },
  {
    title: "Understand",
    description: "Synthesize Contact Report & Google Calendar auto-sync.",
  },
  {
    title: "Create",
    description: "Input internal sync & synthesize Proposal + Invoice.",
  },
  {
    title: "Review",
    description: "Dual-Agent audit & Human-in-the-loop refine.",
  },
  {
    title: "Deliver",
    description: "Dispatch finalized proposal package via email.",
  },
];

function getStepIndex(proposal: ProposalCard | null): number {
  if (!proposal) return 0;
  const stage = proposal.stage?.toLowerCase();
  const status = proposal.status?.toLowerCase();

  if (status === "dispatched" || stage === "delivered") return 4;
  if (status === "ready_for_dispatch" || status === "approved" || stage === "ready_for_dispatch") return 3;
  if (stage === "internal_sync") return 2;
  if (proposal.type === "CONTACT_REPORT") return 1;
  if (stage === "discovery") return 0;

  return 0;
}

function relativeTime(date: string) {
  const diffMs = Date.now() - new Date(date).getTime();
  const minutes = Math.max(1, Math.floor(diffMs / 60000));
  if (minutes < 60) return `Generated ${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Generated ${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `Generated ${days} d ago`;
}

export function MissionControl({ proposals, fetchError }: MissionControlProps) {
  const [items, setItems] = useState<ProposalCard[]>(proposals);
  const [activeTab, setActiveTab] = useState<"active" | "delivered" | "archived">("active");
  const [activeProposalId, setActiveProposalId] = useState<string | null>(proposals[0]?.id || null);
  const [selectedProposal, setSelectedProposal] = useState<ProposalCard | null>(null);
  const [sending, setSending] = useState<string | null>(null);
  const [notice, setNotice] = useState<{ message: string; type: "success" | "error" } | null>(
    fetchError ? { message: fetchError, type: "error" } : null
  );

  const activeQueue = items.filter(
    (item) => item.status !== "dispatched" && item.projectStatus !== "archived"
  );
  const deliveredQueue = items.filter((item) => item.status === "dispatched");
  const archivedQueue = items.filter((item) => item.projectStatus === "archived");

  const displayedItems =
    activeTab === "active"
      ? activeQueue
      : activeTab === "delivered"
      ? deliveredQueue
      : archivedQueue;

  const activeProposal = items.find((item) => item.id === activeProposalId) || items[0] || null;
  const currentStepIndex = getStepIndex(activeProposal);
  const isAllPhasesCompleted = currentStepIndex === 4;

  async function dispatch(proposalId: string) {
    setSending(proposalId);
    setNotice(null);

    try {
      const response = await fetch("/api/proposals/dispatch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId }),
      });

      const payload = await response.json();

      if (!response.ok) {
        setNotice({
          message: payload.error || "Proposal dispatch failed.",
          type: "error",
        });
        return;
      }

      setItems((current) =>
        current.map((item) =>
          item.id === proposalId
            ? { ...item, status: "dispatched", dispatchedAt: new Date().toISOString() }
            : item
        )
      );

      setNotice({
        message: "Proposal successfully dispatched to client inbox!",
        type: "success",
      });
    } catch (err) {
      setNotice({
        message: "Network request failed while dispatching proposal.",
        type: "error",
      });
    } finally {
      setSending(null);
    }
  }

  async function handleArchive(id: string, action: "archive" | "restore" | "delete") {
    try {
      const response = await fetch("/api/proposals/archive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ proposalId: id, action }),
      });

      const result = await response.json();

      if (response.ok) {
        if (action === "delete") {
          setItems((current) => current.filter((item) => item.id !== id));
          if (activeProposalId === id) setActiveProposalId(null);
          setNotice({ message: "Proposal deleted permanently.", type: "success" });
        } else if (action === "restore") {
          setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, projectStatus: "active" } : item))
          );
          setNotice({ message: "Proposal restored to active queue.", type: "success" });
        } else {
          setItems((current) =>
            current.map((item) => (item.id === id ? { ...item, projectStatus: "archived" } : item))
          );
          setNotice({ message: "Proposal archived.", type: "success" });
        }
      } else {
        setNotice({ message: result.error || "Archive action failed.", type: "error" });
      }
    } catch (err) {
      setNotice({ message: "Failed to process archive action.", type: "error" });
    }
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-8 text-slate-900 md:px-14 md:py-12 font-sans relative overflow-hidden">
      {/* Soft Ambient Background Light */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[900px] bg-indigo-200/50 blur-[90px]" />

      <header className="relative z-10 flex flex-col gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="eyebrow mb-3 inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            Synthos Agency OS · Stealth Pipeline
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900">
            Mission Control
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <JoinMeetingButton />
        </div>
      </header>

      {/* Notice Banner */}
      {notice && (
        <div
          className={`relative z-10 mt-6 flex items-center justify-between border p-4 text-xs font-mono rounded-2xl backdrop-blur-xl transition-all ${
            notice.type === "success"
              ? "border-emerald-200 bg-emerald-50/90 text-emerald-900"
              : "border-rose-200 bg-rose-50/90 text-rose-900"
          }`}
        >
          <span>{notice.message}</span>
          <button
            onClick={() => setNotice(null)}
            className="uppercase tracking-wider underline opacity-75 hover:opacity-100"
          >
            Dismiss
          </button>
        </div>
      )}

      <section className="relative z-10 grid gap-12 py-10 lg:grid-cols-[1.6fr_0.8fr]">
        <div>
          {/* Header & Glass Filter Tabs */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-widest text-slate-800">
              Client Decisions Queue
            </h2>

            {/* White Glass Filter Tabs */}
            <div className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white/70 p-1.5 backdrop-blur-xl text-xs font-mono text-slate-600 shadow-sm">
              <button
                onClick={() => setActiveTab("active")}
                className={`rounded-full px-4 py-1.5 transition ${
                  activeTab === "active"
                    ? "bg-slate-900 text-white shadow-sm font-bold"
                    : "hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                Active Queue ({activeQueue.length})
              </button>
              <button
                onClick={() => setActiveTab("delivered")}
                className={`rounded-full px-4 py-1.5 transition ${
                  activeTab === "delivered"
                    ? "bg-slate-900 text-white shadow-sm font-bold"
                    : "hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                Delivered ({deliveredQueue.length})
              </button>
              <button
                onClick={() => setActiveTab("archived")}
                className={`rounded-full px-4 py-1.5 transition ${
                  activeTab === "archived"
                    ? "bg-slate-900 text-white shadow-sm font-bold"
                    : "hover:text-slate-950 hover:bg-slate-100"
                }`}
              >
                Archived ({archivedQueue.length})
              </button>
            </div>
          </div>

          <div className="space-y-5">
            {displayedItems.length === 0 && (
              <div className="glass-panel p-12 text-center text-slate-500">
                <p className="text-xl font-bold text-slate-900">
                  {activeTab === "active"
                    ? "No active proposals pending"
                    : activeTab === "delivered"
                    ? "No delivered proposals yet"
                    : "No archived proposals"}
                </p>
                <p className="mt-2 text-xs font-mono text-slate-600">
                  {activeTab === "active"
                    ? "Start a new client meeting to run the synthesis loop."
                    : "Proposal actions will appear here once updated."}
                </p>
              </div>
            )}

            {displayedItems.map((proposal) => {
              const isDispatched = proposal.status === "dispatched";
              const isArchived = proposal.projectStatus === "archived";
              const isSending = sending === proposal.id;
              const canApprove = proposal.confidenceScore > 90 && !isDispatched && !isArchived;
              const isActiveSelected = activeProposalId === proposal.id;

              return (
                <article
                  key={proposal.id}
                  onClick={() => setActiveProposalId(proposal.id)}
                  className={`glass-card group cursor-pointer transition-all duration-200 ${
                    isActiveSelected
                      ? "!border-slate-900 !ring-2 !ring-slate-900/10 shadow-md"
                      : "hover:border-slate-300"
                  }`}
                >
                  <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-block h-2 w-2 rounded-full ${
                              isArchived
                                ? "bg-slate-400"
                                : isDispatched
                                ? "bg-emerald-500"
                                : proposal.confidenceScore > 90
                                ? "bg-slate-900"
                                : "bg-amber-500"
                            }`}
                          />
                          <p
                            className={`text-xs font-mono font-bold uppercase tracking-widest ${
                              isArchived
                                ? "text-slate-500"
                                : isDispatched
                                ? "text-emerald-700"
                                : proposal.confidenceScore > 90
                                ? "text-slate-900"
                                : "text-amber-700"
                            }`}
                          >
                            {isArchived
                              ? "ARCHIVED"
                              : isDispatched
                              ? "DELIVERED TO CLIENT"
                              : "READY FOR REVIEW"}
                          </p>
                        </div>

                        {/* Archive / Restore Controls */}
                        <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                          {isArchived ? (
                            <>
                              <button
                                type="button"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleArchive(proposal.id, "restore");
                                }}
                                title="Restore to active queue"
                                className="p-1.5 text-slate-500 hover:text-slate-900 transition"
                              >
                                <RotateCcw className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={(e: React.MouseEvent) => {
                                  e.stopPropagation();
                                  handleArchive(proposal.id, "delete");
                                }}
                                title="Delete permanently"
                                className="p-1.5 text-rose-500 hover:text-rose-700 transition"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                handleArchive(proposal.id, "archive");
                              }}
                              title="Archive proposal"
                              className="p-1.5 text-slate-400 hover:text-slate-900 transition"
                            >
                              <Archive className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {proposal.title}
                      </h3>

                      <p className="text-xs font-mono text-slate-600">
                        <span className="font-bold text-slate-900">{proposal.client}</span> · {relativeTime(proposal.createdAt)}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 text-xs font-mono text-slate-600 border-t border-slate-200/80">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-800">
                          Confidence: <strong className="text-slate-950">{proposal.confidenceScore}%</strong>
                        </span>
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 border border-slate-200 px-3 py-1 text-slate-700">
                          Meta-Cycles: <strong>{proposal.iterations}</strong>
                        </span>

                        {/* HITL Review & Refine Button */}
                        <div className="ml-auto flex items-center gap-2">
                          <Link
                            href={`/admin/review/${proposal.projectId || proposal.id}`}
                            onClick={(e: React.MouseEvent) => e.stopPropagation()}
                            className="btn btn-signal btn-sm font-mono text-xs gap-1"
                          >
                            Review & Refine <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {!isDispatched && !isArchived && (
                      <div className="sm:self-center">
                        <button
                          disabled={isSending || !canApprove}
                          onClick={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            dispatch(proposal.id);
                          }}
                          title={
                            !canApprove
                              ? "Proposal confidence must exceed 90% before dispatch"
                              : "Approve and send email to client"
                          }
                          className="btn btn-signal btn-md text-xs font-mono uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {isSending ? (
                            <span>Sending…</span>
                          ) : (
                            <span>Approve & send</span>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        {/* Dynamic Data-Driven Vertical Stepper Sidebar */}
        <aside className="glass-panel p-8 self-start">
          <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 mb-6">
            {activeProposal
              ? `WORKFLOW: ${activeProposal.client.toUpperCase()}`
              : "WORKFLOW: OVERVIEW"}
          </p>

          {/* Completion Badge */}
          {isAllPhasesCompleted && (
            <div className="mb-6 flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-mono font-bold uppercase tracking-wider text-emerald-900 shadow-sm animate-in fade-in">
              <Check className="h-4 w-4 text-emerald-600 stroke-[3]" />
              <span>✓ PROJECT COMPLETED & DELIVERED</span>
            </div>
          )}

          <div className="relative ml-2 border-l border-slate-200 pl-6 space-y-8">
            {stepsDefinition.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.title} className="relative flex items-start gap-3">
                  {/* Stepper Node Marker */}
                  <div className="absolute -left-[33px] top-0.5 flex items-center justify-center bg-[#f8fafc] p-1">
                    {isCompleted && (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 fill-emerald-600 stroke-[#f8fafc]" />
                    )}
                    {isCurrent && (
                      <span className="relative flex h-3.5 w-3.5 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-indigo-600 shadow-sm" />
                      </span>
                    )}
                    {!isCompleted && !isCurrent && (
                      <Circle className="h-3 w-3 text-slate-300 stroke-[2]" />
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-0.5">
                    <span
                      className={`text-sm font-mono tracking-tight transition-colors ${
                        isCompleted
                          ? "font-bold text-slate-900"
                          : isCurrent
                          ? "font-bold text-indigo-600"
                          : "text-slate-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    <p className="text-xs text-slate-600 leading-normal font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </aside>
      </section>

      {/* Slide Over Briefing Modal */}
      {selectedProposal && (
        <ProposalSlideOver
          proposal={selectedProposal}
          onClose={() => setSelectedProposal(null)}
          onDispatch={(id: string) => dispatch(id)}
          onArchive={(id: string, action: "archive" | "restore" | "delete") => handleArchive(id, action)}
          onUpdateContent={(id: string, content: string) => {
            setItems((current) =>
              current.map((item) => (item.id === id ? { ...item, content } : item))
            );
            setSelectedProposal((current) => (current ? { ...current, content } : null));
          }}
          isSending={sending === selectedProposal.id}
        />
      )}
    </main>
  );
}
