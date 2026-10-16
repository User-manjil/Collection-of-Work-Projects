import { mkdir, writeFile } from "fs/promises"
import path from "path"
import sharp from "sharp"

export type ProjectImageVariant = "thumbnail" | "banner"

const VARIANTS: Record<
  ProjectImageVariant,
  { width: number; height: number; quality: number }
> = {
  thumbnail: { width: 960, height: 600, quality: 80 },
  banner: { width: 1920, height: 900, quality: 82 },
}

const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"])
const MAX_BYTES = 8 * 1024 * 1024

export function isAllowedProjectImageMime(mime: string): boolean {
  return ALLOWED_MIME.has(mime)
}

export function getProjectImageMaxBytes(): number {
  return MAX_BYTES
}

export async function saveOptimizedProjectImage(
  buffer: Buffer,
  variant: ProjectImageVariant
): Promise<string> {
  const preset = VARIANTS[variant]
  const uploadsDir = path.join(process.cwd(), "public", "uploads", "projects")
  await mkdir(uploadsDir, { recursive: true })

  const fileName = `${variant}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}.webp`
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
}
