"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";

export default function KickoffButton({ jobTitle, creatorName }: { jobTitle: string; creatorName: string }) {
  const [initiated, setInitiated] = useState(false);

  return (
    <div className="w-full mt-4">
      {initiated ? (
        <div className="w-full bg-emerald-50/90 border border-emerald-200 rounded-2xl p-6 text-center space-y-2">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 mb-1">
            <CheckCircle2 size={26} />
          </div>
          <h4 className="text-xl font-bold text-slate-900">Project Kickoff Initiated!</h4>
          <p className="text-xs text-slate-600 font-sans max-w-md mx-auto leading-relaxed">
            Our AI Matchmaker engine has alerted <strong>{creatorName}</strong> to join your project kickoff workspace for <strong>{jobTitle}</strong>.
          </p>
        </div>
      ) : (
        <button
          onClick={() => setInitiated(true)}
          className="w-full py-5 mt-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-lg hover:-translate-y-1 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          Initiate Project Kickoff →
        </button>
      )}
    </div>
  );
}
