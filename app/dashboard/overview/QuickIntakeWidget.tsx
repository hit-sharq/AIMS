"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Sparkles, ArrowRight } from "lucide-react";

export default function QuickIntakeWidget() {
  const router = useRouter();
  const [clientName, setClientName] = useState("");
  const [projectName, setProjectName] = useState("");
  const [budget, setBudget] = useState("$50,000");
  const [timeline, setTimeline] = useState("12 Weeks");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleCreateProject(e: React.FormEvent) {
    e.preventDefault();
    if (!clientName.trim() || !projectName.trim()) {
      setError("Please enter client name and project title.");
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
          clientEmail: `${clientName.toLowerCase().replace(/[^a-z0-0]/g, "")}@example.com`,
          roomName: projectName.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create project.");

      router.push(`/meeting/${data.roomName}?projectId=${data.projectId}`);
    } catch (err: any) {
      setError(err?.message || "Failed to create project.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="glass-panel p-6 sm:p-8 backdrop-blur-2xl">
      <div className="flex items-center justify-between mb-4 border-b border-slate-200/80 pb-3">
        <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-indigo-600" />
          Quick Intake Widget
        </h3>
        <span className="text-xs font-mono text-slate-500">10-Second Automated Setup</span>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-mono text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleCreateProject} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
            Client Name
          </label>
          <input
            type="text"
            placeholder="Acme Corp"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
            Project Name
          </label>
          <input
            type="text"
            placeholder="Q3 Marketing Campaign"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
            Budget
          </label>
          <input
            type="text"
            placeholder="$50,000"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-bold uppercase text-slate-600 mb-1.5">
            Timeline
          </label>
          <select
            value={timeline}
            onChange={(e) => setTimeline(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-2.5 text-sm text-slate-900 outline-none focus:border-indigo-600 focus:bg-white focus:ring-4 focus:ring-indigo-100 transition"
          >
            <option value="4 Weeks">4 Weeks</option>
            <option value="8 Weeks">8 Weeks</option>
            <option value="12 Weeks">12 Weeks</option>
            <option value="16 Weeks">16 Weeks</option>
          </select>
        </div>

        <div>
          <button
            type="submit"
            disabled={creating}
            className="w-full btn btn-signal btn-md font-mono text-xs uppercase tracking-wider gap-2 flex items-center justify-center disabled:opacity-50"
          >
            <Plus className="h-4 w-4 stroke-[3]" />
            <span>{creating ? "Creating…" : "CREATE PROJECT"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
