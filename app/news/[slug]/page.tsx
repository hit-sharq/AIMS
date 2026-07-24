export const dynamic = 'force-dynamic'

import { PageWrap } from "@/components/app/Page"
import Link from "next/link"

export default async function NewsDetailPage() {
  return (
    <PageWrap>
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: 16 }}>News Article</h1>
        <p className="muted" style={{ marginBottom: 24 }}>Article content coming soon.</p>
        <Link href="/news" className="btn btn-signal">Back to News</Link>
      </div>
    </PageWrap>
  )
}
