import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter, Vazirmatn } from 'next/font/google'
import './globals.css'

const vazirmatn = Vazirmatn({ subsets: ['arabic'], variable: '--font-vazirmatn' })
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'sevo personal blog | نوشته‌های سروش',
  description: 'فکرها، تجربه‌ها و چیزهایی که ارزش به یاد سپردن دارند.',
  generator: 'Next.js',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark',
  themeColor: '#11151f',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fa" dir="rtl" className="bg-background"><body className={`${vazirmatn.variable} ${inter.variable} antialiased`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
