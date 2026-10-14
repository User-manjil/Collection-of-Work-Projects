import CardProject from "../ui/CardProject"
import Button from "../ui/Button"

export default function SelectedWork() {
  const dataProjects = [
    {
      id: 1,
      slug: "apex-telemetry-engine",
      title: "Apex Engine",
      subtitle: "Realtime Telemetry & Stream Processing",
      projecttype: "Distributed Systems · Full Stack",
      description:
        "High-performance telemetry platform ingesting 50k+ metrics/sec. Features real-time WebSocket state synchronization, interactive spatial charts, and sub-millisecond query pipelines.",
      techStack: ["Next.js", "TypeScript", "Three.js", "Redis", "PostgreSQL"],
      link: "/work/apex-telemetry-engine",
    },
    {
      id: 2,
      slug: "kroma-audio-visual-studio",
      title: "Kroma Studio",
      subtitle: "Parametric Audio-Visual Synthesis Canvas",
      projecttype: "Creative Computing · WebGL",
      description:
        "Hardware-accelerated browser workstation coupling the Web Audio API with real-time GLSL fragment shaders. Supports dynamic frequency modulation and preset exports.",
      techStack: ["React", "Three.js", "WebGL", "Web Audio API", "Tailwind CSS"],
      link: "/work/kroma-audio-visual-studio",
    },
    {
      id: 3,
      slug: "voxel-distributed-store",
      title: "Voxel Data Store",
      subtitle: "Distributed Document Store & Query Explorer",
      projecttype: "Backend Architecture · Database",
      description:
        "Low-latency document store explorer with visual query explain plans, automated sharding simulation, and Raft consensus cluster diagnostics.",
      techStack: ["Node.js", "MongoDB", "Express", "Docker", "TypeScript"],
      link: "/work/voxel-distributed-store",
    },
  ]

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
          {dataProjects.map((project) => (
            <CardProject
              key={project.id}
              id={project.id}
              projecttype={project.projecttype}
              title={project.title}
              subtitle={project.subtitle}
              description={project.description}
              techStack={project.techStack}
              link={project.link}
            />
          ))}
        </div>
      </div>
    </section>
  )
}