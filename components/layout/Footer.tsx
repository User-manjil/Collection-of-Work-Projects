export default function Footer(){
    return(
       <>
       <footer  className="flex flex-col gap-5 py-10 border-t border-muted-foreground mt-10">
        <div className="container flex justify-between">
        <div className="flex font-medium">Manjil Aryal</div>
        <div className="flex text-muted-foreground text-sm">Full Stack Developer</div>
            <ul className="flex gap-5 text-sm">
                <a href="https://github.com/User-manjil" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a href="https://linkedin.com/in/manjilaryal" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a href="https://twitter.com/manjilaryal" target="_blank" rel="noopener noreferrer">Twitter</a>
                </ul>
        </div>
        
        
       </footer>
       
       </>
    )
}