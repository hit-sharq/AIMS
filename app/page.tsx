import Link from "next/link"

export const dynamic = "force-dynamic"

export default function HomePage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center overflow-x-hidden bg-[#f8fafc]">
      {/* 2. THE HERO SECTION (Strictly Centered) */}
      <section className="w-full flex flex-col items-center justify-center text-center pt-32 pb-20 max-w-5xl mx-auto px-4">
        {/* Tagline */}
        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-6">
          ✨ Jitume AIMS · AI-Driven Talent Marketplace
        </div>
        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 w-full text-center leading-[1.1]">
          AI Matchmaker Connecting <br className="hidden sm:inline" /> Demand &amp; Verified Talent.
        </h1>
        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-lg text-slate-600 mt-6 leading-relaxed text-center">
          Jitume AIMS acts as an automated, intelligent middleman. Clients post needs via 10-Second Micro-Intake, Creators list verified skill tags, and AI matches them with 95%+ confidence scoring.
        </p>
        {/* Buttons */}
        <div className="flex flex-row items-center justify-center gap-4 mt-10 w-full">
          <Link
            href="/intake"
            className="px-8 py-4 bg-slate-900 text-white rounded-full font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            Post a Job →
          </Link>
          <Link
            href="/onboarding/creator"
            className="px-8 py-4 bg-white/60 backdrop-blur-md border border-slate-200 text-slate-900 rounded-full font-medium hover:bg-white transition-colors shadow-xs"
          >
            Join as Creator
          </Link>
        </div>
      </section>

      {/* 3. THE 3-STEP GRID (Strictly 3 Columns) */}
      <section className="w-full max-w-6xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-center w-full mb-12 text-slate-900">
          Automated 3-Step Marketplace Engine
        </h2>

        {/* THIS IS THE GRID WRAPPER */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
          {/* Card 1 */}
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-lg rounded-3xl p-8 flex flex-col items-start w-full space-y-3">
            <span className="font-mono text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step 01
            </span>
            <h3 className="text-xl font-bold text-slate-900">1. Client Demand</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Clients post project deliverables via a 10-Second Micro-Intake. The system records an active job and initiates AI scanning.
            </p>
            <div className="pt-2">
              <Link href="/intake" className="text-xs font-mono font-bold text-indigo-600 hover:underline">
                Submit Intake →
              </Link>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-lg rounded-3xl p-8 flex flex-col items-start w-full space-y-3">
            <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Step 02
            </span>
            <h3 className="text-xl font-bold text-slate-900">2. Creator Supply</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Creators complete onboarding with GitHub/portfolio links and skill tags. AI Gateway tags experience levels.
            </p>
            <div className="pt-2">
              <Link href="/onboarding/creator" className="text-xs font-mono font-bold text-emerald-600 hover:underline">
                Onboard Profile →
              </Link>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white/70 backdrop-blur-xl border border-white shadow-lg rounded-3xl p-8 flex flex-col items-start w-full space-y-3">
            <span className="font-mono text-xs font-bold text-purple-600 uppercase tracking-wider">
              Step 03
            </span>
            <h3 className="text-xl font-bold text-slate-900">3. Admin Oversight</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Mission Control operators view the Match Matrix and trigger one-click approval with confidence scores.
            </p>
            <div className="pt-2">
              <Link href="/admin" className="text-xs font-mono font-bold text-purple-600 hover:underline">
                Mission Control →
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
