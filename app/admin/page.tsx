import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'

export default async function AdminPage() {
  const cookieStore = await cookies()
  if (!isValidAdminSession(cookieStore.get(COOKIE_NAME)?.value)) redirect('/login')
  return <main className="min-h-screen bg-background px-5 py-10 sm:px-8"><div className="mx-auto max-w-5xl"><div className="flex items-start justify-between gap-4"><div><p className="text-sm font-medium text-primary">مدیریت محتوا</p><h1 className="mt-2 text-3xl font-bold">داشبورد</h1><p className="mt-2 text-muted-foreground">از اینجا نوشته‌های وبلاگ را مدیریت کنید.</p><a href="/admin/new" className="mt-5 inline-flex rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">نوشته جدید</a></div><form action="/api/admin/logout" method="post"><button className="rounded-xl border border-border px-4 py-2 text-sm hover:bg-muted">خروج</button></form></div><div className="mt-10 grid gap-4 sm:grid-cols-3"><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">کل نوشته‌ها</p><p className="mt-3 text-3xl font-bold">—</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">پیش‌نویس‌ها</p><p className="mt-3 text-3xl font-bold">—</p></div><div className="rounded-2xl border border-border bg-card p-5"><p className="text-sm text-muted-foreground">منتشرشده</p><p className="mt-3 text-3xl font-bold">—</p></div></div></div></main>
}
