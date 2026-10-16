import { NextResponse } from "next/server"
import { verifyAdminFromRequest } from "@/lib/verify-admin-request"

export async function GET(req: Request) {
  if (!verifyAdminFromRequest(req)) {
    return NextResponse.json({ success: false, authenticated: false }, { status: 401 })
  }

  return NextResponse.json({ success: true, authenticated: true })
}
