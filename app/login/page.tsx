import Link from 'next/link'
import AdminLoginForm from '@/components/admin-login-form'

export const metadata = { title: 'ورود مدیر | sevo personal blog' }

export default function LoginPage() {
  return <main className="flex min-h-screen items-center justify-center bg-background px-5 py-12"><section className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"><Link href="/" className="text-sm text-muted-foreground hover:text-foreground">بازگشت به سایت</Link><div className="mt-10 space-y-3"><p className="text-sm font-medium text-primary">پنل خصوصی</p><h1 className="text-balance text-3xl font-bold tracking-tight">ورود مدیر</h1><p className="leading-7 text-muted-foreground">برای مدیریت نوشته‌ها، اطلاعات ورود تنظیم‌شده در متغیرهای محیطی را وارد کنید.</p></div><div className="mt-8"><AdminLoginForm /></div></section></main>
}
