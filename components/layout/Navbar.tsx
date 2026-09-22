"use client"
import Link from "next/link"
import { useState } from "react"

export default function Navbar(){
    const [theme,setTheme]= useState('Light')


    return(
      
        <div className={`flex ${theme=='Dark' ? 'dark':''}  container px-20`}>
        <div className=" site-header px-10 ">
            <div className="nav  flex justify-between items-center">
                <div className="nav-logo "><Link href='/'>MANJIL</Link></div>
                <div className="nav-links">
                    <div className="nav-link"> <Link href={'/work'}>Work</Link> </div>
                    <div className="nav-link"> <Link href={'/about'}>About</Link> </div>
                    <div className="nav-link"> <Link href={'/blog'}>Blog</Link> </div>
                    <div className="nav-link"> <Link href={'/contact'}>Contact</Link> </div>
                    <div className="flex">
                        <button 
                onClick={()=>{
                   setTheme( theme=='Dark' ? 'Light':'Dark')  }} 
                   className={`${theme=='Dark' ?'text-foreground border border-black':"text-background  bg-foreground"} px-3 py-2  text-sm transition-all duration-500 rounded-sm`}>{theme}</button>
          
                    </div>
                </div>
                  </div>
       </div>
       </div>

    )
}