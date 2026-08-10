import Link from 'next/link'
import { and, desc, eq, or, ilike } from 'drizzle-orm'
import { ArrowLeft, Clock3 } from 'lucide-react'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'

export const dynamic = 'force-dynamic'

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams
  const query = q.trim()
  const publishedPosts = await db.select().from(posts).where(query ? and(eq(posts.status, 'published'), or(ilike(posts.title, `%${query}%`), ilike(posts.excerpt, `%${query}%`), ilike(posts.slug, `%${query}%`))) : eq(posts.status, 'published')).orderBy(desc(posts.publishedAt), desc(posts.createdAt))
  return <main className="min-h-screen bg-background px-5 py-8 text-foreground md:px-8 md:py-12" dir="rtl"><div className="mx-auto max-w-4xl"><Link href="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> بازگشت به خانه</Link><header className="py-16"><p className="mb-3 text-sm font-bold text-primary">آرشیو نوشته‌ها</p><h1 className="text-4xl font-bold tracking-tight md:text-6xl">همه نوشته‌ها</h1><p className="mt-5 max-w-xl leading-8 text-muted-foreground">یادداشت‌هایی درباره زندگی، تکنولوژی و ایده‌هایی که هنوز در حال شکل گرفتن‌اند.</p><form className="mt-8 flex max-w-xl gap-3" role="search"><input name="q" defaultValue={query} placeholder="جستجو در عنوان و خلاصه…" className="h-12 min-w-0 flex-1 rounded-xl border border-border bg-background px-4 text-base" /><button className="h-12 rounded-xl bg-primary px-5 text-sm font-medium text-primary-foreground">جستجو</button></form></header><div className="divide-y divide-border border-y border-border">{publishedPosts.map((post) => <article key={post.id} className="py-8"><Link href={`/blog/${post.slug}`} className="group"><div className="mb-3 flex items-center gap-3 text-xs text-muted-foreground"><span>{post.publishedAt?.toLocaleDateString('fa-IR') ?? 'پیش‌نویس'}</span><span className="size-1 rounded-full bg-border" /><span className="flex items-center gap-1"><Clock3 className="size-3" />{post.readingTime} دقیقه مطالعه</span></div><h2 className="text-2xl font-bold group-hover:text-primary">{post.title}</h2><p className="mt-3 max-w-2xl leading-8 text-muted-foreground">{post.excerpt}</p></Link></article>)}{publishedPosts.length === 0 && <p className="py-16 text-center text-muted-foreground">هنوز نوشته‌ای منتشر نشده است.</p>}</div></div></main>
}
