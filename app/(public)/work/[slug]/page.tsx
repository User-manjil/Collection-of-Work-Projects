import Link from "next/link"
import { notFound } from "next/navigation"
import { getPublicProjectBySlug } from "@/lib/public-cache"
import { ArrowLeft, ArrowUpRight, Code2, ExternalLink, CheckCircle2 } from "lucide-react"
import ProjectCoverImage from "@/components/ui/ProjectCoverImage"

export const revalidate = 120

export default async function CaseStudyDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = await getPublicProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <article className="section-spacious">
      <div className="container-content">
        {/* Back Link with abundant breathing space */}
        <div className="article-back-nav">
          <Link href="/work" className="back-link">
            <ArrowLeft size={15} />
            <span>Back to projects</span>
          </Link>
        </div>

        {(project.banner || project.thumbnail) && (
          <div className="case-study-banner-wrap">
            <ProjectCoverImage
              src={project.banner || project.thumbnail}
              alt={`${project.title} banner`}
              title={project.title}
              priority
              sizes="100vw"
              className="case-study-banner-frame"
            />
          </div>
        )}

        {/* Case Study Header */}
        <header className="case-study-header-spacious">
          <p className="text-label" style={{ marginBottom: "16px" }}>{project.projecttype}</p>

          <h1 className="case-study-headline-large">{project.title}</h1>
          {project.subtitle && (
            <p className="case-study-lead-text">{project.subtitle}</p>
          )}

          {/* Action Links & Tech Stack */}
          <div className="case-study-meta-bar">
            <div className="case-study-tags">
              {project.techStack.map((tech) => (
                <span key={tech} className="project-tag">
                  {tech}
                </span>
              ))}
            </div>

            <div className="case-study-links">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-btn"
                >
                  <span>Live Demo</span>
                  <ExternalLink size={14} />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="case-study-btn-secondary"
                >
                  <Code2 size={14} />
                  <span>GitHub</span>
                </a>
              )}
            </div>
          </div>
        </header>

        {/* Overview Box */}
        <div className="case-study-overview-box">
          <p className="text-body-large">{project.description}</p>
        </div>

        {/* Detailed Sections with High Negative Space */}
        <div className="case-study-sections-flow">
          {/* Section 1: The Problem & Objective */}
          {project.problem && (
            <section className="case-section-item">
              <h2 className="case-section-title">The Challenge</h2>
              <p className="case-section-text">{project.problem}</p>
            </section>
          )}

          {/* Section 2: Architecture & Implementation */}
          {project.architecture && (
            <section className="case-section-item">
              <h2 className="case-section-title">Architecture &amp; Solutions</h2>
              <p className="case-section-text">{project.architecture}</p>
            </section>
          )}

          {/* Section 3: Verified Results & Metrics */}
          {project.metrics && (
            <section className="case-section-item">
              <h2 className="case-section-title">Results &amp; Impact</h2>
              <div className="metrics-highlight-card">
                <CheckCircle2 size={20} className="metrics-icon" />
                <p className="metrics-text">{project.metrics}</p>
              </div>
            </section>
          )}
        </div>

        {/* Footer Contact Callout */}
        <footer className="case-study-footer-spacious">
          <div className="case-footer-box">
            <div>
              <h3 className="case-footer-title">Need a similar solution?</h3>
              <p className="case-footer-lead text-muted">
                I&apos;m open for new projects and collaborations.
              </p>
            </div>
            <div>
              <Link href="/contact" className="case-footer-btn">
                <span>Start a conversation</span>
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </article>
  )
}
