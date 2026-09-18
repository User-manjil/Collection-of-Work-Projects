"use client"
import {usePathname} from "next/navigation";
export default function Blog(){
    
    const path = usePathname();
    const slug = path.split('/').pop();
    return(
        <>
       
        </>
    )
}