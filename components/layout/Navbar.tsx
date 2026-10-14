"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark" || (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Never render public navbar on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null
  }

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDark(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDark(true)
    }
  }

  return (
    <header className="site-header" id="site-header">
      <nav className="nav container">
        <Link href="/" className="nav-brand">
          <span className="brand-name">MANJIL ARYAL</span>
        </Link>

        <div className="nav-links">
          <Link
            href="/work"
            className={`nav-link${pathname === "/work" ? " active" : ""}`}
          >
            Work
          </Link>
          <Link
            href="/about"
            className={`nav-link${pathname === "/about" ? " active" : ""}`}
          >
            About
          </Link>
          <Link
            href="/blog"
            className={`nav-link${pathname === "/blog" ? " active" : ""}`}
          >
            Blog
          </Link>
          <Link
            href="/contact"
            className={`nav-link${pathname === "/contact" ? " active" : ""}`}
          >
            Contact
          </Link>

          <button
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label="Toggle dark/light mode"
            title="Toggle theme"
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}
          </button>
        </div>
      </nav>
    </header>
  )
}