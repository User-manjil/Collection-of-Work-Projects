export default function ProjectItem({title,description,techStack}:{title:string,description:string,techStack:string[];}){
    return (
        <>
        <div className=" flex py-10 gap-5 w-full border-muted border-b">
            <div className="flex w-full ">
            <h3 className="text-[23px]">{title}</h3>
         {/* <p className="text-muted">{description}</p> */}
            </div>

        <div className="flex  text-sm text-muted gap-2">
         {techStack.map((tech:string)=>(
            <span key={tech}>{tech}</span>
        ))}
        </div>
        </div>
        </>
    )
}