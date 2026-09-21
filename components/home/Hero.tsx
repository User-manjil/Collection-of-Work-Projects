import Button from "../ui/Button"
import { MoveDown } from "lucide-react"
export default function Hero(){
    return (
        <>
      <div className="container gap-y-10 flex-col ">
        <div className="flex flex-col sm:flex-row gap-3.5">
                <div className="flex flex-col text-body-large  h-full ">
              <h5 className="text-sm text-muted-foreground">FULL - STACK WEB DEVELOPER</h5>
            <h1 className="text-hero">I build modern websites and web apps. </h1>
            <h3 className="text-muted text-base ">From UI to API, I create complete digital products using modern web technologies.</h3>
        </div>
        <div className="flex  bg-foreground w-3/4  h-100">
         </div>
        </div>
     
    <div className="flex gap-10">
    <Button className="button">Get in Touch</Button>
    <Button className="button">View my Work</Button>
    </div>
      </div>
      {/* <section className="section"> */}
      <div className="container my-20 border-muted-foreground border-t py-5">
        <div className="flex justify-between">
          <p className="text-sm">AVAILABLE FOR SELECTED PROJECTS</p>
          <p className="text-sm" >Based in Nepal • Working Worldwide</p>
          <p className="items-center justify-center flex flex-col text-xs"> SCROLL <MoveDown size={15}/></p>
        </div>
      </div>

    </>

    )
}