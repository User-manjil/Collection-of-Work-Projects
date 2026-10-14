import Link from "next/link"
import { notFound } from "next/navigation"
import { getBlogBySlug } from "@/lib/store"
import { ArrowLeft, ArrowUpRight } from "lucide-react"

export const revalidate = 0

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getBlogBySlug(slug)

  if (!post) {
    notFound()
  }

  // Simple clean markdown-to-HTML parser
  const renderContent = (content: string) => {
    const lines = content.trim().split("\n")
    const elements: React.ReactNode[] = []
    let inCodeBlock = false
    let codeBuffer: string[] = []
    let codeLanguage = ""

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          elements.push(
            <div key={`code-${idx}`} className="article-code-block">
              <pre>
                <code>{codeBuffer.join("\n")}</code>
              </pre>
            </div>
          )
          codeBuffer = []
          inCodeBlock = false
        } else {
          inCodeBlock = true
          codeLanguage = line.slice(3).trim()
        }
        return
      }

      if (inCodeBlock) {
        codeBuffer.push(line)
        return
      }

      const trimmed = line.trim()
      if (!trimmed) {
        return
      }

      if (trimmed.startsWith("# ")) {
        return
      } else if (trimmed.startsWith("### ")) {
        elements.push(
          <h3 key={idx} className="article-h3">
            {trimmed.replace("### ", "")}
          </h3>
        )
      } else if (trimmed.startsWith("## ")) {
        elements.push(
          <h2 key={idx} className="article-h2">
            {trimmed.replace("## ", "")}
          </h2>
        )
      } else if (trimmed.startsWith("> ")) {
        elements.push(
          <blockquote key={idx} className="article-quote">
            <p>{trimmed.replace("> ", "").replace(/^"|"$/g, "")}</p>
          </blockquote>
        )
      } else if (trimmed.startsWith("---")) {
        elements.push(<hr key={idx} className="article-divider" />)
      } else if (trimmed.startsWith("1. ") || trimmed.startsWith("2. ") || trimmed.startsWith("3. ")) {
        elements.push(
          <p key={idx} className="article-list-item">
            <span className="list-num">{trimmed.slice(0, 3)}</span>
            <span>{trimmed.slice(3)}</span>
          </p>
        )
      } else {
        elements.push(
          <p key={idx} className="article-p">
            {trimmed}
          </p>
        )
      }
    })

    return elements
  }

  const formattedDate = new Date(post.createdAt || Date.now()).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <article className="section-spacious">
      <div className="container-reading">
        {/* Back Link with clean spacing */}
        <div className="article-back-nav">
          <Link href="/blog" className="back-link">
            <ArrowLeft size={15} />
            <span>Back to articles</span>
          </Link>
        </div>

        {/* Article Header with Negative Space */}
        <header className="article-header-minimal">
          <div className="article-meta-row">
            <span className="text-small text-muted">{post.category}</span>
            <span className="meta-dot">·</span>
            <span className="text-small text-muted">{formattedDate}</span>
            <span className="meta-dot">·</span>
            <span className="text-small text-muted">{post.readTime}</span>
          </div>

          <h1 className="article-title-editorial">{post.title}</h1>
          <p className="article-lead-editorial">{post.excerpt}</p>
        </header>

        {/* Main Prose Content */}
        <div className="article-prose-container">
          {renderContent(post.content)}
        </div>

        {/* Author Signoff & Negative Space Footer */}
        <footer className="article-footer-minimal">
          <div className="article-author-card">
            <div>
              <p className="text-label" style={{ marginBottom: "8px" }}>Written by</p>
              <h4 className="author-name">Manjil Aryal</h4>
              <p className="author-bio text-small text-muted">
                Full-stack developer building clean web software and interactive experiences.
              </p>
            </div>
            <div>
              <Link href="/contact" className="author-discuss-btn">
                <span>Discuss this article</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </article>
  )
}