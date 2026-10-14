"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, AlertCircle, Eye } from "lucide-react"

export default function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("DISTRIBUTED SYSTEMS")
  const [readTime, setReadTime] = useState("5 min read")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [published, setPublished] = useState(true)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blogs/${id}`)
        const data = await res.json()
        if (data.success && data.blog) {
          const b = data.blog
          setTitle(b.title || "")
          setSlug(b.slug || "")
          setCategory(b.category || "DISTRIBUTED SYSTEMS")
          setReadTime(b.readTime || "5 min read")
          setExcerpt(b.excerpt || "")
          setContent(b.content || "")
          setPublished(Boolean(b.published))
        } else {
          setError(data.error || "Blog post not found")
        }
      } catch {
        setError("Failed to load article from database")
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
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
        setError(data.error || "Failed to update article")
      }
    } catch {
      setError("Network update failure")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Permanently delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/admin/blog")
      }
    } catch {
      alert("Failed to delete")
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <span className="mono-label">LOADING ARTICLE DATA...</span>
      </div>
    )
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <Link href="/admin/blog" className="back-link" style={{ marginBottom: "8px" }}>
            <ArrowLeft size={13} />
            <span className="mono-label">BLOG ARCHIVE</span>
          </Link>
          <h1 className="admin-page-title">Edit Article: {title}</h1>
        </div>
        <div className="admin-header-actions">
          <Link
            href={`/blog/${slug}`}
            target="_blank"
            className="admin-secondary-btn"
          >
            <Eye size={14} />
            <span>Public Preview</span>
          </Link>
          <button onClick={handleDelete} className="admin-danger-btn">
            <Trash2 size={14} />
            <span>Delete</span>
          </button>
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
            <label className="mono-label label-subtle" htmlFor="edit-title">
              ARTICLE TITLE *
            </label>
            <input
              id="edit-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-slug">
              URL SLUG *
            </label>
            <input
              id="edit-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-grid-three">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-category">
              CATEGORY / DISCIPLINE
            </label>
            <select
              id="edit-category"
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
            <label className="mono-label label-subtle" htmlFor="edit-readtime">
              READING TIME
            </label>
            <input
              id="edit-readtime"
              type="text"
              value={readTime}
              onChange={(e) => setReadTime(e.target.value)}
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
              <span className="mono-label">PUBLISHED</span>
            </label>
          </div>
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="edit-excerpt">
            SUMMARY / EXCERPT *
          </label>
          <textarea
            id="edit-excerpt"
            required
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="edit-content">
            ARTICLE BODY (MARKDOWN SUPPORTED) *
          </label>
          <textarea
            id="edit-content"
            required
            rows={14}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="minimal-textarea code-font"
          />
        </div>

        <div className="form-action-bar">
          <Link href="/admin/blog" className="admin-secondary-btn">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="admin-primary-btn">
            <Save size={14} />
            <span>{saving ? "Saving Changes..." : "Update Article"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
