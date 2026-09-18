import Button from "@/components/ui/Button";

export default function Home(){
  return (
    <>
    <div className="flex ">this is home page</div>
    <div className="flex">
    <Button props={{children:"this is button"}}/>
    </div>
    </>
  )
}