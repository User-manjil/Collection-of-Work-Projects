import { MoveRight } from "lucide-react";
export default function Button({props}: any) {
    return (
        <>
           <button className=" flex items-center gap-1   " >{props.children} <MoveRight size={15}/></button>
        </>
    )
}