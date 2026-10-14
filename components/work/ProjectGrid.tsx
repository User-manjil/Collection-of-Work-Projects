import ProjectItem from "./ProjectItem"

const projects = [
  {
    title: "Portfolio Website",
    description:
      "A personal portfolio website built with Next.js, Tailwind CSS, and TypeScript. It showcases my projects, skills, and experience as a full-stack web developer.",
    techStack: ["Next.js", "Tailwind CSS", "TypeScript"],
  },
  {
    title: "E-commerce Platform",
    description:
      "An e-commerce platform built with React, Node.js, and MongoDB. It allows users to browse products, add items to their cart, and complete purchases securely.",
    techStack: ["React", "Node.js", "MongoDB"],
  },
  {
    title: "Blog Application",
    description:
      "A blog application built with Django and PostgreSQL. It enables users to create, edit, and delete blog posts, as well as comment on and like posts.",
    techStack: ["Django", "PostgreSQL"],
  },
  {
    title: "Social Media App",
    description:
      "A social media application built with Flutter and Firebase. It allows users to create profiles, connect with friends, share posts, and engage with content.",
    techStack: ["Flutter", "Firebase"],
  },
]

export default function ProjectGrid() {
  return (
    <div>
      {projects.map((project, index) => (
        <ProjectItem
          key={project.title}
          index={index + 1}
          title={project.title}
          description={project.description}
          techStack={project.techStack}
        />
      ))}
    </div>
  )
}