import { NextResponse } from 'next/server'
import { createAdminSession, COOKIE_NAME, SESSION_TTL_SECONDS, verifyAdminCredentials } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''

  try {
    if (!verifyAdminCredentials(email, password)) return NextResponse.json({ error: 'ایمیل یا رمز عبور اشتباه است.' }, { status: 401 })
    const response = NextResponse.json({ ok: true })
    response.cookies.set(COOKIE_NAME, createAdminSession(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    })
    return response
  } catch {
    return NextResponse.json({ error: 'تنظیمات احراز هویت کامل نشده است.' }, { status: 503 })
  }
}
