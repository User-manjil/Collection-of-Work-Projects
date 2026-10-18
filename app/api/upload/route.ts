import { NextResponse } from "next/server"
import {
  getProjectImageMaxBytes,
  isAllowedProjectImageMime,
  saveOptimizedProjectImage,
  type ProjectImageVariant,
} from "@/lib/process-project-image"
import { verifyAdminFromRequest } from "@/lib/verify-admin-request"

export const runtime = "nodejs"

function parseVariant(value: FormDataEntryValue | null): ProjectImageVariant | null {
  if (value === "thumbnail" || value === "banner") return value
  return null
}

export async function POST(req: Request) {
  if (!verifyAdminFromRequest(req)) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const file = formData.get("file")
    const variant = parseVariant(formData.get("variant"))

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ success: false, error: "Image file is required" }, { status: 400 })
    }

    if (!variant) {
      return NextResponse.json(
        { success: false, error: 'Variant must be "thumbnail" or "banner"' },
        { status: 400 }
      )
    }

    if (!isAllowedProjectImageMime(file.type)) {
      return NextResponse.json(
        { success: false, error: "Only JPEG, PNG, WebP, or AVIF images are allowed" },
        { status: 400 }
      )
    }

    if (file.size > getProjectImageMaxBytes()) {
      return NextResponse.json(
        { success: false, error: "Image must be 8 MB or smaller" },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const url = await saveOptimizedProjectImage(Buffer.from(arrayBuffer), variant, file.type)

    return NextResponse.json({ success: true, url })
  } catch (err) {
    console.error("Upload failed:", err)
    return NextResponse.json(
      { success: false, error: err instanceof Error ? `${err.name}: ${err.message}` : "Failed to process image" },
      { status: 500 }
    )
  }
}
