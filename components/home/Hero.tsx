import HeroScene from "../3d/HeroScene"
import Button from "../ui/Button"
import { ArrowDown } from "lucide-react"

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="container">
        {/* Simple minimal availability badge */}
        <div className="hero-top-strip">
          <div className="hero-status-pill">
            <span className="hero-live-dot" />
            <span className="status-pill-text">Available for projects</span>
          </div>
        </div>

        <div className="hero-grid">
          {/* Left: Content */}
          <div className="hero-content">
            <h1 className="hero-title text-hero">
              Full-stack developer building clean web experiences.
            </h1>

            <p className="hero-description">
              I design and build high-performance web applications, scalable backends,
              and interactive 3D digital products.
            </p>

            <div className="hero-actions">
              <Button href="/work">View My Work</Button>
              <Button href="/contact">Get in Touch</Button>
            </div>
          </div>

          {/* Right: Clean 3D Canvas Visual */}
          <div className="hero-visual-wrapper">
            <div className="hero-visual-frame">
              <HeroScene />
            </div>
          </div>
        </div>

        {/* Minimal Hero Bottom Bar */}
        <div className="hero-status">
          <span className="text-small text-muted">
            Based in Nepal · Available Worldwide
          </span>

          <a href="#introduction" className="hero-scroll-cue" aria-label="Scroll to introduction">
            <span className="text-small text-muted">Scroll</span>
            <ArrowDown size={14} className="scroll-arrow" />
          </a>
        </div>
      </div>
    </section>
  )
}