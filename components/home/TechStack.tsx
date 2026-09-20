
export default function TechStack(){
    const dataStack=['React','Next.js','Tailwind CSS','Node.js','Express.js','MongoDB','PostgreSQL','MySQL','Firebase','AWS']
    return (
        <div className="flex gap-10  py-5 border-y border-muted mt-10 flex-wrap">

            {dataStack.map((item,index)=>{
                return(
                    <div key={index} className="flex   text-sm text-muted-foreground">
                       
                        <div>{item}</div>
                    </div>
                )
            })}

        </div>
    )
}