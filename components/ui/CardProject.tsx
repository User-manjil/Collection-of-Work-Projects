import Link from "next/link"
import Button from "./Button"
import ProjectCoverImage from "./ProjectCoverImage"

type CardProjectProps = {
  id: number
  title: string
  subtitle?: string
  description: string
  projecttype: string
  techStack: string[]
  link: string
  thumbnail?: string
}

export default function CardProject({
  id,
  title,
  subtitle,
  description,
  projecttype,
  techStack,
  link,
  thumbnail,
}: CardProjectProps) {
  const number = String(id).padStart(2, "0")
  const isReversed = id % 2 === 0

  return (
    <article className="project-editorial">
      <div
        className="project-grid"
        style={isReversed ? { direction: "rtl" } : undefined}
      >
        {/* Visual Box */}
        <div className="project-media-container" style={{ direction: "ltr" }}>
          <Link href={link} className="project-media-link" aria-label={`View case study for ${title}`}>
            <ProjectCoverImage
              src={thumbnail}
              alt={`${title} preview`}
              title={title}
              sizes="(max-width: 768px) 100vw, 540px"
            />
          </Link>
        </div>

        {/* Content */}
        <div className="project-content-editorial" style={{ direction: "ltr" }}>
          <p className="project-number text-small text-muted">
            {number} · {projecttype}
          </p>

          <h3 className="project-title">{title}</h3>
          {subtitle && <p className="project-subtitle text-muted">{subtitle}</p>}

          <p className="project-description text-small">{description}</p>

          <div className="project-tags">
            {techStack.map((tech) => (
              <span key={tech} className="project-tag">
                {tech}
              </span>
            ))}
          </div>

          <div style={{ marginTop: "24px" }}>
            <Button href={link}>Case Study</Button>
          </div>
        </div>
      </div>
    </article>
  )
}