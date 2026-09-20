"use client"
import { useState } from "react"

export default function Navbar(){
    const [theme,setTheme]= useState('Dark')


    return(
      
        <div className="flex container px-20">
        <div className=" site-header px-10 ">
            <div className="nav  flex justify-between items-center">
                <div className="nav-logo">MANJIL</div>
                <div className="nav-links">
                    <div className="nav-link">Work</div>
                    <div className="nav-link">About</div>
                    <div className="nav-link">Blog</div>
                    <div className="nav-link">Contact</div>
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