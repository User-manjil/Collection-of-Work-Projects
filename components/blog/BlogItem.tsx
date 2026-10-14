import Link from "next/link"

type BlogItemProps = {
  title: string
  date: string
  link: string
}

export default function BlogItem({ title, date, link }: BlogItemProps) {
  return (
    <Link href={link} className="blog-item">
      <span className="blog-meta">{date}</span>
      <h2 className="blog-title">{title}</h2>
      <span className="blog-meta">Read →</span>
    </Link>
  )
}