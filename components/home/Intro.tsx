import TechStack from "./TechStack"
import { Cpu, Layers, ShieldCheck } from "lucide-react"

export default function Introduction() {
  const pillars = [
    {
      icon: Cpu,
      title: "Backend & Systems",
      description:
        "Designing robust APIs, distributed microservices, and database schemas built for concurrency, safety, and scale.",
    },
    {
      icon: Layers,
      title: "Frontend & Interfaces",
      description:
        "Developing fluid user experiences with React, TypeScript, and Three.js spatial interactions without unnecessary bloat.",
    },
    {
      icon: ShieldCheck,
      title: "End-to-End Delivery",
      description:
        "Managing the complete lifecycle: architectural design, clean code, automated testing, and reliable cloud deployments.",
    },
  ]

  return (
    <section className="section section-border" id="introduction">
      <div className="container">
        <div className="intro-grid">
          <div>
            <p className="text-label">About</p>
          </div>

          <div className="intro-body">
            <h2 className="intro-title">
              Bridging design and engineering to build fast, reliable web software.
            </h2>
            <p className="text-body-large copy">
              I work across frontend, backend, and product development — turning
              complex requirements into polished, intuitive digital experiences.
            </p>

            {/* 3 Pillars Grid */}
            <div className="pillars-grid">
              {pillars.map((pillar) => {
                const IconComponent = pillar.icon
                return (
                  <div key={pillar.title} className="pillar-card">
                    <div className="pillar-header">
                      <IconComponent size={20} className="pillar-icon" />
                    </div>
                    <h3 className="pillar-title">{pillar.title}</h3>
                    <p className="pillar-desc">{pillar.description}</p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <TechStack />
      </div>
    </section>
  )
}