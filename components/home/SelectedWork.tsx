import CardProject from "../ui/CardProject"
import Button from "../ui/Button"
import { getPublicProjects } from "@/lib/public-cache"

export default async function SelectedWork() {
  const dataProjects = await getPublicProjects()
    
  return (
    <section className="section section-border" id="selected-work">
      <div className="container">
        <div className="section-header">
          <div>
            <p className="text-label">Work</p>
            <h2 className="section-title">Selected Projects</h2>
          </div>
          <div>
            <Button href="/work">View All Projects</Button>
          </div>
        </div>

        <div className="projects-collection">
          {dataProjects.map((project, indx) => (
            <CardProject
              key={project.id || project.slug}
              id={indx + 1}
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
    </section>
  )
}