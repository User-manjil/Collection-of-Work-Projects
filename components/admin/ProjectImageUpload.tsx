"use client"

import { useRef, useState } from "react"
import Image from "next/image"
import { ImagePlus, Loader2, X } from "lucide-react"

type ProjectImageUploadProps = {
  label: string
  hint: string
  variant: "thumbnail" | "banner"
  value: string
  onChange: (url: string) => void
  previewAspect?: "16/10" | "21/9"
}

export default function ProjectImageUpload({
  label,
  hint,
  variant,
  value,
  onChange,
  previewAspect = variant === "banner" ? "21/9" : "16/10",
}: ProjectImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState("")

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setError("")

    const isImage = file.type.startsWith("image/") || /\.(jpe?g|png|webp|avif|gif)$/i.test(file.name)
    if (!isImage) {
      setError("Please choose a valid image file (JPEG, PNG, WebP, AVIF, GIF)")
      return
    }

    if (file.size > 8 * 1024 * 1024) {
      setError("Image must be 8 MB or smaller")
      return
    }

    setUploading(true)
    try {
      const body = new FormData()
      body.append("file", file)
      body.append("variant", variant)

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
        credentials: "include",
      })

      const data = await res.json()
      if (!res.ok || !data.success) {
        setError(data.error || "Upload failed. Please ensure you are logged in as admin.")
        return
      }

      onChange(data.url as string)
    } catch {
      setError("Network error while uploading")
    } finally {
      setUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
    const file = e.dataTransfer?.files?.[0]
    void handleFile(file)
  }

  return (
    <div className="form-field-group">
      <label className="mono-label label-subtle">{label}</label>
      <p className="text-small text-muted" style={{ marginTop: -4 }}>
        {hint}
      </p>

      {value ? (
        <div
          className="project-image-preview-wrap"
          style={{ aspectRatio: previewAspect }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Image
            src={value}
            alt=""
            fill
            sizes={variant === "banner" ? "(max-width: 768px) 100vw, 960px" : "(max-width: 768px) 100vw, 480px"}
            className="project-image-preview-img"
          />
          <button
            type="button"
            className="project-image-remove-btn"
            onClick={() => onChange("")}
            aria-label="Remove image"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          className={`project-image-dropzone ${isDragging ? "active" : ""}`}
          style={{
            aspectRatio: previewAspect,
            borderColor: isDragging ? "var(--foreground)" : undefined,
            background: isDragging ? "var(--surface-hover)" : undefined,
          }}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {uploading ? (
            <>
              <Loader2 size={20} className="spin-icon" />
              <span className="text-small">Optimizing &amp; uploading…</span>
            </>
          ) : (
            <>
              <ImagePlus size={22} />
              <span className="text-small">
                {isDragging ? "Drop image to upload" : "Click or drag image to upload"}
              </span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-small" style={{ color: "var(--destructive, #c0392b)" }}>
          {error}
        </p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        className="sr-only"
        onChange={(e) => void handleFile(e.target.files?.[0])}
      />

      {value && (
        <button
          type="button"
          className="admin-secondary-btn"
          style={{ alignSelf: "flex-start", marginTop: 4 }}
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
        >
          Replace image
        </button>
      )}
    </div>
  )
}
