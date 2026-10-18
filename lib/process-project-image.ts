import { mkdir, writeFile } from "fs/promises"
import path from "path"
// Safe dynamic loader for sharp
type SharpFn = typeof import("sharp")
let sharpModule: SharpFn | null = null

async function getSharp(): Promise<SharpFn | null> {
  if (sharpModule) return sharpModule
  try {
    const mod = await import("sharp")
    sharpModule = (mod.default || mod) as unknown as SharpFn
    return sharpModule
  } catch (err) {
    console.warn("Could not dynamically import sharp:", err)
    return null
  }
}

export type ProjectImageVariant = "thumbnail" | "banner"

const VARIANTS: Record<
  ProjectImageVariant,
  { width: number; height: number; quality: number }
> = {
  thumbnail: { width: 960, height: 600, quality: 80 },
  banner: { width: 1920, height: 900, quality: 82 },
}

const ALLOWED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/x-png",
  "image/pjpeg",
])
const MAX_BYTES = 8 * 1024 * 1024

export function isAllowedProjectImageMime(mime: string): boolean {
  if (!mime) return false
  const lower = mime.toLowerCase().trim()
  return ALLOWED_MIME.has(lower) || lower.startsWith("image/")
}

export function getProjectImageMaxBytes(): number {
  return MAX_BYTES
}

export async function saveOptimizedProjectImage(
  buffer: Buffer,
  variant: ProjectImageVariant,
  originalMime?: string
): Promise<string> {
  const preset = VARIANTS[variant]
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "projects")
  await mkdir(uploadsDir, { recursive: true })

  const uniqueId = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

  try {
    const sharp = await getSharp()
    if (!sharp) {
      throw new Error("Sharp image processing is unavailable, falling back to direct save.")
    }

    const fileName = `${variant}-${uniqueId}.webp`
    const filePath = path.join(uploadsDir, fileName)

    const optimized = await sharp(buffer, { failOn: "none" })
      .rotate()
      .resize(preset.width, preset.height, {
        fit: "cover",
        position: "centre",
        withoutEnlargement: true,
      })
      .webp({ quality: preset.quality, effort: 4 })
      .toBuffer()

    await writeFile(filePath, optimized)
    return `/uploads/projects/${fileName}`
  } catch (err) {
    console.warn("Sharp optimization failed, saving original buffer fallback:", err)
    let ext = "webp"
    if (originalMime?.includes("png")) ext = "png"
    else if (originalMime?.includes("jpeg") || originalMime?.includes("jpg")) ext = "jpg"
    else if (originalMime?.includes("gif")) ext = "gif"
    else if (originalMime?.includes("avif")) ext = "avif"

    const fallbackFileName = `${variant}-${uniqueId}.${ext}`
    const fallbackPath = path.join(uploadsDir, fallbackFileName)
    await writeFile(fallbackPath, buffer)
    return `/uploads/projects/${fallbackFileName}`
  }
}
