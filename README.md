# sevo personal blog

یک وبلاگ شخصی فارسی با Next.js، دیتابیس Postgres و ویرایشگر نوشتار (Tiptap).

## پیش‌نیازها

- Node.js 20+
- یک پایگاه Postgres (محلی یا سرویس ابری)

## راه‌اندازی

1. بسته‌ها را نصب کنید:

   ```bash
   pnpm install
   ```

2. فایل `.env.local` را از روی `.env.example` بسازید و مقادیر را پر کنید:

   ```bash
   cp .env.example .env.local
   ```

   متغیرهای مورد نیاز:

   | متغیر | کاربرد |
   | --- | --- |
   | `DATABASE_URL` | رشته اتصال به Postgres |
   | `ADMIN_EMAIL` | ایمیل ورود به پنل مدیریت |
   | `ADMIN_PASSWORD` | رمز عبور پنل مدیریت |
   | `ADMIN_AUTH_SECRET` | کلید امضای نشست (تصادفی، حداقل ۳۲ کاراکتر) |
   | `BLOB_READ_WRITE_TOKEN` | توکن Vercel Blob برای بارگذاری تصویر (اختیاری) |
   | `BETTER_AUTH_URL` | آدرس پایه سایت برای sitemap/rss (مثلاً https://example.com) |

3. جدول‌ها را بسازید (یک‌بار، با drizzle-kit یا دستی طبق `lib/db/schema.ts`).

4. سرور را اجرا کنید:

   ```bash
   pnpm dev
   ```

   سپس به http://localhost:3000 بروید.

## افزودن نوشته‌ها

دو راه وجود دارد:

- از پنل مدیریت: `/admin` → ورود → «نوشته جدید».
- با اسکریپت بذر (برای انتشار دسته‌ای): محتوای نوشته در `scripts/post-content.json` قرار دارد و با دستور زیر به پایگاه اضافه می‌شود:

  ```bash
  DATABASE_URL="postgresql://user:pass@host:5432/db" pnpm seed
  ```

## ساختار

| مسیر | کاربرد |
| --- | --- |
| `app/` | صفحات و مسیرهای API |
| `components/` | اجزای رابط کاربری و ویرایشگر |
| `lib/db/` | اتصال دیتابیس و شِمای جداول |
| `public/images/` | تصاویر وبلاگ |
| `scripts/` | ابزارهای بذر و تولید محتوا |
