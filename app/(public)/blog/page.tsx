import Link from "next/link"
import { getBlogs } from "@/lib/store"
import { ArrowUpRight } from "lucide-react"

export const revalidate = 0

export default async function BlogPage() {
  const blogs = await getBlogs(true)

  return (
    <div className="section-spacious">
      <div className="container-reading">
        {/* Minimal Hero Header with generous negative space */}
        <header className="page-header-spacious">
          <p className="text-label">Blog</p>
          <h1 className="text-display page-headline">
            Articles &amp; Notes
          </h1>
          <p className="page-lead text-muted">
            Thoughts on building software, web performance, and modern web technologies.
          </p>
        </header>

        {/* Minimal Blog Directory List */}
        <div className="blog-directory-spacious">
          {blogs.length === 0 ? (
            <div className="empty-state">
              <p className="text-muted text-small">No articles published yet.</p>
            </div>
          ) : (
            blogs.map((post) => (
              <article key={post.id || post.slug} className="blog-row-minimal">
                <Link href={`/blog/${post.slug}`} className="blog-link-wrapper">
                  <div className="blog-meta-minimal">
                    <span className="text-small text-muted">
                      {new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                    <span className="meta-dot">·</span>
                    <span className="text-small text-muted">{post.category}</span>
                    <span className="meta-dot">·</span>
                    <span className="text-small text-muted">{post.readTime}</span>
                  </div>

                  <div className="blog-title-row">
                    <h2 className="blog-title-minimal">{post.title}</h2>
                    <div className="blog-arrow-cue">
                      <ArrowUpRight size={18} />
                    </div>
                  </div>

                  <p className="blog-excerpt-minimal text-muted">{post.excerpt}</p>
                </Link>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  )
}