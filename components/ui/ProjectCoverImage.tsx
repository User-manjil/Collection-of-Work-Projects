import Image from "next/image"
import { Code2 } from "lucide-react"

type ProjectCoverImageProps = {
  src?: string
  alt: string
  title: string
  priority?: boolean
  sizes?: string
  className?: string
}

export default function ProjectCoverImage({
  src,
  alt,
  title,
  priority = false,
  sizes = "(max-width: 768px) 100vw, 540px",
  className = "project-preview-card",
}: ProjectCoverImageProps) {
  if (!src) {
    return (
      <div className={className}>
        <div className="preview-card-inner">
          <Code2 size={36} className="text-muted" />
          <span className="preview-card-title">{title}</span>
        </div>
      </div>
    )
  }

  return (
    <div className={`${className} project-cover-image-frame`}>
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="project-cover-image"
      />
    </div>
  )
}
