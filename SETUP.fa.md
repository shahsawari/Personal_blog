# راه‌اندازی وبلاگ (فارسی)

این نسخه دیباگ‌شده و بدون ردپای هوش مصنوعیه. برای اجرا:

## ۱. نصب بسته‌ها
```bash
pnpm install
```
(اگر `pnpm` نداری: `npm install -g pnpm`)

## ۲. تنظیم پایگاه داده
فایل `.env.local` بساز و مقادیر زیر رو بذار:
```
DATABASE_URL=postgresql://USER:PASS@HOST:5432/DBNAME
ADMIN_USERNAME=admin
ADMIN_PASSWORD=*****
SESSION_SECRET=یه-رشته-تصادفی-طولانی
```
یک پایگاه Postgres (محلی یا سرویس مثل Neon/Supabase) لازمه.

## ۳. ساخت جدول‌ها
پروژه از drizzle استفاده می‌کنه. جدول‌ها با اجرای کد (اولین بار که صفحه بار می‌شه یا seed) ساخته می‌شن،
یا اگر می‌خوای صریحاً:
```bash
pnpm drizzle-kit push   # اگر drizzle-kit تنظیم شده
```

## ۴. افزودن پست «شماره ۳»
اسکریپت `scripts/seed-post.mjs` پست رو به دیتابیس اضافه می‌کنه (idempotent — دوباره اجرا بی‌ضررِ):
```bash
node scripts/seed-post.mjs
```
محتوای پست توی `scripts/post-content.json` (فرمت Tiptap) هست.

## ۵. اجرا
```bash
pnpm dev
```
آدرس: http://localhost:3000
پنل ادمین: http://localhost:3000/login (با نام‌کاربری/رمزی که توی `.env.local` گذاشتی)

## تغییرات نسبت به نسخه اولیه
- صفحه اول وبلاگ به جای پست‌های فرضی، از دیتابیس می‌خونه.
- لینک «درباره من» به صفحه `/about` وصل شد (قبلاً وجود نداشت).
- فلش‌های بازگشت در حالت RTL اصلاح شدن.
- رندر نقل‌قول (blockquote) چندسطحی درست شد.
- ردپای v0 (README، نام پکیج `my-project`، .gitignore، تصاویر placeholder) پاک شد.
- `ignoreBuildErrors` از next.config حذف شد تا خطاهای تایپ دیده بشن.
- ۶ تصویر واقعی (پیرمرد، زمستان، کبوتر و...) توی `public/images/` اضافه شد.
