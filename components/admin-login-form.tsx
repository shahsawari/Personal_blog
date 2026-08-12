'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email: email.trim(), password }) })
      const result = await response.json().catch(() => ({}))
      if (!response.ok) setError(result.error ?? 'ورود انجام نشد.')
      else { router.push('/admin'); router.refresh() }
    } catch {
      setError('ارتباط با سرور برقرار نشد. دوباره تلاش کنید.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-2"><label htmlFor="email" className="text-sm font-medium">ایمیل ادمین</label><input id="email" type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-primary" /></div>
      <div className="space-y-2"><label htmlFor="password" className="text-sm font-medium">رمز عبور</label><input id="password" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full rounded-xl border border-border bg-background px-4 text-base outline-none focus:border-primary" /></div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <button disabled={loading} className="h-12 w-full rounded-xl bg-primary px-5 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60">{loading ? 'در حال ورود…' : 'ورود به پنل مدیریت'}</button>
    </form>
  )
}
