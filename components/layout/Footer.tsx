"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowUpRight, Lock } from "lucide-react"

export default function Footer() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  // Never render public footer on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null
  }

  return (
    <footer className="site-footer" id="site-footer">
      <div className="container">
        <div className="footer-top-cta">
          <div className="footer-cta-content">
            <h2 className="footer-headline">Have a project or idea in mind?</h2>
          </div>
          <div className="footer-cta-action">
            <Link href="/contact" className="footer-primary-btn">
              <span>Get in touch</span>
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>

        <div className="footer-grid">
          <div>
            <div className="footer-brand-title">Manjil Aryal</div>
            <p className="text-small text-muted" style={{ marginTop: "8px", maxWidth: "280px" }}>
              Full-stack developer building clean web applications, scalable backends, and interactive interfaces.
            </p>
          </div>

          <div>
            <p className="footer-col-title" style={{ marginBottom: "16px" }}>
              Navigation
            </p>
            <div className="footer-links">
              <Link href="/work" className="hover-link">Work</Link>
              <Link href="/about" className="hover-link">About</Link>
              <Link href="/blog" className="hover-link">Blog</Link>
              <Link href="/contact" className="hover-link">Contact</Link>
            </div>
          </div>

          <div>
            <p className="footer-col-title" style={{ marginBottom: "16px" }}>
              Connect
            </p>
            <div className="footer-links">
              <a
                href="https://github.com/User-manjil"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-link footer-ext-link"
              >
                <span>GitHub</span>
                <ArrowUpRight size={12} />
              </a>
              <a
                href="https://linkedin.com/in/manjilaryal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-link footer-ext-link"
              >
                <span>LinkedIn</span>
                <ArrowUpRight size={12} />
              </a>
              <a
                href="https://twitter.com/manjilaryal"
                target="_blank"
                rel="noopener noreferrer"
                className="hover-link footer-ext-link"
              >
                <span>Twitter</span>
                <ArrowUpRight size={12} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>&copy; {currentYear} Manjil Aryal</span>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <span className="text-muted text-small">Kathmandu, Nepal</span>
            <Link href="/admin" className="footer-admin-link" title="Open Admin Panel">
              <Lock size={12} />
              <span>Admin Panel</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}