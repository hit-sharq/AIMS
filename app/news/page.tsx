export const dynamic = 'force-dynamic'

import { PageHead, PageWrap } from "@/components/app/Page"
import "@/components/app/blog.css"

export default async function NewsPage() {
  const posts: any[] = []

  return (
    <PageWrap>
      <PageHead eyebrow="News" title="News & Press" desc="Latest updates, announcements, and news from Jitume AIMS." />
      <div className="blog-grid">
        {posts.length === 0 && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: 60 }}>
            <p className="muted">No news posts published yet.</p>
          </div>
        )}
      </div>
    </PageWrap>
  )
}
