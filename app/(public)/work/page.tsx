import ProjectGrid from "@/components/work/ProjectGrid";

export default function work(){
    return(
        <section className="section">
            
            <div className="container">
                <div className="flex flex-col">
                    <p className="text-xs text-muted">WORK</p>
                    <h2 className="article-title">Selected Work</h2>
                    <p className="text-sm text-muted">Projects I've designed, engineered and shipped.</p>
                </div>
                <div className="flex mt-10">
                     <ProjectGrid/>
                </div>
               
                
                
                
                
            </div>
           
        </section>

    )
}