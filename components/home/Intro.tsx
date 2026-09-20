import TechStack from "./TechStack";



export default function Introduction(){
    
    return(
        <>
        <div className="flex flex-col container justify-between ">
        <div className=" flex w-full  gap-20">
            <div className="flex w-1/2  text-muted-foreground text-sm  wrap-normal tracking-wider">01- Introduction</div>
            
            <div className="flex  flex-col">
                <h3 className="text-5xl">I build digital experiences that sit between design and engineering.</h3>
                <p className="text-sm text-muted-foreground ">I work across frontend, backend and product development — turning ideas into polished, scalable web applications.</p>
            </div>
        </div>
        <TechStack/>

        </div>
        
        


        </>
    )
}