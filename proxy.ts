import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

export function proxy(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/admin')) return NextResponse.next()
  if (request.nextUrl.pathname === '/admin/login') return NextResponse.next()
  try {
    if (isValidAdminSession(request.cookies.get(COOKIE_NAME)?.value)) return NextResponse.next()
  } catch {}
  return NextResponse.redirect(new URL('/login', request.url))
}

export const config = { matcher: ['/admin/:path*'] }
