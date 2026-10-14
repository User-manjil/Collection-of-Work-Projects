"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Eye, Edit2, Trash2, ArrowLeft } from "lucide-react"

interface BlogItem {
  _id?: string
  id?: string
  title: string
  slug: string
  category: string
  readTime: string
  published: boolean
  createdAt: string
  excerpt: string
}

export default function AdminBlogListPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs")
      const data = await res.json()
      if (data.success) {
        setBlogs(data.blogs)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id))
      }
    } catch {
      alert("Failed to delete blog post")
    }
  }

  const handleTogglePublish = async (id: string, current: boolean) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !current }),
      })
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) =>
            (b._id || b.id) === id ? { ...b, published: !current } : b
          )
        )
      }
    } catch {
      alert("Failed to update status")
    }
  }

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.category.toLowerCase().includes(search.toLowerCase()) ||
    b.slug.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <Link href="/admin" className="back-link" style={{ marginBottom: "8px" }}>
            <ArrowLeft size={13} />
            <span className="mono-label">DASHBOARD</span>
          </Link>
          <h1 className="admin-page-title">Blog Articles Directory</h1>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/blog/new" className="admin-primary-btn">
            <Plus size={14} />
            <span>Create New Article</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search by title, slug, or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <span className="mono-label label-subtle">
          SHOWING {filteredBlogs.length} OF {blogs.length} RECORDS
        </span>
      </div>

      {/* Table Panel */}
      <div className="admin-panel-card" style={{ marginTop: "24px" }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ARTICLE</th>
                <th>CATEGORY</th>
                <th>READ TIME</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <span className="mono-label label-subtle">FETCHING ARTICLES...</span>
                  </td>
                </tr>
              ) : filteredBlogs.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <span className="mono-label label-subtle">NO MATCHING ARTICLES FOUND</span>
                  </td>
                </tr>
              ) : (
                filteredBlogs.map((b) => {
                  const id = b._id || b.id || ""
                  return (
                    <tr key={id}>
                      <td className="table-title-cell">
                        <span className="table-item-title">{b.title}</span>
                        <span className="table-item-slug mono-label label-subtle">
                          /{b.slug}
                        </span>
                      </td>
                      <td>
                        <span className="tech-tag-minimal">{b.category}</span>
                      </td>
                      <td>
                        <span className="mono-label label-subtle">{b.readTime}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleTogglePublish(id, b.published)}
                          className={`status-pill-toggle ${
                            b.published ? "published" : "draft"
                          }`}
                        >
                          <span className="status-dot" />
                          <span>{b.published ? "Published" : "Draft"}</span>
                        </button>
                      </td>
                      <td className="table-actions-cell">
                        <Link
                          href={`/blog/${b.slug}`}
                          target="_blank"
                          className="table-action-btn"
                          title="Preview public article"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          href={`/admin/blog/${id}`}
                          className="table-action-btn"
                          title="Edit article"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDelete(id, b.title)}
                          className="table-action-btn delete"
                          title="Delete article"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
