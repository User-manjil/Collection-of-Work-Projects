import TechStack from "@/components/home/TechStack"

export default function About() {
  const skills = [
    {
      title: "Frontend",
      items: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML / CSS"],
    },
    {
      title: "Backend",
      items: ["Node.js", "Express.js", "Python", "REST APIs", "GraphQL"],
    },
    {
      title: "Database",
      items: ["MongoDB", "PostgreSQL", "MySQL", "Firebase", "Redis"],
    },
    {
      title: "Tools & Ops",
      items: ["Git", "Docker", "AWS", "Vercel", "Figma"],
    },
  ]

  return (
    <>
      {/* Hero */}
      <section className="case-study-hero">
        <div className="container">
          <p className="text-label">About</p>
          <h1 className="about-intro" style={{ marginTop: "16px" }}>
            Full-stack web developer with an eye for design
          </h1>
        </div>
      </section>

      {/* Introduction */}
      <section className="section section-border">
        <div className="container">
          <div className="intro-grid">
            <p className="text-label">Introduction</p>
            <div className="intro-body">
              <h2 className="intro-title">
                I combine product thinking, interface design and software
                engineering to build useful digital products.
              </h2>
              <p className="text-body-large copy">
                I work across frontend, backend and product development, with a
                focus on thoughtful interfaces, scalable systems and practical
                solutions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="section section-border">
        <div className="container">
          <p className="text-label" style={{ marginBottom: "48px" }}>
            Skills &amp; Technologies
          </p>
          <div className="skills-grid">
            {skills.map((group) => (
              <div key={group.title} className="skill-group">
                <p className="skill-group-title">{group.title}</p>
                <ul className="skill-list">
                  {group.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Marquee */}
      <section className="section section-border">
        <div className="container">
          <TechStack />
        </div>
      </section>
    </>
  )
}