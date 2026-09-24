import TechStack from "@/components/home/TechStack";

export default function About(){
    return(
        <>
       <section className="section">
        <div className="container ">
            <div className="label text-sm uppercase text-muted">
                About
            </div>
            <h1 className="text-hero text-body-larg flex-wrap p">
                FULL-stack web developer with an eye for design
            </h1>
        </div>
       </section>
       <section className="section">
        <div className="container">
            <div className="flex justify-between">
                <div className="flex w-1/2 flex-col gap-2">
                    <div className="label">
                        <p className="text-muted text-sm uppercase">Introduction</p>
                    </div>
                    <p className="text-2xl font-medium">
                        I combine product thinking, interface design and software engineering to build useful digital products.
                    </p>
                </div>
                <div className="flex p-2 w-2/4 text-sm  text-muted">
                    I work across frontend, backend and product development, with a focus on thoughtful interfaces, scalable systems and practical solutions.
                </div>
            </div>
        </div>
       </section>
       <section className="section">
        <div className="container">
        <div className="label">
                <p className="text-muted text-sm uppercase">Skills</p>
                </div>   
         <TechStack/>
        </div>
       
       </section>
        
        </>
    )
}