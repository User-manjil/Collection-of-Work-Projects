"use client"

import { useEffect, useState, use } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, Trash2, AlertCircle, Eye } from "lucide-react"
import ProjectImageUpload from "@/components/admin/ProjectImageUpload"

export default function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [projecttype, setProjecttype] = useState("Distributed Systems · Full Stack")
  const [description, setDescription] = useState("")
  const [techStackStr, setTechStackStr] = useState("")
  const [stats, setStats] = useState("")
  const [problem, setProblem] = useState("")
  const [architecture, setArchitecture] = useState("")
  const [metrics, setMetrics] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [banner, setBanner] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`)
        const data = await res.json()
        if (data.success && data.project) {
          const p = data.project
          setTitle(p.title || "")
          setSlug(p.slug || "")
          setSubtitle(p.subtitle || "")
          setProjecttype(p.projecttype || "")
          setDescription(p.description || "")
          setTechStackStr(Array.isArray(p.techStack) ? p.techStack.join(", ") : "")
          setStats(p.stats || "")
          setProblem(p.problem || "")
          setArchitecture(p.architecture || "")
          setMetrics(p.metrics || "")
          setLiveUrl(p.liveUrl || "")
          setGithubUrl(p.githubUrl || "")
          setThumbnail(p.thumbnail || "")
          setBanner(p.banner || "")
        } else {
          setError(data.error || "Project not found")
        }
      } catch {
        setError("Failed to load project from database")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const techStack = techStackStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug,
          subtitle,
          projecttype,
          description,
          techStack,
          stats,
          problem,
          architecture,
          metrics,
          liveUrl,
          githubUrl,
          thumbnail,
          banner,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push("/admin/projects")
      } else {
        setError(data.error || "Failed to update project")
      }
    } catch {
      setError("Network update failure")
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm(`Permanently delete case study "${title}"?`)) return
    try {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (res.ok) {
        router.push("/admin/projects")
      }
    } catch {
      alert("Failed to delete")
    }
  }

  if (loading) {
    return (
      <div className="admin-loading-screen">
        <span className="mono-label">LOADING PROJECT DATA...</span>
      </div>
    )
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <Link href="/admin/projects" className="back-link" style={{ marginBottom: "8px" }}>
            <ArrowLeft size={13} />
            <span className="mono-label">PROJECTS DIRECTORY</span>
          </Link>
          <h1 className="admin-page-title">Edit Case Study: {title}</h1>
        </div>
        <div className="admin-header-actions">
          <Link
            href={`/work/${slug}`}
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
            <label className="mono-label label-subtle" htmlFor="edit-proj-title">
              PROJECT TITLE *
            </label>
            <input
              id="edit-proj-title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-proj-slug">
              URL SLUG *
            </label>
            <input
              id="edit-proj-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-grid-two">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-proj-subtitle">
              SUBTITLE / FOCUS
            </label>
            <input
              id="edit-proj-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-proj-type">
              DISCIPLINE / TYPE *
            </label>
            <input
              id="edit-proj-type"
              type="text"
              required
              value={projecttype}
              onChange={(e) => setProjecttype(e.target.value)}
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-grid-two">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-proj-stack">
              TECH STACK (COMMA SEPARATED)
            </label>
            <input
              id="edit-proj-stack"
              type="text"
              value={techStackStr}
              onChange={(e) => setTechStackStr(e.target.value)}
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-proj-stats">
              TELEMETRY STATS BADGE
            </label>
            <input
              id="edit-proj-stats"
              type="text"
              value={stats}
              onChange={(e) => setStats(e.target.value)}
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-grid-two">
          <ProjectImageUpload
            label="LISTING THUMBNAIL"
            hint="Shown on the work index. Converted to WebP (~960×600) for fast loading."
            variant="thumbnail"
            value={thumbnail}
            onChange={setThumbnail}
          />
          <ProjectImageUpload
            label="CASE STUDY BANNER"
            hint="Hero image on the case study page. Optimized to ~1920×900 WebP."
            variant="banner"
            value={banner}
            onChange={setBanner}
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="edit-proj-desc">
            PRIMARY SUMMARY *
          </label>
          <textarea
            id="edit-proj-desc"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="edit-proj-problem">
            THE PROBLEM & CHALLENGE
          </label>
          <textarea
            id="edit-proj-problem"
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="edit-proj-arch">
            SYSTEM ARCHITECTURE & IMPLEMENTATION
          </label>
          <textarea
            id="edit-proj-arch"
            rows={4}
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="edit-proj-metrics">
            VERIFIED METRICS & PRODUCTION IMPACT
          </label>
          <textarea
            id="edit-proj-metrics"
            rows={2}
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
            className="minimal-textarea"
          />
        </div>

        <div className="form-grid-two">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-proj-live">
              LIVE DEPLOYMENT URL
            </label>
            <input
              id="edit-proj-live"
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="edit-proj-github">
              GITHUB REPOSITORY URL
            </label>
            <input
              id="edit-proj-github"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-action-bar">
          <Link href="/admin/projects" className="admin-secondary-btn">
            Cancel
          </Link>
          <button type="submit" disabled={saving} className="admin-primary-btn">
            <Save size={14} />
            <span>{saving ? "Saving Changes..." : "Update Case Study"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
