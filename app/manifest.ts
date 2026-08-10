import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return { name: 'sevo personal blog', short_name: 'یادداشت‌ها', description: 'دفتر عمومی برای فکر کردن، ساختن و یاد گرفتن.', start_url: '/', display: 'standalone', background_color: '#f7f5f0', theme_color: '#183b56', dir: 'rtl', lang: 'fa' }
}
