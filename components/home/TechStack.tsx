export default function TechStack() {
  const stackCategories = [
    {
      group: "Frontend & 3D",
      skills: ["React", "Next.js", "TypeScript", "Three.js", "WebGL", "Tailwind CSS"],
    },
    {
      group: "Backend & Databases",
      skills: ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "REST / GraphQL"],
    },
    {
      group: "Tools & Cloud",
      skills: ["Docker", "AWS", "Git", "Linux", "Vercel", "CI/CD"],
    },
  ]

  return (
    <div className="tech-matrix">
      <div className="tech-matrix-grid">
        {stackCategories.map((cat) => (
          <div key={cat.group} className="tech-group">
            <h4 className="tech-group-title text-small text-muted">{cat.group}</h4>
            <div className="tech-pill-list">
              {cat.skills.map((skill) => (
                <span key={skill} className="tech-pill">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}