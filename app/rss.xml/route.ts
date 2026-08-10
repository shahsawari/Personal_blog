import { desc, eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'

export async function GET() {
  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
  const published = await db.select().from(posts).where(eq(posts.status, 'published')).orderBy(desc(posts.publishedAt)).limit(30)
  const items = published.map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${baseUrl}/blog/${post.slug}</link><guid>${baseUrl}/blog/${post.slug}</guid><description><![CDATA[${post.excerpt ?? ''}]]></description><pubDate>${(post.publishedAt ?? post.createdAt).toUTCString()}</pubDate></item>`).join('')
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>sevo personal blog</title><link>${baseUrl}</link><description>دفتر عمومی برای فکر کردن، ساختن و یاد گرفتن.</description>${items}</channel></rss>`
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, s-maxage=3600' } })
}
