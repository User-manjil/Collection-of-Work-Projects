import BlogItem from "@/components/blog/BlogItem";

export default function Blog(){
    const blogData=[
        {id:1,
        title:"My Journey as a Full Stack Developer",
        description:"In this blog post, I will share my experiences and insights gained while working as a full stack developer. From the challenges I faced to the lessons I learned, join me on this journey of growth and discovery in the world of web development.",
        date:"June 15, 2023",
        link:"/blog/my-journey-as-a-full-stack-developer"},
        {id:2,
        title:"Building Scalable Web Applications",
        description:"In this article, I will discuss the key principles and best practices for building scalable web applications. From architecture design to performance optimization, learn how to create applications that can handle increasing user demands and traffic.",
        date:"July 10, 2023",
        link:"/blog/building-scalable-web-applications"}
    ];
    return(
        <>
        <section className="section">
        <div className="container ">
            <div className="label text-sm uppercase text-muted">
                Blog
            </div>
            <h1 className="text-hero text-body-larg flex-wrap p">
                   Notes / Articles 
            </h1>
             <div className="label text-sm  text-muted">
                Things I've learned while buidling for web.
            </div>
        </div>
        <div className="container">
            <div className="flex flex-col">
            {blogData.map((item) => (
                <BlogItem
                    key={item.id}
                    title={item.title}
                    
                    date={item.date}
                    link={item.link}
                />
            ))}
        </div>
        </div>
        

        </section>
        
        
        
        
        </>
    )
}