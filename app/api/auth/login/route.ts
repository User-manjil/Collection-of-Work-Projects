import { NextResponse } from "next/server"
import { getAdminCredentials } from "@/lib/auth"

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    const creds = await getAdminCredentials()

    if (email === creds.email && password === creds.password) {
      const token = "admin_auth_token_" + Buffer.from(`${email}:${Date.now()}`).toString("base64")
      
      const response = NextResponse.json({
        success: true,
        user: { email, role: "admin" },
        token,
      })

      // Set cookie for server route verification
      response.cookies.set("admin_token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return response
    }

    return NextResponse.json(
      { success: false, error: "Invalid credentials" },
      { status: 401 }
    )
  } catch {
    return NextResponse.json(
      { success: false, error: "Authentication failed" },
      { status: 500 }
    )
  }
}
