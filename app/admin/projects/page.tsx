"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Plus, Search, Eye, Edit2, Trash2, ArrowLeft } from "lucide-react"

interface ProjectItem {
  _id?: string
  id?: string
  title: string
  slug: string
  subtitle: string
  projecttype: string
  stats: string
  techStack: string[]
  featured: boolean
}

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      const data = await res.json()
      if (data.success) {
        setProjects(data.projects)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Delete case study "${title}"?`)) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => (p._id || p.id) !== id))
      }
    } catch {
      alert("Failed to delete case study")
    }
  }

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.projecttype.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
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
          <h1 className="admin-page-title">Case Studies &amp; Projects</h1>
        </div>
        <div className="admin-header-actions">
          <Link href="/admin/projects/new" className="admin-primary-btn">
            <Plus size={14} />
            <span>Create New Case Study</span>
          </Link>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="admin-filter-bar">
        <div className="search-input-wrap">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search by project name, type, or stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <span className="mono-label label-subtle">
          SHOWING {filtered.length} OF {projects.length} CASE STUDIES
        </span>
      </div>

      {/* Table Panel */}
      <div className="admin-panel-card" style={{ marginTop: "24px" }}>
        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>PROJECT & SUBTITLE</th>
                <th>DISCIPLINE</th>
                <th>METRICS</th>
                <th>STACK</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <span className="mono-label label-subtle">FETCHING CASE STUDIES...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "40px" }}>
                    <span className="mono-label label-subtle">NO CASE STUDIES FOUND</span>
                  </td>
                </tr>
              ) : (
                filtered.map((p) => {
                  const id = p._id || p.id || ""
                  return (
                    <tr key={id}>
                      <td className="table-title-cell">
                        <span className="table-item-title">{p.title}</span>
                        <span className="table-item-slug mono-label label-subtle">
                          /{p.slug}
                        </span>
                      </td>
                      <td>
                        <span className="tech-tag-minimal">{p.projecttype}</span>
                      </td>
                      <td>
                        <span className="mono-label label-subtle">{p.stats || "STABLE"}</span>
                      </td>
                      <td>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {p.techStack.slice(0, 3).map((t) => (
                            <span key={t} className="mono-label label-subtle" style={{ fontSize: "10px" }}>
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="table-actions-cell">
                        <Link
                          href={`/work/${p.slug}`}
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
                          onClick={() => handleDelete(id, p.title)}
                          className="table-action-btn delete"
                          title="Delete case study"
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
