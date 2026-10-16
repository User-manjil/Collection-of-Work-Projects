"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Save, AlertCircle } from "lucide-react"
import ProjectImageUpload from "@/components/admin/ProjectImageUpload"

export default function NewProjectPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [projecttype, setProjecttype] = useState("Distributed Systems · Full Stack")
  const [description, setDescription] = useState("")
  const [techStackStr, setTechStackStr] = useState("Next.js, TypeScript, Node.js, PostgreSQL")
  const [stats, setStats] = useState("50k evt/sec · 99.98% uptime")
  const [problem, setProblem] = useState("")
  const [architecture, setArchitecture] = useState("")
  const [metrics, setMetrics] = useState("")
  const [liveUrl, setLiveUrl] = useState("")
  const [githubUrl, setGithubUrl] = useState("")
  const [thumbnail, setThumbnail] = useState("")
  const [banner, setBanner] = useState("")
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
      const techStack = techStackStr
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await fetch("/api/projects", {
        method: "POST",
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
          featured: true,
        }),
      })

      const data = await res.json()

      if (data.success) {
        router.push("/admin/projects")
      } else {
        setError(data.error || "Failed to create project")
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
          <Link href="/admin/projects" className="back-link" style={{ marginBottom: "8px" }}>
            <ArrowLeft size={13} />
            <span className="mono-label">PROJECTS DIRECTORY</span>
          </Link>
          <h1 className="admin-page-title">Register New Case Study</h1>
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
            <label className="mono-label label-subtle" htmlFor="proj-title">
              PROJECT TITLE *
            </label>
            <input
              id="proj-title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="e.g. Hyperion Stream Engine"
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="proj-slug">
              URL SLUG *
            </label>
            <input
              id="proj-slug"
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="hyperion-stream-engine"
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-grid-two">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="proj-subtitle">
              SUBTITLE / FOCUS
            </label>
            <input
              id="proj-subtitle"
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Real-Time Telemetry & Cluster Orchestration"
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="proj-type">
              DISCIPLINE / TYPE *
            </label>
            <input
              id="proj-type"
              type="text"
              required
              value={projecttype}
              onChange={(e) => setProjecttype(e.target.value)}
              placeholder="e.g. Distributed Systems · WebGL"
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-grid-two">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="proj-stack">
              TECH STACK (COMMA SEPARATED)
            </label>
            <input
              id="proj-stack"
              type="text"
              value={techStackStr}
              onChange={(e) => setTechStackStr(e.target.value)}
              placeholder="Next.js, TypeScript, Redis, Docker"
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="proj-stats">
              TELEMETRY STATS BADGE
            </label>
            <input
              id="proj-stats"
              type="text"
              value={stats}
              onChange={(e) => setStats(e.target.value)}
              placeholder="e.g. 50k evt/sec · 99.98% uptime"
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
          <label className="mono-label label-subtle" htmlFor="proj-desc">
            PRIMARY SUMMARY *
          </label>
          <textarea
            id="proj-desc"
            required
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="High-level engineering overview of the system, capabilities, and business impact."
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="proj-problem">
            THE PROBLEM & CHALLENGE
          </label>
          <textarea
            id="proj-problem"
            rows={3}
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="What operational bottleneck or technical challenge prompted this project?"
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="proj-arch">
            SYSTEM ARCHITECTURE & IMPLEMENTATION
          </label>
          <textarea
            id="proj-arch"
            rows={4}
            value={architecture}
            onChange={(e) => setArchitecture(e.target.value)}
            placeholder="Key technical decisions, data flow pipelines, microservice topology, and caching layers."
            className="minimal-textarea"
          />
        </div>

        <div className="form-field-group">
          <label className="mono-label label-subtle" htmlFor="proj-metrics">
            VERIFIED METRICS & PRODUCTION IMPACT
          </label>
          <textarea
            id="proj-metrics"
            rows={2}
            value={metrics}
            onChange={(e) => setMetrics(e.target.value)}
            placeholder="Concrete numbers: latency reduction, query throughput, or cost optimizations."
            className="minimal-textarea"
          />
        </div>

        <div className="form-grid-two">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="proj-live">
              LIVE DEPLOYMENT URL
            </label>
            <input
              id="proj-live"
              type="url"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              placeholder="https://example.com"
              className="minimal-input"
            />
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="proj-github">
              GITHUB REPOSITORY URL
            </label>
            <input
              id="proj-github"
              type="url"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              placeholder="https://github.com/User-manjil/..."
              className="minimal-input"
            />
          </div>
        </div>

        <div className="form-action-bar">
          <Link href="/admin/projects" className="admin-secondary-btn">
            Cancel
          </Link>
          <button type="submit" disabled={loading} className="admin-primary-btn">
            <Save size={14} />
            <span>{loading ? "Registering..." : "Save Case Study"}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
