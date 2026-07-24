import Link from "next/link"
import { BrandMark } from "@/components/app/Header"

export default function Footer() {
  return (
    <footer className="w-full bg-[#f8fafc] border-t border-slate-200/80 pt-16 pb-12 font-sans">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* Col 1: Brand */}
        <div className="col-span-2 md:col-span-1 space-y-4">
          <BrandMark />
          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Jitume AIMS is an AI-Driven Talent Marketplace connecting high-value client project demand with verified creator supply.
          </p>
        </div>

        {/* Col 2: Client Portal */}
        <div className="space-y-3">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            Client Portal
          </h5>
          <ul className="space-y-2 text-xs font-sans text-slate-600">
            <li>
              <Link href="/intake" className="hover:text-indigo-600 transition">
                Post a Job
              </Link>
            </li>
            <li>
              <Link href="/dashboard/projects" className="hover:text-indigo-600 transition">
                Active Requests
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 3: Creator Network */}
        <div className="space-y-3">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            Creator Network
          </h5>
          <ul className="space-y-2 text-xs font-sans text-slate-600">
            <li>
              <Link href="/onboarding/creator" className="hover:text-indigo-600 transition">
                Join as Creator
              </Link>
            </li>
            <li>
              <Link href="/dashboard/projects" className="hover:text-indigo-600 transition">
                Matched Jobs
              </Link>
            </li>
            <li>
              <Link href="/dashboard/contracts" className="hover:text-indigo-600 transition">
                Active Contracts
              </Link>
            </li>
          </ul>
        </div>

        {/* Col 4: Admin Oversight */}
        <div className="space-y-3">
          <h5 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
            Admin Oversight
          </h5>
          <ul className="space-y-2 text-xs font-sans text-slate-600">
            <li>
              <Link href="/admin" className="hover:text-indigo-600 transition">
                Match Matrix
              </Link>
            </li>
            <li>
              <Link href="/admin/jobs" className="hover:text-indigo-600 transition">
                All Jobs
              </Link>
            </li>
            <li>
              <Link href="/admin/creators" className="hover:text-indigo-600 transition">
                All Creators
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 pt-6 border-t border-slate-200/60 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-slate-500 gap-4">
        <span>© {new Date().getFullYear()} Jitume AIMS. All rights reserved.</span>
        <span>AI-Driven Talent Marketplace Engine</span>
      </div>
    </footer>
  )
}
