"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import {
  FileText,
  Briefcase,
  CheckCircle,
  Clock,
  Plus,
  ArrowUpRight,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
} from "lucide-react"

interface BlogItem {
  _id?: string
  id?: string
  title: string
  slug: string
  category: string
  readTime: string
  published: boolean
  createdAt: string
}

interface ProjectItem {
  _id?: string
  id?: string
  title: string
  slug: string
  projecttype: string
  stats: string
  featured: boolean
}

export default function AdminDashboardPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([])
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setRefreshing(true)
      const [blogRes, projRes] = await Promise.all([
        fetch("/api/blogs"),
        fetch("/api/projects"),
      ])
      const blogData = await blogRes.json()
      const projData = await projRes.json()

      if (blogData.success) setBlogs(blogData.blogs)
      if (projData.success) setProjects(projData.projects)
    } catch (e) {
      console.error("Dashboard fetch error:", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleDeleteBlog = async (id: string, title: string) => {
    if (!confirm(`Delete blog post "${title}"?`)) return
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" })
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => (b._id || b.id) !== id))
      }
    } catch {
      alert("Failed to delete blog post")
    }
  }

  const handleDeleteProject = async (id: string, title: string) => {
    if (!confirm(`Delete case study "${title}"?`)) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id))
      }
    } catch {
      alert("Failed to delete project")
    }
  }

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !currentStatus }),
      })
      if (res.ok) {
        setBlogs((prev) =>
          prev.map((b) =>
            (b._id || b.id) === id ? { ...b, published: !currentStatus } : b
          )
        )
      }
    } catch {
      alert("Failed to update status")
    }
  }

  const publishedCount = blogs.filter((b) => b.published).length

  return (
    <div className="admin-page-container">
      {/* Title & Quick Actions */}
      <div className="admin-header-row">
        <div>
          <span className="mono-label label-subtle">EXECUTIVE OVERVIEW</span>
          <h1 className="admin-page-title">Telemetry &amp; Content Ops</h1>
        </div>
        <div className="admin-header-actions">
          <button
            onClick={fetchData}
            disabled={refreshing}
            className="admin-secondary-btn"
            title="Refresh database records"
          >
            <RefreshCw size={14} className={refreshing ? "spin-icon" : ""} />
            <span>Sync</span>
          </button>
          <Link href="/admin/blog/new" className="admin-primary-btn">
            <Plus size={14} />
            <span>New Blog</span>
          </Link>
          <Link href="/admin/projects/new" className="admin-primary-btn">
            <Plus size={14} />
            <span>New Case Study</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="mono-label label-subtle">TOTAL ARTICLES</span>
            <FileText size={16} className="stat-icon" />
          </div>
          <div className="stat-big-val">{loading ? "..." : blogs.length}</div>
          <div className="stat-subtext mono-label">
            {publishedCount} PUBLISHED · {blogs.length - publishedCount} DRAFT
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="mono-label label-subtle">CASE STUDIES</span>
            <Briefcase size={16} className="stat-icon" />
          </div>
          <div className="stat-big-val">{loading ? "..." : projects.length}</div>
          <div className="stat-subtext mono-label">PRODUCTION SYSTEMS</div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="mono-label label-subtle">SYSTEM STATUS</span>
            <CheckCircle size={16} className="stat-icon text-success" />
          </div>
          <div className="stat-big-val">100%</div>
          <div className="stat-subtext mono-label">MONGODB CLUSTER HEALTH</div>
        </div>

        <div className="admin-stat-card">
          <div className="stat-card-header">
            <span className="mono-label label-subtle">DEPLOYED RUNTIME</span>
            <Clock size={16} className="stat-icon" />
          </div>
          <div className="stat-big-val">EDGE</div>
          <div className="stat-subtext mono-label">TURBOPACK // NEXT 16</div>
        </div>
      </div>

      {/* Content Management Tables */}
      <div className="admin-sections-split">
        {/* Recent Blogs Table */}
        <section className="admin-panel-card">
          <div className="panel-card-header">
            <div>
              <span className="mono-label label-subtle">PUBLICATIONS</span>
              <h2 className="panel-card-title">Recent Blog Entries</h2>
            </div>
            <Link href="/admin/blog" className="panel-view-all mono-label">
              VIEW ALL ({blogs.length}) →
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>TITLE</th>
                  <th>CATEGORY</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {blogs.slice(0, 5).map((post) => {
                  const id = post._id || post.id || ""
                  return (
                    <tr key={id}>
                      <td className="table-title-cell">
                        <span className="table-item-title">{post.title}</span>
                        <span className="table-item-slug mono-label label-subtle">
                          /{post.slug}
                        </span>
                      </td>
                      <td>
                        <span className="tech-tag-minimal">{post.category}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleTogglePublish(id, post.published)}
                          className={`status-pill-toggle ${
                            post.published ? "published" : "draft"
                          }`}
                          title="Click to toggle published status"
                        >
                          <span className="status-dot" />
                          <span>{post.published ? "Published" : "Draft"}</span>
                        </button>
                      </td>
                      <td className="table-actions-cell">
                        <Link
                          href={`/blog/${post.slug}`}
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
                          onClick={() => handleDeleteBlog(id, post.title)}
                          className="table-action-btn delete"
                          title="Delete article"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Case Studies Table */}
        <section className="admin-panel-card" style={{ marginTop: "32px" }}>
          <div className="panel-card-header">
            <div>
              <span className="mono-label label-subtle">CASE STUDIES</span>
              <h2 className="panel-card-title">Engineered Case Studies</h2>
            </div>
            <Link href="/admin/projects" className="panel-view-all mono-label">
              VIEW ALL ({projects.length}) →
            </Link>
          </div>

          <div className="admin-table-wrapper">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>PROJECT</th>
                  <th>TYPE</th>
                  <th>METRICS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((proj) => {
                  const id = proj._id || proj.id || ""
                  return (
                    <tr key={id}>
                      <td className="table-title-cell">
                        <span className="table-item-title">{proj.title}</span>
                        <span className="table-item-slug mono-label label-subtle">
                          /{proj.slug}
                        </span>
                      </td>
                      <td>
                        <span className="tech-tag-minimal">{proj.projecttype}</span>
                      </td>
                      <td>
                        <span className="mono-label text-muted">{proj.stats || "STABLE"}</span>
                      </td>
                      <td className="table-actions-cell">
                        <Link
                          href={`/work/${proj.slug}`}
                          target="_blank"
                          className="table-action-btn"
                          title="Preview public case study"
                        >
                          <Eye size={14} />
                        </Link>
                        <Link
                          href={`/admin/projects/${id}`}
                          className="table-action-btn"
                          title="Edit case study"
                        >
                          <Edit2 size={14} />
                        </Link>
                        <button
                          onClick={() => handleDeleteProject(id, proj.title)}
                          className="table-action-btn delete"
                          title="Delete case study"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}