export const dynamic = 'force-dynamic'

import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { ShieldCheck, Plus, ExternalLink } from "lucide-react"

export default async function AdminTalentNetworkPage() {
  const creators = await prisma.creatorProfile.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: true,
      skills: { include: { skill: true } },
    },
  })

  return (
    <div className="p-6 md:p-10 space-y-8 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-6 gap-4">
        <div>
          <span className="eyebrow inline-flex items-center gap-1.5 mb-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Jitume AIMS · Supply Management
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Verified Talent Network ({creators.length})
          </h1>
        </div>
        <Link href="/onboarding/creator" className="btn btn-signal btn-sm font-mono text-xs gap-1.5 self-start sm:self-auto">
          <Plus size={14} /> Add Creator Profile
        </Link>
      </div>

      {creators.length === 0 ? (
        <div className="glass-panel p-10 text-center text-slate-500">
          <p className="text-lg font-bold text-slate-900">No registered creators found</p>
          <p className="text-xs font-mono text-slate-600 mt-1">
            Waiting for creator onboardings. Click "+ Add Creator Profile" above to onboard candidates into the network.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {creators.map((c) => (
            <div key={c.id} className="glass-card flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{c.user.name}</h3>
                    <p className="text-xs font-mono font-semibold text-indigo-600">{c.title}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-[11px] font-mono font-bold text-emerald-700">
                    {c.level}
                  </span>
                </div>

                {c.bio && (
                  <p className="mt-3 text-xs text-slate-600 line-clamp-2 font-sans">{c.bio}</p>
                )}

                <div className="mt-4 flex flex-wrap gap-1.5 pt-3 border-t border-slate-200/80">
                  {c.skills.map((cs) => (
                    <span key={cs.id} className="rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-[11px] font-mono text-slate-700">
                      {cs.skill.name}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs font-mono pt-3 border-t border-slate-200/60">
                <span className="font-bold text-slate-900">KSh {c.hourlyRate?.toLocaleString() || "2,500"}/hr</span>
                {c.gitHubUrl && (
                  <a href={c.gitHubUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline flex items-center gap-1">
                    GitHub <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
