import Link from "next/link"

type ProjectItemProps = {
  index: number
  title: string
  description: string
  techStack: string[]
}

export default function ProjectItem({
  index,
  title,
  description,
  techStack,
}: ProjectItemProps) {
  const number = String(index).padStart(2, "0")

  return (
    <article className="project">
      <div className="project-grid">
        <div className="project-media">
          <div
            style={{
              width: "100%",
              height: "100%",
              background: `linear-gradient(${120 + index * 40}deg, var(--accent) 0%, var(--surface-hover) 100%)`,
            }}
          />
        </div>
        <div className="project-content">
          <p className="project-number">Project {number}</p>
          <h3 className="project-title">{title}</h3>
          <p className="project-description text-small">{description}</p>
          <div className="project-tags">
            {techStack.map((tech) => (
              <span key={tech} className="project-tag">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  )
}