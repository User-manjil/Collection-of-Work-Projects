import Link from "next/link"
import { getProjects } from "@/lib/store"
import { ArrowUpRight, Code2 } from "lucide-react"

export const revalidate = 0

export default async function WorkPage() {
  const projects = await getProjects()

  return (
    <div className="section-spacious">
      <div className="container">
        {/* Header with abundant negative space */}
        <header className="page-header-spacious">
          <p className="text-label">Work</p>
          <h1 className="text-display page-headline">
            Selected Projects
          </h1>
          <p className="page-lead text-muted">
            A collection of web applications, distributed backends, and creative interfaces I&apos;ve designed and built.
          </p>
        </header>

        {/* Minimal Case Study Showcase with Generous Spacing */}
        <div className="work-directory-spacious">
          {projects.map((project, idx) => {
            const num = String(idx + 1).padStart(2, "0")
            return (
              <article key={project.id || project.slug} className="work-card-minimal">
                <div className="work-grid-spacious">
                  {/* Left Media Box */}
                  <div className="work-media-box">
                    <div className="project-preview-card">
                      <div className="preview-card-inner">
                        <Code2 size={36} className="text-muted" />
                        <span className="preview-card-title">{project.title}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Content Column */}
                  <div className="work-content-box">
                    <p className="project-number text-small text-muted">
                      {num} · {project.projecttype}
                    </p>

                    <h2 className="work-card-title">{project.title}</h2>
                    {project.subtitle && (
                      <p className="work-card-subtitle">{project.subtitle}</p>
                    )}

                    <p className="work-card-desc text-muted">{project.description}</p>

                    <div className="work-tags-row">
                      {project.techStack.map((tech) => (
                        <span key={tech} className="project-tag">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="work-action-row">
                      <Link href={`/work/${project.slug}`} className="work-case-link">
                        <span>Read Case Study</span>
                        <ArrowUpRight size={15} />
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}