"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Key, Lock, CheckCircle2, AlertCircle, Save } from "lucide-react"

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setMessage("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data = await res.json()

      if (data.success) {
        setMessage("Password updated successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setError(data.error || "Failed to update password")
      }
    } catch {
      setError("Server connection failure")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-page-container">
      {/* Header */}
      <div className="admin-header-row">
        <div>
          <Link href="/admin" className="back-link" style={{ marginBottom: "8px" }}>
            <ArrowLeft size={13} />
            <span className="mono-label">DASHBOARD</span>
          </Link>
          <h1 className="admin-page-title">Admin Account &amp; Security</h1>
        </div>
      </div>

      {message && (
        <div className="settings-success-banner">
          <CheckCircle2 size={16} />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="login-error-banner" style={{ marginBlock: "16px" }}>
          <AlertCircle size={15} />
          <span>{error}</span>
        </div>
      )}

      {/* Password Change Panel */}
      <div className="admin-panel-card" style={{ maxWidth: "600px", padding: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <Key size={18} className="text-muted" />
          <h2 style={{ fontSize: "1.15rem", fontWeight: "500", margin: 0 }}>
            Change Admin Password
          </h2>
        </div>
        <p className="text-small text-muted" style={{ marginBottom: "24px" }}>
          Update the security credentials used to access this administrative control plane.
        </p>

        <form onSubmit={handlePasswordSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div className="form-field-group">
            <label className="text-small" htmlFor="current-pw" style={{ fontWeight: 500 }}>
              Current Password
            </label>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
              <input
                id="current-pw"
                type="password"
                required
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className="minimal-input"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label className="text-small" htmlFor="new-pw" style={{ fontWeight: 500 }}>
              New Password
            </label>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
              <input
                id="new-pw"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
                className="minimal-input"
              />
            </div>
          </div>

          <div className="form-field-group">
            <label className="text-small" htmlFor="confirm-pw" style={{ fontWeight: 500 }}>
              Confirm New Password
            </label>
            <div className="input-with-icon">
              <Lock size={15} className="input-icon" />
              <input
                id="confirm-pw"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                className="minimal-input"
              />
            </div>
          </div>

          <div style={{ marginTop: "12px" }}>
            <button
              type="submit"
              disabled={loading}
              className="admin-primary-btn"
              style={{ width: "100%", justifyContent: "center", padding: "12px" }}
            >
              <Save size={15} />
              <span>{loading ? "Updating Password..." : "Update Password"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
