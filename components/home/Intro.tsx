import TechStack from "./TechStack";



export default function Introduction(){
    
    return(
        <>
        <div className="flex flex-col container justify-between ">
        <div className=" flex flex-col sm:flex-row w-full  gap-20">
            <div className="flex w-1/2  text-muted-foreground text-sm  wrap-normal tracking-wider">01- Introduction</div>
            
            <div className="flex  flex-col">
                <h3 className="intro-title">I build digital experiences that sit between design and engineering.</h3>
                <div className="flex mt-2 ">
                <p className="text-base text-muted-foreground copy ">I work across frontend, backend and product development — turning ideas into polished, scalable web applications.</p>
                </div>
                
            </div>
            
        </div>
        <TechStack/>

        </div>
        
        


        </>
    )
}