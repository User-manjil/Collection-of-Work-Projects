import { MoveRight } from "lucide-react";

type ButtonProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Button({ children, className = "" }: ButtonProps) {
  return (
    <button className={`flex items-center  uppercase s  gap-1 ${className}`}>
      <span className="text-sm">{children}</span>
      <MoveRight size={15} />
    </button>
  );
}