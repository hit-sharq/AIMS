"use client";

import { useState } from "react";
import { Sparkles, CheckCircle2 } from "lucide-react";

export default function KickoffButton({ jobTitle, creatorName }: { jobTitle: string; creatorName: string }) {
  const [initiated, setInitiated] = useState(false);

  return (
    <div className="w-full mt-6">
      {initiated ? (
        <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
          <div className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-emerald-100 text-emerald-600 mb-1">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="text-lg font-bold text-slate-900">Project Kickoff Initiated!</h4>
          <p className="text-xs text-slate-600 font-sans max-w-md mx-auto">
            Our AI Matchmaker engine has alerted <strong>{creatorName}</strong> to join the kickoff workspace for <strong>{jobTitle}</strong>.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setInitiated(true)}
          className="px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-sm w-full hover:bg-slate-800 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
        >
          <Sparkles size={16} className="text-indigo-400" />
          Initiate Project Kickoff
        </button>
      )}
    </div>
  );
}
