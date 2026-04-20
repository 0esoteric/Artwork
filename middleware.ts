import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/request'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      // Redirect to home if not logged in
      return NextResponse.redirect(new URL('/', request.url))
    }

    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)
      
      // Check if user is admin
      if (payload.role !== 'admin') {
        return NextResponse.redirect(new URL('/', request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
