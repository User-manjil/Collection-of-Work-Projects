"use client"

import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  FileText,
  Briefcase,
  PlusCircle,
  ExternalLink,
  LogOut,
  Shield,
  Menu,
  X,
  Key,
} from "lucide-react"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Skip auth check if on login page
  const isLoginPage = pathname === "/admin/login"

  useEffect(() => {
    if (isLoginPage) {
      setIsAuthenticated(true)
      return
    }

    const token =
      localStorage.getItem("admin_token") ||
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin_token="))
        ?.split("=")[1]

    if (!token) {
      setIsAuthenticated(false)
      router.push("/admin/login")
    } else {
      setIsAuthenticated(true)
    }
  }, [pathname, isLoginPage, router])

  const handleLogout = () => {
    localStorage.removeItem("admin_token")
    document.cookie = "admin_token=; path=/; max-age=0"
    router.push("/admin/login")
  }

  if (isLoginPage) {
    return <div className="admin-login-wrapper">{children}</div>
  }

  if (isAuthenticated === null) {
    return (
      <div className="admin-loading-screen">
        <span className="mono-label">VERIFYING CREDENTIALS...</span>
      </div>
    )
  }

  const navLinks = [
    { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { label: "Blog Posts", href: "/admin/blog", icon: FileText },
    { label: "Case Studies", href: "/admin/projects", icon: Briefcase },
    { label: "+ New Blog", href: "/admin/blog/new", icon: PlusCircle },
    { label: "+ New Case", href: "/admin/projects/new", icon: PlusCircle },
    { label: "Settings", href: "/admin/settings", icon: Key },
  ]

  return (
    <div className="admin-app-root">
      {/* Admin Header */}
      <header className="admin-top-bar">
        <div className="admin-bar-left">
          <Link href="/admin" className="admin-logo-lockup">
            <Shield size={16} className="admin-shield-icon" />
            <span className="admin-brand-title">CONTROL PLANE</span>
            <span className="mono-label label-subtle admin-badge">PROD // v2.4</span>
          </Link>
        </div>

        <div className="admin-bar-right">
          <Link href="/" target="_blank" className="admin-live-link">
            <span>View Live Site</span>
            <ExternalLink size={13} />
          </Link>
          <button onClick={handleLogout} className="admin-logout-btn" title="Sign out">
            <LogOut size={14} />
            <span className="hide-mobile">Sign Out</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="admin-menu-toggle show-mobile"
            aria-label="Toggle admin navigation"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      <div className="admin-body-layout">
        {/* Minimal Architectural Sidebar */}
        <aside className={`admin-sidebar-nav ${mobileMenuOpen ? "open" : ""}`}>
          <div className="sidebar-group-title mono-label label-subtle">
            WORKSPACE NAVIGATION
          </div>
          <nav className="admin-nav-list">
            {navLinks.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`admin-nav-item ${isActive ? "active" : ""}`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>

          <div className="sidebar-footer-info">
            <span className="mono-label label-subtle">SYSTEM STATUS</span>
            <div className="system-status-indicator">
              <span className="hero-live-dot" />
              <span className="mono-label">DATABASE SYNCED</span>
            </div>
          </div>
        </aside>

        {/* Main Workspace Area */}
        <main className="admin-workspace-content">{children}</main>
      </div>
    </div>
  )
}