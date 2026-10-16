import { NextResponse } from "next/server"
import { invalidateBlogsCache } from "@/lib/invalidate-public-cache"
import { getBlogById, updateBlog, deleteBlog } from "@/lib/store"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const blog = await getBlogById(id)
    if (!blog) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, blog })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await getBlogById(id)
    const body = await req.json()
    const updated = await updateBlog(id, body)
    if (!updated) {
      return NextResponse.json({ success: false, error: "Blog post not found" }, { status: 404 })
    }
    invalidateBlogsCache(updated.slug)
    if (existing?.slug && existing.slug !== updated.slug) {
      invalidateBlogsCache(existing.slug)
    }
    return NextResponse.json({ success: true, blog: updated })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await getBlogById(id)
    await deleteBlog(id)
    if (existing?.slug) invalidateBlogsCache(existing.slug)
    return NextResponse.json({ success: true, message: "Blog post deleted successfully" })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}
