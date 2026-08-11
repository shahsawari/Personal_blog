'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { posts, siteSettings } from '@/lib/db/schema'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

async function requireAdmin() { const jar = await cookies(); if (!isValidAdminSession(jar.get(COOKIE_NAME)?.value)) throw new Error('Unauthorized') }

export type PostInput = { title: string; slug: string; excerpt: string; content: Record<string, unknown>; coverImage: string | null; status: 'draft' | 'published'; readingTime: number }

export async function createPost(input: PostInput) {
  await requireAdmin()
  if (!input.title.trim() || !input.slug.trim()) throw new Error('Title and slug are required')
  const now = new Date()
  await db.insert(posts).values({ id: randomUUID(), title: input.title.trim(), slug: input.slug.trim(), excerpt: input.excerpt.trim(), content: input.content, coverImage: input.coverImage || null, status: input.status, readingTime: input.readingTime, publishedAt: input.status === 'published' ? now : null, updatedAt: now })
  revalidatePath('/blog'); revalidatePath(`/blog/${input.slug}`); revalidatePath('/admin')
}

export async function updatePost(id: string, input: PostInput) {
  await requireAdmin()
  if (!input.title.trim() || !input.slug.trim()) throw new Error('Title and slug are required')
  const now = new Date()
  await db.update(posts).set({ title: input.title.trim(), slug: input.slug.trim(), excerpt: input.excerpt.trim(), content: input.content, coverImage: input.coverImage || null, status: input.status, readingTime: input.readingTime, publishedAt: input.status === 'published' ? now : null, updatedAt: now }).where(eq(posts.id, id))
  revalidatePath('/blog'); revalidatePath(`/blog/${input.slug}`); revalidatePath('/admin')
}

export async function deletePost(id: string) {
  await requireAdmin()
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
