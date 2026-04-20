import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { getUserByEmail, createUser, updateUserGoogleId, createSession } from "@/lib/auth"
import { query } from "@/lib/db"

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI || "http://localhost:3000/api/auth/google/callback"

interface GoogleTokenResponse {
  access_token: string
  id_token: string
  expires_in: number
  token_type: string
  scope: string
  refresh_token?: string
}

interface GoogleUserInfo {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  const cookieStore = await cookies()
  const callbackUrl = cookieStore.get("oauth-callback-url")?.value || "/"

  // Clean up the callback URL cookie
  cookieStore.delete("oauth-callback-url")

  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(error)}`, request.url)
    )
  }

  if (!code) {
    return NextResponse.redirect(
      new URL("/login?error=No authorization code received", request.url)
    )
  }

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID || "",
        client_secret: GOOGLE_CLIENT_SECRET || "",
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error("Token exchange failed:", errorData)
      return NextResponse.redirect(
        new URL("/login?error=Failed to authenticate with Google", request.url)
      )
    }

    const tokens: GoogleTokenResponse = await tokenResponse.json()

    // Get user info from Google
    const userInfoResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      }
    )

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(
        new URL("/login?error=Failed to get user information", request.url)
      )
    }

    const googleUser: GoogleUserInfo = await userInfoResponse.json()

    // Check if user exists
    let user = await getUserByEmail(googleUser.email)

    if (user) {
      // User exists, update Google ID if not set
      if (!user.google_id) {
        await updateUserGoogleId(user.id, googleUser.id, googleUser.picture)
      }

      if (!user.is_active) {
        return NextResponse.redirect(
          new URL("/login?error=Your account has been deactivated", request.url)
        )
      }
    } else {
      // Create new user
      const result = await createUser({
        email: googleUser.email,
        name: googleUser.name,
        googleId: googleUser.id,
        avatar: googleUser.picture,
      })

      const insertId = (result as any).insertId
      const users = await query("SELECT id, email, name, role, avatar_url as avatar FROM users WHERE id = ?", [insertId])
      user = (users as any[])[0]
    }

    // Create session
    await createSession({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar || user.avatar_url || googleUser.picture,
    })

    return NextResponse.redirect(new URL(callbackUrl, request.url))
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(
      new URL("/login?error=Authentication failed", request.url)
    )
  }
}
