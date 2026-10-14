"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"

export default function NewBlogPostPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("DISTRIBUTED SYSTEMS")
  const [readTime, setReadTime] = useState("5 min read")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleTitleChange = (val: string) => {
    setTitle(val)
    const generated = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "")
    setSlug(generated)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          category,
          readTime,
          excerpt,
          content,
          published,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push("/admin/blog")
      } else {
        setError(data.error || "Failed to create article")
      }
    } catch {
      setError("Server connection failure")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page-container">
      {/* Back Link */}
      <div className="admin-header-row">
        <div>
          <Link href="/admin/blog" className="back-link" style={{ marginBottom: "8px" }}>
            <ArrowLeft size={13} />
            <span className="mono-label">BLOG ARCHIVE</span>
          </Link>
          <h1 className="admin-page-title">Draft New Technical Essay</h1>
        </div>
      </div>

      {error && (
        <div className="login-error-banner" style={{ marginBlock: "16px" }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="admin-form-panel">
        <div className="form-grid-two">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="blog-title">
              ARTICLE TITLE *
            </label>
            <input
              id="blog-title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Architecting Zero-Drift Distributed Consensus"
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="blog-slug">
              URL SLUG *
            </label>
            <input
              id="blog-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="architecting-zero-drift"
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-grid-three">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="blog-category">
              CATEGORY / DISCIPLINE
            </label>
            <select
              id="blog-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="minimal-select"
            >
              <option value="DISTRIBUTED SYSTEMS">DISTRIBUTED SYSTEMS</option>
              <option value="CREATIVE WEBGL">CREATIVE WEBGL</option>
              <option value="DESIGN PHILOSOPHY">DESIGN PHILOSOPHY</option>
              <option value="PERFORMANCE">PERFORMANCE & NETWORKING</option>
              <option value="FULL-STACK">FULL-STACK ARCHITECTURE</option>
            </select>
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="blog-readtime">
              READING TIME
            </label>
            <input
              id="blog-readtime"
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
              placeholder="5 min read"
              className="minimal-input"
            />
          </div>

          <div className="form-field-group" style={{ justifyContent: "center" }}>
            <label className="checkbox-label" style={{ marginTop: "24px" }}>
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="minimal-checkbox"
              />
              <span className="mono-label">PUBLISH IMMEDIATELY</span>
            </label>
          </div>
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="blog-excerpt">
            SUMMARY / EXCERPT *
          </label>
          <textarea
            id="blog-excerpt"
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            placeholder="A crisp 1-2 sentence technical premise for the article listing."
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="blog-content">
            ARTICLE BODY (MARKDOWN SUPPORTED) *
          </label>
          <textarea
            id="blog-content"
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write essay markdown here: use ### for subheadings, ```typescript for code blocks, and > for quotes..."
            className="minimal-textarea code-font"
          />
        </div>

        <div className="form-action-bar">
          <Link href="/admin/blog" className="admin-secondary-btn">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="admin-primary-btn">
            <Save size={14} />
            <span>{loading ? "Publishing..." : "Save & Publish Article"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
