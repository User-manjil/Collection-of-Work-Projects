"use client"

import Image from "next/image";
import {usePathname} from "next/navigation";
export default function Blog(){
    
    const path = usePathname();
    const slug = path.split('/').pop();
    return(
        <>
        <section className="case-study-section">
            
            <div className="container flex flex-col justify-center  items-center">
                <header className="article-header items-center">
               <h1 className="article-title uppercase ">{slug?.split('-').join(' ')}</h1>
               </header>
               
               
               {/* <Image  width={1170} height={780} alt="blog"
               src='https://picsum.photos/200/300'
               /> */}

               <article className="article-content">
                 <p className=" article-content text-justify ">
                    Lorem ipsum dolor sit amet, consectetur
                    adipisicing elit. Enim, error itaque cupiditate, doloribus iusto sunt nam veritatis aliquam rerum esse sed dolor eligendi.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, laudantium repellendus. Doloremque modi exercitationem, nemo atque minima assumenda quam reiciendis pariatur quod eos numquam nulla. Perferendis, quidem assumenda maiores fuga architecto perspiciatis explicabo cumque sapiente quos est exercitationem placeat corporis saepe illum facere atque sit voluptate ad nesciunt soluta natus?
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi adipisci libero ex dicta, porro, accusamus accusantium iure nesciunt pariatur, natus officiis eveniet ea id non voluptatem vitae similique aut eligendi? Eum cum id, ut molestiae fuga ullam vel! Repellat expedita quisquam fugiat quas delectus odit provident maiores dignissimos explicabo alias!
                     
                     this is the world
                     </p>

                     <h2 className="sub-heading">this is subheading</h2>
                        <p className=" article-content text-justify ">
                    Lorem ipsum dolor sit amet, consectetur
                    adipisicing elit. Enim, error itaque cupiditate, doloribus iusto sunt nam veritatis aliquam rerum esse sed dolor eligendi.
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Distinctio, laudantium repellendus. Doloremque modi exercitationem, nemo atque minima assumenda quam reiciendis pariatur quod eos numquam nulla. Perferendis, quidem assumenda maiores fuga architecto perspiciatis explicabo cumque sapiente quos est exercitationem placeat corporis saepe illum facere atque sit voluptate ad nesciunt soluta natus?
                    Lorem, ipsum dolor sit amet consectetur adipisicing elit. Quasi adipisci libero ex dicta, porro, accusamus accusantium iure nesciunt pariatur, natus officiis eveniet ea id non voluptatem vitae similique aut eligendi? Eum cum id, ut molestiae fuga ullam vel! Repellat expedita quisquam fugiat quas delectus odit provident maiores dignissimos explicabo alias!
                     
                       
                     this is the world
                     </p>

               </article>
                
               
               </div>
            
        </section>
      
        </>
    )
}