export default function About(){
    return(
        <>
       <section className="section">
        <div className="container">
            <div className="label text-sm text-muted">
                About
            </div>
            <h1 className="text-hero text-wrap flex-wrap">
                FULLSTACK WEB DEVELOPER with an eye for design
            </h1>
        </div>
       </section>
       <section className="section">
        <div className="container">
            <div className="project-grid">
                <div className="flex-col gap-2">
                    <div className="label">
                        Introduction
                    </div>
                    <p>
                        I combine product thinking, interface design and software engineering to build useful digital products.
                    </p>
                </div>
                <div className="flex">
                    I work across frontend, backend and product development, with a focus on thoughtful interfaces, scalable systems and practical solutions.
                </div>
            </div>
        </div>
       </section>
        
        </>
    )
}