import { notFound } from 'next/navigation'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import NewPostForm from '@/components/new-post-form'

export const dynamic = 'force-dynamic'

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [post] = await db.select().from(posts).where(eq(posts.id, id)).limit(1)
  if (!post) notFound()
  return <main className="min-h-screen bg-background px-5 py-10 sm:px-8"><div className="mx-auto max-w-5xl"><a href="/admin" className="text-sm text-muted-foreground">بازگشت به داشبورد</a><h1 className="mt-8 text-3xl font-bold">ویرایش نوشته</h1><p className="mt-2 text-muted-foreground">محتوا و وضعیت انتشار را به‌روزرسانی کنید.</p><div className="mt-8"><NewPostForm initialPost={{ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt ?? '', content: post.content as Record<string, unknown>, coverImage: post.coverImage, status: post.status }} /></div></div></main>
}
