import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { desc } from 'drizzle-orm'
import { FileText, ImageIcon, Plus, Settings2 } from 'lucide-react'
import { db } from '@/lib/db'
import { posts } from '@/lib/db/schema'
import AdminPostsTable from '@/components/admin-posts-table'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

const navItems = [{ href: '/admin', label: 'نوشته‌ها', icon: FileText }, { href: '/admin/new', label: 'نوشته جدید', icon: Plus }, { href: '/admin/media', label: 'رسانه‌ها', icon: ImageIcon }, { href: '/admin/settings', label: 'تنظیمات سایت', icon: Settings2 }]

export default async function AdminPage() {
  const cookieStore = await cookies()
  if (!isValidAdminSession(cookieStore.get(COOKIE_NAME)?.value)) redirect('/login')
  const allPosts = await db.select().from(posts).orderBy(desc(posts.updatedAt))
  const published = allPosts.filter((post) => post.status === 'published').length
  const drafts = allPosts.length - published
  return <main className="min-h-screen bg-background paper-grain" dir="rtl"><div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:flex-row lg:gap-10 lg:px-8 lg:py-8"><aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:w-64 lg:shrink-0"><div className="flex items-center justify-between lg:block"><div><Link href="/" className="font-mono text-sm font-bold tracking-tight text-primary">SEVO / STUDIO</Link><p className="mt-2 text-xs text-muted-foreground">اتاق تحریریه شخصی</p></div><form action="/api/admin/logout" method="post" className="lg:mt-10"><button className="min-h-11 rounded-lg border border-border px-3 text-sm hover:bg-muted">خروج</button></form></div><nav className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:flex lg:flex-col">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm ${href === '/admin' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}><Icon data-icon="inline-start" />{label}</Link>)}</nav><div className="mt-8 hidden rounded-2xl border border-border bg-card p-4 lg:block"><p className="text-xs font-bold text-primary">وضعیت سایت</p><p className="mt-3 text-sm leading-6 text-muted-foreground">پایگاه داده متصل است و محتوا از Neon خوانده می‌شود.</p></div></aside><section className="min-w-0 flex-1"><header className="flex flex-col gap-5 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold text-primary">داشبورد تحریریه</p><h1 className="mt-2 text-3xl font-black tracking-tight sm:text-4xl">مرکز محتوا</h1><p className="mt-2 text-sm text-muted-foreground">نوشته‌ها، رسانه و هویت سایت را از یکجا کنترل کنید.</p></div><Link href="/admin/new" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5"><Plus data-icon="inline-start" /> نوشته جدید</Link></header><div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">کل نوشته‌ها</p><p className="mt-4 text-3xl font-black">{allPosts.length}</p><p className="mt-2 text-xs text-muted-foreground">در آرشیو تحریریه</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">منتشر شده</p><p className="mt-4 text-3xl font-black text-primary">{published}</p><p className="mt-2 text-xs text-muted-foreground">قابل مشاهده برای مخاطب</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">پیش‌نویس</p><p className="mt-4 text-3xl font-black">{drafts}</p><p className="mt-2 text-xs text-muted-foreground">در انتظار تکمیل</p></div></div><div className="mt-6"><AdminPostsTable posts={allPosts} /></div></section></div></main>
}
