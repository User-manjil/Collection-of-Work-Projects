import ProjectItem from "./ProjectItem";

export default function ProjectGrid(){
    return (
        <>
        
        <div className="w-full">
        <ProjectItem title="Portfolio Website" description="A personal portfolio website built with Next.js, Tailwind CSS, and TypeScript. It showcases my projects, skills, and experience as a full-stack web developer." techStack={["Next.js","Tailwind CSS","TypeScript"]}/>
        <ProjectItem title="E-commerce Platform" description="An e-commerce platform built with React, Node.js, and MongoDB. It allows users to browse products, add items to their cart, and complete purchases securely." techStack={["React","Node.js","MongoDB"]}/>
        <ProjectItem title="Blog Application" description="A blog application built with Django and PostgreSQL. It enables users to create, edit, and delete blog posts, as well as comment on and like posts." techStack={["Django","PostgreSQL"]}/>
        <ProjectItem title="Social Media App" description="A social media application built with Flutter and Firebase. It allows users to create profiles, connect with friends, share posts, and engage with content." techStack={["Flutter","Firebase"]}/>
        

        </div>
        
        
        </>
    )
}