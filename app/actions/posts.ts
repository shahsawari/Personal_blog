'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { posts, siteSettings } from '@/lib/db/schema'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'
import { z } from 'zod'

async function requireAdmin() { const jar = await cookies(); if (!isValidAdminSession(jar.get(COOKIE_NAME)?.value)) throw new Error('Unauthorized') }

const postInputSchema = z.object({
  title: z.string().trim().min(1, 'عنوان الزامی است').max(180, 'عنوان بیش از حد طولانی است'),
  slug: z.string().trim().min(1, 'شناسه صفحه الزامی است').max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'شناسه صفحه باید انگلیسی و خط تیره‌دار باشد'),
  excerpt: z.string().trim().max(500),
  content: z.record(z.string(), z.unknown()),
  coverImage: z.string().url().max(2048).nullable(),
  status: z.enum(['draft', 'published']),
  readingTime: z.number().int().min(1).max(180),
})

export type PostInput = z.infer<typeof postInputSchema>

function validatePostInput(input: PostInput) {
  const parsed = postInputSchema.safeParse(input)
  if (!parsed.success) throw new Error(parsed.error.issues[0]?.message ?? 'اطلاعات پست نامعتبر است')
  return parsed.data
}

export async function createPost(input: PostInput) {
  await requireAdmin()
  const data = validatePostInput(input)
  const now = new Date()
  await db.insert(posts).values({ id: randomUUID(), title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content, coverImage: data.coverImage, status: data.status, readingTime: data.readingTime, publishedAt: data.status === 'published' ? now : null, updatedAt: now })
  revalidatePath('/'); revalidatePath('/blog'); revalidatePath(`/blog/${data.slug}`); revalidatePath('/admin')
}

export async function updatePost(id: string, input: PostInput) {
  await requireAdmin()
  if (!z.string().uuid().safeParse(id).success) throw new Error('شناسه پست نامعتبر است')
  const data = validatePostInput(input)
  const now = new Date()
  await db.update(posts).set({ title: data.title, slug: data.slug, excerpt: data.excerpt, content: data.content, coverImage: data.coverImage, status: data.status, readingTime: data.readingTime, publishedAt: data.status === 'published' ? now : null, updatedAt: now }).where(eq(posts.id, id))
  revalidatePath('/'); revalidatePath('/blog'); revalidatePath(`/blog/${data.slug}`); revalidatePath('/admin')
}

export async function deletePost(id: string) {
  await requireAdmin()
  if (!z.string().uuid().safeParse(id).success) throw new Error('شناسه پست نامعتبر است')
  await db.delete(posts).where(eq(posts.id, id))
  revalidatePath('/'); revalidatePath('/blog'); revalidatePath('/admin')
}

export type SiteSettingsInput = { siteName: string; heroText: string; bio: string; profileImage: string }

export async function updateSiteSettings(input: SiteSettingsInput) {
  await requireAdmin()
  if (!input.siteName.trim() || !input.heroText.trim()) throw new Error('نام سایت و متن اصلی الزامی است')
  const values = { siteName: input.siteName.trim(), heroText: input.heroText.trim(), bio: input.bio.trim() || null, profileImage: input.profileImage.trim() || null, updatedAt: new Date() }
  const [existing] = await db.select({ id: siteSettings.id }).from(siteSettings).limit(1)
  if (existing) await db.update(siteSettings).set(values).where(eq(siteSettings.id, existing.id))
  else await db.insert(siteSettings).values({ id: randomUUID(), ...values, socialLinks: {} })
  revalidatePath('/'); revalidatePath('/about'); revalidatePath('/admin/settings')
}
