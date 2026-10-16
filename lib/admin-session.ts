import { randomBytes } from "crypto"

export function createAdminSessionToken(): string {
  return `admin_auth_token_${randomBytes(32).toString("hex")}`
}

export function isValidAdminSessionToken(token: string | undefined | null): boolean {
  if (!token) return false
  if (!token.startsWith("admin_auth_token_")) return false
  const payload = token.slice("admin_auth_token_".length)
  return /^[a-f0-9]{64}$/.test(payload)
}
