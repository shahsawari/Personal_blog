import NewPostForm from '@/components/new-post-form'

export default function NewPostPage() { return <main className="min-h-screen bg-background px-5 py-10 sm:px-8"><div className="mx-auto max-w-5xl"><a href="/admin" className="text-sm text-muted-foreground">بازگشت به داشبورد</a><h1 className="mt-8 text-3xl font-bold">نوشته جدید</h1><p className="mt-2 text-muted-foreground">مقاله را بنویسید و به‌صورت پیش‌نویس یا منتشرشده ذخیره کنید.</p><div className="mt-8"><NewPostForm /></div></div></main> }
