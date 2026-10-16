"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Shield, ArrowRight, Lock, Mail, AlertCircle } from "lucide-react"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (data.success) {
        router.push("/admin")
      } else {
        setError(data.error || "Authentication failed")
      }
    } catch {
      setError("Network or server connection error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-screen-container">
      <div className="login-card-minimal">
        <div className="login-header">
          <div className="login-icon-box">
            <Shield size={24} />
          </div>
          <span className="mono-label label-subtle">RESTRICTED ACCESS</span>
          <h1 className="login-title">Control Plane Authentication</h1>
          <p className="login-subtitle text-muted text-small">
            Authenticate to access database management, blog publishing, and telemetry tools.
          </p>
        </div>

        {error && (
          <div className="login-error-banner">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="login-email">
              ADMIN EMAIL
            </label>
            <div className="input-with-icon">
              <Mail size={15} className="input-icon" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="minimal-input"
                placeholder="admin@manjil.dev"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label className="mono-label label-subtle" htmlFor="login-password">
              ADMIN PASSWORD
            </label>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="minimal-input"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="login-submit-btn"
          >
            <span>{loading ? "Authenticating..." : "Enter Workspace"}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="login-footer-nav">
          <Link href="/" className="back-link">
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  )
}
