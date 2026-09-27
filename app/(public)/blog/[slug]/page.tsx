"use client"
import {usePathname} from "next/navigation";
export default function Blog(){
    
    const path = usePathname();
    const slug = path.split('/').pop();
    return(
        <>
        <section className="section">
            <div className="container">
               <h1 className="blog-title uppercase">{slug?.split('-').join(' ')}</h1>
                <p className="article-header">
                    Lorem ipsum dolor sit amet, consectetur
                     adipisicing elit. Enim, error itaque cupiditate, doloribus iusto sunt nam veritatis aliquam rerum esse sed dolor eligendi.
                     Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, laudantium repellendus. Doloremque modi exercitationem, nemo atque minima assumenda quam reiciendis pariatur quod eos numquam nulla. Perferendis, quidem assumenda maiores fuga architecto perspiciatis explicabo cumque sapiente quos est exercitationem placeat corporis saepe illum facere atque sit voluptate ad nesciunt soluta natus?
                     Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi adipisci libero ex dicta, porro, accusamus accusantium iure nesciunt pariatur, natus officiis eveniet ea id non voluptatem vitae similique aut eligendi? Eum cum id, ut molestiae fuga ullam vel! Repellat expedita quisquam fugiat quas delectus odit provident maiores dignissimos explicabo alias!
                     
                     </p>
            </div>
        </section>
      
        </>
    )
}