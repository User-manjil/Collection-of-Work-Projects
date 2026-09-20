
import Hero from "@/components/home/Hero";
import Introduction from "@/components/home/Intro";
import SelectedWork from "@/components/home/SelectedWork";
import TechStack from "@/components/home/TechStack";
import Button from "@/components/ui/Button";
import { MoveDown } from "lucide-react";

export default function Home(){
  return (
    <>
    <section className="section">
      <Hero/>
      <Introduction/>
      <SelectedWork/>
      
    </section>

    
    
    
    
    </>
  )
}