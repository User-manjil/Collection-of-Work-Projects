import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto"

const SALT_BYTES = 16
const KEY_LEN = 64
const SCRYPT_COST = 16384

export function isPasswordHashed(stored: string): boolean {
  return stored.startsWith("scrypt$")
}

function deriveKey(password: string, salt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCb(password, salt, KEY_LEN, { N: SCRYPT_COST }, (err, derivedKey) => {
      if (err) reject(err)
      else resolve(derivedKey)
    })
  })
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_BYTES).toString("hex")
  const derived = await deriveKey(password, salt)
  return `scrypt$${salt}$${derived.toString("hex")}`
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  if (!stored) return false

  if (!isPasswordHashed(stored)) {
    return timingSafeEqualString(password, stored)
  }

  const parts = stored.split("$")
  if (parts.length !== 3 || parts[0] !== "scrypt") return false

  const [, salt, expectedHex] = parts
  const derived = await deriveKey(password, salt)
  const expected = Buffer.from(expectedHex, "hex")

  if (expected.length !== derived.length) return false
  return timingSafeEqual(expected, derived)
}

function timingSafeEqualString(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}
