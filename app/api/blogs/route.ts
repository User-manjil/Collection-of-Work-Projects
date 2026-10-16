import { NextResponse } from "next/server"
import { invalidateBlogsCache } from "@/lib/invalidate-public-cache"
import { getBlogs, createBlog } from "@/lib/store"

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const onlyPublished = searchParams.get("published") === "true"
    const blogs = await getBlogs(onlyPublished)
    return NextResponse.json({ success: true, blogs })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { title, slug, excerpt, content, category, readTime, published } = body

    if (!title || !content) {
      return NextResponse.json(
        { success: false, error: "Title and content are required" },
        { status: 400 }
      )
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")

    const newBlog = await createBlog({
      title,
      slug: generatedSlug,
      excerpt: excerpt || title,
      content,
      category: category || "ENGINEERING",
      readTime: readTime || "5 min read",
      published: published !== undefined ? Boolean(published) : true,
    })

    invalidateBlogsCache(newBlog.slug)
    return NextResponse.json({ success: true, blog: newBlog }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}
