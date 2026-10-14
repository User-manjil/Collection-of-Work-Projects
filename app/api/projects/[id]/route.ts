import { NextResponse } from "next/server"
import { getProjectById, updateProject, deleteProject } from "@/lib/store"

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const project = await getProjectById(id)
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, project })
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
    const body = await req.json()
    const updated = await updateProject(id, body)
    if (!updated) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 })
    }
    return NextResponse.json({ success: true, project: updated })
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
    await deleteProject(id)
    return NextResponse.json({ success: true, message: "Project deleted successfully" })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 500 }
    )
  }
}
