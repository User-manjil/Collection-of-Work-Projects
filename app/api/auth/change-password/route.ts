import { NextResponse } from "next/server"
import { updateAdminPassword } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { currentPassword, newPassword } = await req.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 }
      )
    }

    await updateAdminPassword(currentPassword, newPassword)

    return NextResponse.json({
      success: true,
      message: "Admin password successfully updated",
    })
  } catch (err) {
    return NextResponse.json(
      { success: false, error: (err as Error).message },
      { status: 400 }
    )
  }
}
