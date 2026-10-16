import { connectToDatabase } from "./mongodb"
import { AdminUserModel } from "./models/AdminUser"
import { hashPassword, isPasswordHashed, verifyPassword } from "./password"

const adminEmail = process.env.ADMIN_EMAIL || "admin@manjil.dev"

let memoryAdminPasswordHash: string | null = null

async function getBootstrapPasswordHash(): Promise<string> {
  if (memoryAdminPasswordHash) return memoryAdminPasswordHash
  const plain = process.env.ADMIN_PASSWORD || "admin123"
  memoryAdminPasswordHash = await hashPassword(plain)
  return memoryAdminPasswordHash
}

async function migrateStoredPasswordIfNeeded(email: string, passwordHash: string): Promise<string> {
  if (isPasswordHashed(passwordHash)) return passwordHash

  const hashed = await hashPassword(passwordHash)
  try {
    await connectToDatabase()
    await AdminUserModel.findOneAndUpdate({ email }, { passwordHash: hashed })
  } catch (err) {
    console.warn("Could not migrate admin password hash in DB:", (err as Error).message)
  }
  return hashed
}

export async function getAdminAuthRecord(): Promise<{ email: string; passwordHash: string }> {
  try {
    await connectToDatabase()
    let admin = await AdminUserModel.findOne({ email: adminEmail }).lean()
    if (!admin) {
      const passwordHash = await getBootstrapPasswordHash()
      admin = await AdminUserModel.create({
        email: adminEmail,
        passwordHash,
      })
    }

    const passwordHash = await migrateStoredPasswordIfNeeded(admin.email, admin.passwordHash)
    return { email: admin.email, passwordHash }
  } catch (err) {
    console.warn("Using in-memory admin credentials:", (err as Error).message)
    return {
      email: adminEmail,
      passwordHash: await getBootstrapPasswordHash(),
    }
  }
}

export async function verifyAdminLogin(email: string, password: string): Promise<boolean> {
  const admin = await getAdminAuthRecord()
  if (email !== admin.email) return false
  return verifyPassword(password, admin.passwordHash)
}

export async function updateAdminPassword(currentPassword: string, newPassword: string) {
  const admin = await getAdminAuthRecord()

  const valid = await verifyPassword(currentPassword, admin.passwordHash)
  if (!valid) {
    throw new Error("Current password is incorrect")
  }

  if (!newPassword || newPassword.length < 8) {
    throw new Error("New password must be at least 8 characters long")
  }

  const passwordHash = await hashPassword(newPassword)
  memoryAdminPasswordHash = passwordHash

  try {
    await connectToDatabase()
    await AdminUserModel.findOneAndUpdate(
      { email: adminEmail },
      { passwordHash },
      { upsert: true, new: true }
    )
  } catch (err) {
    console.warn("DB update failed, using memory store:", (err as Error).message)
  }

  return true
}
