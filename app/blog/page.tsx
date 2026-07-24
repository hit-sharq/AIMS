export const dynamic = 'force-dynamic'

import { PageHead, PageWrap } from "@/components/app/Page"

export default async function BlogPage() {
  return (
    <PageWrap>
      <PageHead eyebrow="Blog" title="Insights & Articles" desc="Articles on AI talent matching and marketplace design." />
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <p className="muted">Blog posts coming soon.</p>
      </div>
    </PageWrap>
  )
}
