"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect, useRef, type KeyboardEvent } from "react"
import { createPortal } from "react-dom"
import { Sun, Moon, Menu, X } from "lucide-react"

const LINKS = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
]

/**
 * All mobile-menu styling lives here and is driven by the same `.dark` class
 * your site already toggles on <html>. It does NOT depend on Tailwind's
 * `dark:` variant (which follows the OS setting unless configured otherwise),
 * so light/dark always match the toggle.
 */
const CSS = `
/* ---------- layout switch (768px = Tailwind md) ---------- */
.mm-nav{display:flex;flex-direction:row;align-items:center;justify-content:space-between}
.mm-desktop{display:none}
.mm-mobile-controls{display:flex;align-items:center;gap:4px}
@media (min-width:768px){
  .mm-desktop{display:block}
  .mm-mobile-controls{display:none}
  .mm-overlay{display:none!important}
}

/* ---------- buttons / theme icons (flash-free: CSS picks the icon) ---------- */
.mm-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:44px;height:44px;min-width:44px;border-radius:999px;border:0;background:transparent;color:inherit;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .15s ease,background-color .2s ease}
.mm-icon-btn:active{transform:scale(.92)}
.mm-icon-btn:focus-visible,.mm-link:focus-visible,.mm-cta:focus-visible,.mm-brand:focus-visible{outline:2px solid var(--mm-accent,#6366f1);outline-offset:2px}
.mm-min{min-width:44px;min-height:44px}
.mm-moon{display:block}
.mm-sun{display:none}
.dark .mm-moon{display:none}
.dark .mm-sun{display:block}

/* ---------- theme tokens ---------- */
.mm-overlay{
  --mm-bg:rgba(255,255,255,.97);
  --mm-fg:#0a0a0b;
  --mm-muted:#71717a;
  --mm-line:rgba(0,0,0,.09);
  --mm-accent:#4f46e5;
  --mm-cta-bg:#0a0a0b;
  --mm-cta-fg:#ffffff;
  color-scheme:light;
}
.dark .mm-overlay{
  --mm-bg:rgba(10,10,12,.97);
  --mm-fg:#fafafa;
  --mm-muted:#a1a1aa;
  --mm-line:rgba(255,255,255,.12);
  --mm-accent:#818cf8;
  --mm-cta-bg:#fafafa;
  --mm-cta-fg:#0a0a0b;
  color-scheme:dark;
}

/* ---------- overlay ---------- */
.mm-overlay{position:fixed;inset:0;z-index:100;display:flex;flex-direction:column;background:var(--mm-bg);color:var(--mm-fg);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);padding-top:env(safe-area-inset-top);padding-bottom:env(safe-area-inset-bottom);overscroll-behavior:contain;animation:mm-in .25s ease both}
.mm-overlay.mm-closing{animation:mm-out .2s ease both}
.mm-overlay .mm-icon-btn:active{background:var(--mm-line)}
.mm-top{display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 20px;flex-shrink:0}
.mm-brand{font-size:14px;font-weight:600;letter-spacing:.12em;color:inherit;text-decoration:none}
.mm-actions{display:flex;align-items:center;gap:4px}

.mm-links{flex:1;display:flex;flex-direction:column;padding:0 24px;overflow-y:auto}
.mm-links::before,.mm-links::after{content:"";flex:1}
.mm-link{display:flex;align-items:baseline;gap:16px;padding:16px 0;border-bottom:1px solid var(--mm-line);color:var(--mm-muted);text-decoration:none;opacity:0;animation:mm-rise .5s cubic-bezier(.2,.8,.2,1) both;animation-delay:calc(100ms + var(--i,0) * 65ms);-webkit-tap-highlight-color:transparent;transition:color .2s ease}
.mm-link:active,.mm-link[aria-current="page"]{color:var(--mm-fg)}
.mm-num{font-size:12px;font-variant-numeric:tabular-nums;opacity:.7}
.mm-label{font-size:clamp(30px,9vw,40px);font-weight:600;letter-spacing:-.02em;line-height:1.1}
.mm-dot{margin-left:auto;align-self:center;width:8px;height:8px;border-radius:999px;background:var(--mm-accent)}

.mm-cta-wrap{flex-shrink:0;padding:16px 24px 24px;opacity:0;animation:mm-rise .5s cubic-bezier(.2,.8,.2,1) both;animation-delay:420ms}
.mm-cta{display:flex;align-items:center;justify-content:center;width:100%;height:48px;border-radius:999px;background:var(--mm-cta-bg);color:var(--mm-cta-fg);font-size:14px;font-weight:500;text-decoration:none;transition:transform .15s ease;-webkit-tap-highlight-color:transparent}
.mm-cta:active{transform:scale(.98)}

.mm-closing .mm-link,.mm-closing .mm-cta-wrap{animation:none;opacity:1}

@keyframes mm-in{from{opacity:0}to{opacity:1}}
@keyframes mm-out{from{opacity:1}to{opacity:0}}
@keyframes mm-rise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){
  .mm-overlay,.mm-link,.mm-cta-wrap{animation-duration:.01ms!important;animation-delay:0ms!important}
}
`

export default function Navbar() {
  const pathname = usePathname()
  const [isDark, setIsDark] = useState(false)
  const [open, setOpen] = useState(false)
  const [closing, setClosing] = useState(false)

  const menuBtnRef = useRef<HTMLButtonElement>(null)
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const closeMenu = () => {
    if (!open || closing) return
    setClosing(true)
    closeTimer.current = setTimeout(() => {
      setOpen(false)
      setClosing(false)
    }, 200)
  }

  // ---- theme: apply saved/system preference, then stay in sync with <html class="dark"> ----
  useEffect(() => {
    const root = document.documentElement
    const saved = localStorage.getItem("theme")
    const mq = window.matchMedia("(prefers-color-scheme: dark)")

    if (saved === "dark" || (!saved && mq.matches)) root.classList.add("dark")

    const read = () => setIsDark(root.classList.contains("dark"))
    read()

    // picks up changes made anywhere else (other toggles, scripts, 3D scenes)
    const observer = new MutationObserver(read)
    observer.observe(root, { attributes: true, attributeFilter: ["class"] })

    // follow the OS setting live, unless the visitor picked a theme manually
    const onSystem = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) root.classList.toggle("dark", e.matches)
    }
    mq.addEventListener("change", onSystem)

    return () => {
      observer.disconnect()
      mq.removeEventListener("change", onSystem)
    }
  }, [])

  // ---- color of the mobile browser UI (address bar) follows the theme ----
  useEffect(() => {
    let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"][data-nav]')
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "theme-color"
      meta.setAttribute("data-nav", "")
      document.head.appendChild(meta)
    }
    meta.content = isDark ? "#0a0a0c" : "#ffffff"
  }, [isDark])

  // ---- close the menu when the route changes ----
  useEffect(() => {
    setOpen(false)
    setClosing(false)
  }, [pathname])

  // ---- while open: lock scroll, Esc, auto-close on desktop width, focus handling ----
  useEffect(() => {
    if (!open) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    closeBtnRef.current?.focus()

    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") closeMenu()
    }
    window.addEventListener("keydown", onKey)

    const mq = window.matchMedia("(min-width: 768px)")
    const onMq = () => {
      if (mq.matches) {
        setOpen(false)
        setClosing(false)
      }
    }
    mq.addEventListener("change", onMq)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener("keydown", onKey)
      mq.removeEventListener("change", onMq)
      menuBtnRef.current?.focus() // hand focus back to the opener
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    []
  )

  // NOTE: every hook stays above this early return
  // Never render public navbar on admin pages
  if (pathname && pathname.startsWith("/admin")) {
    return null
  }

  const toggleTheme = () => {
    const root = document.documentElement
    const next = !root.classList.contains("dark")
    root.classList.toggle("dark", next)
    localStorage.setItem("theme", next ? "dark" : "light")
    setIsDark(next)
  }

  // simple focus trap inside the open menu
  const onPanelKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key !== "Tab" || !panelRef.current) return
    const f = panelRef.current.querySelectorAll<HTMLElement>(
      "a[href], button:not([disabled])"
    )
    if (!f.length) return
    const first = f[0]
    const last = f[f.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  // both icons render; CSS shows the right one -> no icon flash on load
  const themeButton = (className: string, size: number) => (
    <button
      type="button"
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle dark/light mode"
      aria-pressed={isDark}
      title="Toggle theme"
    >
      <Moon size={size} className="mm-moon" />
      <Sun size={size} className="mm-sun" />
    </button>
  )

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <header className="site-header" id="site-header">
        <nav className="nav container mm-nav" aria-label="Main">
          <Link href="/" className="nav-brand">
            <span className="brand-name">MANJIL ARYAL</span>
          </Link>

          {/* Desktop / tablet */}
          <div className="mm-desktop">
            <div className="nav-links">
              {LINKS.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`nav-link${pathname === href ? " active" : ""}`}
                >
                  {label}
                </Link>
              ))}
              {themeButton("theme-toggle", 15)}
            </div>
          </div>

          {/* Mobile */}
          <div className="mm-mobile-controls">
            {themeButton("theme-toggle mm-min", 17)}
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setOpen(true)}
              className="mm-icon-btn"
              aria-label="Open menu"
              aria-expanded={open}
              aria-controls="mobile-menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </nav>
      </header>

      {/* Mounted only while open (no idle blur cost); portal avoids header stacking issues */}
      {open &&
        createPortal(
          <div
            id="mobile-menu"
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            onKeyDown={onPanelKeyDown}
            className={`mm-overlay${closing ? " mm-closing" : ""}`}
          >
            <div className="mm-top">
              <Link href="/" onClick={closeMenu} className="mm-brand">
                MANJIL ARYAL
              </Link>
              <div className="mm-actions">
                {themeButton("mm-icon-btn", 20)}
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={closeMenu}
                  className="mm-icon-btn"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <nav className="mm-links" aria-label="Mobile">
              {LINKS.map(({ href, label }, i) => {
                const active = pathname === href
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={closeMenu}
                    aria-current={active ? "page" : undefined}
                    className="mm-link"
                    style={{ ["--i" as string]: i }}
                  >
                    <span className="mm-num">{String(i + 1).padStart(2, "0")}</span>
                    <span className="mm-label">{label}</span>
                    {active && <span className="mm-dot" />}
                  </Link>
                )
              })}
            </nav>

            <div className="mm-cta-wrap">
              <Link href="/contact" onClick={closeMenu} className="mm-cta">
                Let&apos;s work together
              </Link>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}