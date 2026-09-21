import Button from "./Button";

export default function CardProject({id,title,description,projecttype,techStack,link}:{id:number,title:string,description:string,projecttype :string,techStack:string[],link:string}){
    return(
        <div className={`flex flex-col sm:flex-row ${id % 2==0 ? 'sm:flex-row-reverse':'' }  gap-10  sm:gap-50 border-b border-muted-foreground  px-5 py-10 `}>

            <div className="flex sm:w-3/4 ">
                <div className="flex w-full h-100 bg-foreground"></div>
            </div>
            <div className="flex flex-col w-1/2 justify-center gap-2">
                <h2 className="text-xs text-muted-foreground uppercase">Project {id}  • {projecttype}</h2>
                 <h3 className="text-2xl font-bold">{title}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
                <p className="text-sm underline text-accent">Link: <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:underline">
                    {link}
                </a></p>
                
                <div className="flex flex-wrap gap-1">
                {techStack.map((tech, index) => (
                    <span key={index} className="text-xs text-muted uppercase  px-2 py-1 rounded-md">
                        {tech}
                    </span>
                ))}
            </div>
            <Button className="button w-fit"  >CASE STUDY</Button>

            </div>
            
           
            
        </div>
    )
}