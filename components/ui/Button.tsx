import { MoveRight } from "lucide-react"

type ButtonProps = {
  children: React.ReactNode
  className?: string
  href?: string
  onClick?: () => void
}

export default function Button({
  children,
  className = "",
  href,
  onClick,
}: ButtonProps) {
  const inner = (
    <>
      <span>{children}</span>
      <MoveRight size={15} />
    </>
  )

  if (href) {
    return (
      <a href={href} className={`button ${className}`}>
        {inner}
      </a>
    )
  }

  return (
    <button className={`button ${className}`} onClick={onClick}>
      {inner}
    </button>
  )
}