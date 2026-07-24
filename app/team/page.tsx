export const dynamic = 'force-dynamic'

import { PageHead, PageWrap } from "@/components/app/Page"

const CORE_TEAM = [
  { name: "Sharlmon Musundi", role: "AI Systems Architect & Founder", bio: "Leading AI-driven talent matchmaking algorithms and multi-agent systems." },
  { name: "Jitume Tech Committee", role: "Operator Oversight", bio: "Admin committee managing supply and demand verification." },
]

export default async function TeamPage() {
  return (
    <PageWrap>
      <PageHead eyebrow="Team" title="Our Team" desc="The engineers and operators building Jitume AIMS." />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 my-8">
        {CORE_TEAM.map((member, idx) => (
          <div key={idx} className="glass-card p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">{member.name}</h3>
              <p className="text-xs font-mono font-semibold text-indigo-600 mb-2">{member.role}</p>
              <p className="text-xs text-slate-600">{member.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </PageWrap>
  )
}
