import { connectToDatabase } from "./mongodb"
import { AdminUserModel } from "./models/AdminUser"

let memoryAdminPassword = process.env.ADMIN_PASSWORD || "admin123"
const adminEmail = process.env.ADMIN_EMAIL || "admin@manjil.dev"

export async function getAdminCredentials() {
  try {
    await connectToDatabase()
    let admin = await AdminUserModel.findOne({ email: adminEmail }).lean()
    if (!admin) {
      admin = await AdminUserModel.create({
        email: adminEmail,
        passwordHash: memoryAdminPassword,
      })
    }
    return {
      email: admin.email,
      password: admin.passwordHash,
    }
  } catch (err) {
    console.warn("Using memory admin credentials:", (err as Error).message)
    return {
      email: adminEmail,
      password: memoryAdminPassword,
    }
  }
}

export async function updateAdminPassword(currentPassword: string, newPassword: string) {
  const creds = await getAdminCredentials()

  if (currentPassword !== creds.password) {
    throw new Error("Current password is incorrect")
  }

  if (!newPassword || newPassword.length < 4) {
    throw new Error("New password must be at least 4 characters long")
  }

  try {
    await connectToDatabase()
    await AdminUserModel.findOneAndUpdate(
      { email: adminEmail },
      { passwordHash: newPassword },
      { upsert: true, new: true }
    )
  } catch (err) {
    console.warn("DB update failed, using memory store:", (err as Error).message)
  }

  memoryAdminPassword = newPassword
  return true
}
