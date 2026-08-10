import { put } from '@vercel/blob'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { randomUUID } from 'node:crypto'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

const MAX_IMAGE_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])

export async function POST(request: Request) {
  const jar = await cookies()
  if (!isValidAdminSession(jar.get(COOKIE_NAME)?.value)) {
    return NextResponse.json({ error: 'دسترسی غیرمجاز است.' }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'فایلی انتخاب نشده است.' }, { status: 400 })
    }
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: 'فرمت مجاز: JPG، PNG، WebP یا GIF.' }, { status: 400 })
    }
    if (file.size === 0 || file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ error: 'حجم تصویر باید کمتر از ۸ مگابایت باشد.' }, { status: 400 })
    }

    const extension = file.type.split('/')[1].replace('jpeg', 'jpg')
    const blob = await put(`blog/${randomUUID()}.${extension}`, file, {
      access: 'public',
      addRandomSuffix: false,
      contentType: file.type,
    })

    return NextResponse.json({ url: blob.url, pathname: blob.pathname })
  } catch (error) {
    console.error('[v0] Image upload failed:', error)
    return NextResponse.json({ error: 'آپلود تصویر انجام نشد. دوباره تلاش کنید.' }, { status: 500 })
  }
}
