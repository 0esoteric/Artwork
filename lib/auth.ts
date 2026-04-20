import { cookies } from "next/headers"
import { jwtVerify, SignJWT } from "jose"
import bcrypt from "bcryptjs"
import { query } from "./db"

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export interface User {
  id: number
  email: string
  name: string
  role: "customer" | "admin"
  avatar?: string
}

export interface Session {
  user: User
  expires: Date
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export async function createSession(user: User): Promise<string> {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

  const token = await new SignJWT({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    avatar: user.avatar,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(JWT_SECRET)

  const cookieStore = await cookies()
  cookieStore.set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  })

  return token
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")?.value

  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)

    return {
      user: {
        id: payload.userId as number,
        email: payload.email as string,
        name: payload.name as string,
        role: payload.role as "customer" | "admin",
        avatar: payload.avatar as string | undefined,
      },
      expires: new Date((payload.exp as number) * 1000),
    }
  } catch {
    return null
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getUserByEmail(email: string) {
  const result = await query(
    "SELECT id, email, name, password_hash, role, is_active, avatar_url as avatar, provider_id as google_id FROM users WHERE email = ?",
    [email]
  )
  return (result as any[])[0] || null
}

export async function createUser(data: {
  email: string
  name: string
  password?: string
  googleId?: string
  avatar?: string
}) {
  const passwordHash = data.password ? await hashPassword(data.password) : null
  const provider = data.googleId ? "google" : "email"

  const result = await query(
    `INSERT INTO users (email, name, password_hash, provider_id, avatar_url, role, provider, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'customer', ?, NOW(), NOW())`,
    [data.email, data.name, passwordHash, data.googleId || null, data.avatar || null, provider]
  )

  return result
}

export async function updateUserGoogleId(userId: number, googleId: string, avatar?: string) {
  await query(
    "UPDATE users SET provider_id = ?, avatar_url = COALESCE(?, avatar_url), provider = 'google', updated_at = NOW() WHERE id = ?",
    [googleId, avatar, userId]
  )
}
