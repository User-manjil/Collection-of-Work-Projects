export default function BlogItem({title,date,link}:{title:string,date:string,link:string}){
    return(
        <div className="flex flex-col gap-2 p-5 border-b border-muted">
            <h2 className="text-xl font-bold">{title}</h2>
            {/* <p className="text-muted">{description}</p> */}
            <div className="flex justify-between items-center">
                <span className="text-sm text-muted">{date}</span>
                <a href={link} className="text-sm text-primary hover:underline">
                    Read more
                </a>
            </div>
        </div>
    )
}