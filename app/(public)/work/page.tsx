import { getPublicProjects } from "@/lib/public-cache"
import CardProject from "@/components/ui/CardProject"

export const revalidate = 120

export default async function WorkPage() {
  const projects = await getPublicProjects()

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

        {/* Showcase using CardProject component */}
        <div className="projects-collection">
          {projects.map((project, idx) => (
            <CardProject
              key={project.id || project.slug}
              id={idx + 1}
              projecttype={project.projecttype}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              techStack={project.techStack}
              link={`/work/${project.slug}`}
              thumbnail={project.thumbnail || project.banner}
            />
          ))}
        </div>
      </div>
    </div>
  )
}