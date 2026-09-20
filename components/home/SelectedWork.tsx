import CardProject from "../ui/CardProject";

export default function SelectedWork(){
    const dataProjects=[
        {   id:1,
            title:"Web Application",
            projecttype:"Web Application, FullStack",
            description:"This is a sample project description for Project 1. It showcases the features and technologies used in the project.",
            techStack:["React","TypeScript","Tailwind CSS"],
            link:"https://example.com/project1" 
        },
        {
            id:2,
            title:"Backend API ",
            projecttype:"Web Application / Backend",
            description:"This is a sample project description for Project 2. It highlights the challenges faced and solutions implemented.",
            techStack:["Next.js","Node.js","Express.js"],
            link:"https://example.com/project2"
        },
        {
            id:3,
            title:"SAAS APPLICATION ",
            projecttype:"Web Application, Frontend",
            description:"This is a sample project description for Project 3. It demonstrates the integration of various APIs and services.",
            techStack:["Vue.js","Firebase","Bootstrap"],
            link:"https://example.com/project3"
        }
    ]
    return (
        <>
        <div className="container mt-10">

            <div className="flex  text-muted-foreground text-sm  wrap-normal tracking-wider">02- SELECTED WORK</div>
            {dataProjects.map((project,index)=>{
                return(
                    <CardProject 
                    id={project.id}
                    projecttype={project.projecttype}
                    key={index}
                    title={project.title}
                    description={project.description}
                    techStack={project.techStack}
                    link={project.link}
                    />
                )
            }
            )}

        </div>
        
        </>
    )
}