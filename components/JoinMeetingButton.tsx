"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, Video, ArrowRight, X } from "lucide-react";

export function JoinMeetingButton() {
  const [modalOpen, setModalOpen] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [roomName, setRoomName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleCreateMeeting(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !clientEmail.trim()) {
      setError("Please provide both client name and client email.");
      return;
    }

    setCreating(true);
    setError("");

    try {
      const res = await fetch("/api/meetings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName: clientName.trim(),
          clientEmail: clientEmail.trim(),
          roomName: roomName.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize meeting.");
      }

      setModalOpen(false);
      router.push(`/meeting/${data.roomName}?projectId=${data.projectId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create meeting session.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className="btn btn-signal btn-md font-mono text-xs uppercase tracking-wider gap-2 shadow-md hover:scale-[1.02] transition"
      >
        <Video className="h-4 w-4" />
        <span>Start New Discovery Call</span>
      </button>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-md animate-in fade-in"
          onClick={(e) => {
            if (e.target === e.currentTarget && !creating) setModalOpen(false);
          }}
        >
          <div className="w-full max-w-lg rounded-3xl border border-white/90 bg-white/95 p-8 shadow-2xl backdrop-blur-2xl text-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="eyebrow inline-flex items-center gap-1">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                  Pre-Flight Setup
                </span>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                disabled={creating}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateMeeting} className="mt-6 space-y-5">
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                Initialize Discovery Meeting Node
              </h3>
              <p className="text-xs text-slate-600 font-sans leading-relaxed">
                Enter client information to automatically associate transcripts, synthesis reports, and proposal packets with this client record.
              </p>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-mono text-rose-700">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Client Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp / Sarah Connor"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                  Client Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah@acme.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500">
                  Room Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Auto-generated if left blank"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  disabled={creating}
                  className="px-4 py-2 text-xs font-mono font-semibold text-slate-500 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="btn btn-signal btn-md font-mono text-xs uppercase tracking-wider gap-2 disabled:opacity-50"
                >
                  {creating ? (
                    <span>Initializing Session…</span>
                  ) : (
                    <>
                      <span>Launch Meeting Node</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
