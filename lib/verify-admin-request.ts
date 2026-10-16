import { isValidAdminSessionToken } from "@/lib/admin-session"

export function verifyAdminFromRequest(req: Request): boolean {
  const cookieHeader = req.headers.get("cookie") || ""
  const match = cookieHeader.match(/(?:^|;\s*)admin_token=([^;]+)/)
  const token = match?.[1]?.trim()
  return isValidAdminSessionToken(token)
}
