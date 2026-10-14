import { NextResponse } from "next/server"
import { getProjects, createProject } from "@/lib/store"

export async function GET() {
  try {
    const projects = await getProjects()
    return NextResponse.json({ success: true, projects })
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
    const {
      title,
      slug,
      subtitle,
      projecttype,
      description,
      techStack,
      stats,
      problem,
      architecture,
      metrics,
      liveUrl,
      githubUrl,
      featured,
    } = body

    if (!title || !description || !projecttype) {
      return NextResponse.json(
        { success: false, error: "Title, project type, and description are required" },
        { status: 400 }
      )
    }

    const generatedSlug =
      slug ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")

    const newProject = await createProject({
      title,
      slug: generatedSlug,
      subtitle: subtitle || "",
      projecttype,
      description,
      techStack: Array.isArray(techStack) ? techStack : [],
      stats: stats || "Production Ready",
      problem: problem || "",
      architecture: architecture || "",
      metrics: metrics || "",
      liveUrl: liveUrl || "",
      githubUrl: githubUrl || "",
      featured: featured !== undefined ? Boolean(featured) : true,
    })

    return NextResponse.json({ success: true, project: newProject }, { status: 201 })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}
