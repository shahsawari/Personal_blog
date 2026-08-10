import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import BlogHome, { type PostCard } from '@/components/blog-home'

export const dynamic = 'force-dynamic'

export default async function Page() {
  let items: PostCard[] = []
  try {
    const rows = await db
      .select()
      .from(posts)
      .where(eq(posts.status, 'published'))
      .orderBy(desc(posts.publishedAt), desc(posts.createdAt))
      .limit(3)
    items = rows.map((p) => ({
      title: p.title,
      excerpt: p.excerpt ?? '',
      slug: p.slug,
      date: p.publishedAt?.toLocaleDateString('fa-IR') ?? '—',
      time: `${p.readingTime} دقیقه`,
      cover: p.coverImage ?? null,
      category: 'یادداشت',
      tags: [],
    }))
  } catch {
    items = []
  }
  return <BlogHome posts={items} />
}
