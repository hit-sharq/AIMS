export const dynamic = 'force-dynamic'

import { PageHead, PageWrap } from "@/components/app/Page"

export default async function CareersPage() {
  return (
    <PageWrap>
      <PageHead eyebrow="Careers" title="Join Jitume AIMS" desc="Open roles at Jitume AIMS." />
      <div style={{ padding: "60px 0", textAlign: "center" }}>
        <p className="muted">No open career positions at this time.</p>
      </div>
    </PageWrap>
  )
}
