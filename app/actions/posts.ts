'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
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
