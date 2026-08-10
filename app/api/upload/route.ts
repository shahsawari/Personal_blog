import { put } from '@vercel/blob'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

export async function POST(request: Request) {
  const jar = await cookies()
  if (!isValidAdminSession(jar.get(COOKIE_NAME)?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const formData = await request.formData()
  const file = formData.get('file')
  if (!(file instanceof File) || !file.type.startsWith('image/')) return NextResponse.json({ error: 'فقط فایل تصویری مجاز است.' }, { status: 400 })
  if (file.size > 8 * 1024 * 1024) return NextResponse.json({ error: 'حداکثر حجم تصویر ۸ مگابایت است.' }, { status: 400 })
  const blob = await put(`blog/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '-')}`, file, { access: 'public' })
  return NextResponse.json({ url: blob.url })
}
