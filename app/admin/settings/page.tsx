import Link from 'next/link'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { ArrowRight, Save } from 'lucide-react'
import { COOKIE_NAME, isValidAdminSession } from '@/lib/admin-auth'
import { db } from '@/lib/db'
import { siteSettings } from '@/lib/db/schema'
import { updateSiteSettings } from '@/app/actions/posts'

export default async function SettingsPage() {
  const jar = await cookies()
  if (!isValidAdminSession(jar.get(COOKIE_NAME)?.value)) redirect('/login')
  const [settings] = await db.select().from(siteSettings).limit(1)
  return <main className="min-h-screen bg-background paper-grain px-4 py-8 sm:px-8" dir="rtl"><div className="mx-auto max-w-3xl"><Link href="/admin" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowRight data-icon="inline-start" />بازگشت به داشبورد</Link><header className="mt-8 border-b border-border pb-6"><p className="text-sm font-bold text-primary">تنظیمات سایت</p><h1 className="mt-2 text-3xl font-black">هویت و معرفی وبلاگ</h1><p className="mt-2 text-sm text-muted-foreground">متن‌هایی که در صفحه اصلی و بخش درباره نمایش داده می‌شوند.</p></header><form action={async (formData) => { 'use server'; await updateSiteSettings({ siteName: String(formData.get('siteName') ?? ''), heroText: String(formData.get('heroText') ?? ''), bio: String(formData.get('bio') ?? ''), profileImage: String(formData.get('profileImage') ?? '') }) }} className="mt-8 flex flex-col gap-5 rounded-2xl border border-border bg-card p-5 sm:p-7"><label className="flex flex-col gap-2 text-sm font-bold">نام سایت<input name="siteName" defaultValue={settings?.siteName ?? 'sevo personal blog'} className="min-h-12 rounded-xl border border-input bg-background px-4 text-base font-normal" /></label><label className="flex flex-col gap-2 text-sm font-bold">متن اصلی hero<textarea name="heroText" defaultValue={settings?.heroText ?? 'فکرها، تجربه‌ها و چیزهایی که ارزش به یاد سپردن دارند.'} rows={3} className="rounded-xl border border-input bg-background p-4 text-base font-normal leading-7" /></label><label className="flex flex-col gap-2 text-sm font-bold">معرفی کوتاه<textarea name="bio" defaultValue={settings?.bio ?? ''} rows={4} className="rounded-xl border border-input bg-background p-4 text-base font-normal leading-7" /></label><label className="flex flex-col gap-2 text-sm font-bold">لینک تصویر پروفایل<input name="profileImage" defaultValue={settings?.profileImage ?? ''} placeholder="https://..." className="min-h-12 rounded-xl border border-input bg-background px-4 text-base font-normal" /></label><button type="submit" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground hover:-translate-y-0.5"><Save data-icon="inline-start" />ذخیره تنظیمات</button></form></div></main>
}
