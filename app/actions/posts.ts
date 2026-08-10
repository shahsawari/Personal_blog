'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { randomUUID } from 'node:crypto'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

async function requireAdmin() { const jar = await cookies(); if (!isValidAdminSession(jar.get(COOKIE_NAME)?.value)) throw new Error('Unauthorized') }

export async function createPost(input: { title: string; slug: string; excerpt: string; content: Record<string, unknown>; status: string; readingTime: number }) {
  await requireAdmin()
  const now = new Date()
  await db.insert(posts).values({ id: randomUUID(), title: input.title, slug: input.slug, excerpt: input.excerpt, content: input.content, status: input.status, readingTime: input.readingTime, publishedAt: input.status === 'published' ? now : null, updatedAt: now })
  revalidatePath('/blog'); revalidatePath(`/blog/${input.slug}`); revalidatePath('/admin')
}
