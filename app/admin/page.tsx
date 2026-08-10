import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { desc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import AdminPostsTable from '@/components/admin-posts-table'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  if (!isValidAdminSession(cookieStore.get(COOKIE_NAME)?.value)) redirect('/login')
  const allPosts = await db.select().from(posts).orderBy(desc(posts.updatedAt))
  const published = allPosts.filter((post) => post.status === 'published').length
  const drafts = allPosts.length - published
  return <main className="min-h-screen bg-background px-5 py-10 sm:px-8"><div className="mx-auto flex max-w-6xl flex-col gap-8"><div className="flex items-start justify-between gap-4 border-b border-border pb-6"><div><p className="text-sm font-medium text-primary">مدیریت محتوا</p><h1 className="mt-2 text-3xl font-bold">داشبورد</h1><p className="mt-2 text-muted-foreground">از اینجا نوشته‌های وبلاگ را مدیریت کنید.</p></div><div className="flex items-center gap-3"><Link href="/admin/new" className="inline-flex min-h-11 items-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">نوشته جدید</Link><form action="/api/admin/logout" method="post"><button className="min-h-11 rounded-xl border border-border px-4 text-sm hover:bg-muted">خروج</button></form></div></div><div className="grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">کل نوشته‌ها</p><p className="mt-3 text-3xl font-bold">{allPosts.length}</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">پیش‌نویس‌ها</p><p className="mt-3 text-3xl font-bold">{drafts}</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">منتشرشده</p><p className="mt-3 text-3xl font-bold">{published}</p></div></div><AdminPostsTable posts={allPosts} /></div></main>
}
