'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Mail, Lock, ChevronLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import type { Role } from '@/lib/types'
import { roleLabels, dashboardPath } from '@/lib/format'

const roleOptions: { value: Role; label: string; hint: string }[] = [
  { value: 'admin', label: 'مدير', hint: 'admin@tibyan.sa' },
  { value: 'teacher', label: 'محفّظ', hint: 'ahmad@tibyan.sa' },
  { value: 'student', label: 'طالب', hint: 'abdullah@tibyan.sa' },
]

export default function LoginPage() {
  const { user, ready, login } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('teacher')
  const [error, setError] = useState('')

  useEffect(() => {
    if (ready && user) {
      router.replace(dashboardPath(user.role))
    }
  }, [ready, user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const result = login(email, password, role)
    if (!result.ok) {
      setError(result.error ?? 'تعذّر تسجيل الدخول')
      return
    }
    router.replace(dashboardPath(role))
  }

  return (
    <main className="grid min-h-screen bg-background lg:grid-cols-2">
      {/* Brand panel */}
      <section className="relative hidden flex-col justify-between overflow-hidden bg-primary p-12 text-primary-foreground lg:flex">
        <div className="flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-lg bg-primary-foreground/10">
            <BookOpen className="size-6" />
          </span>
          <div>
            <p className="font-display text-lg font-bold">دار التبيان</p>
            <p className="text-sm text-primary-foreground/70">لتحفيظ القرآن الكريم</p>
          </div>
        </div>

        <div className="max-w-md">
          <p className="font-display text-3xl font-bold leading-relaxed text-balance">
            خيركم من تعلّم القرآن وعلّمه
          </p>
          <p className="mt-4 leading-relaxed text-primary-foreground/70">
            منصة متكاملة لإدارة حلقات التحفيظ، متابعة تقدّم الطلاب، وتنظيم الجلسات والتقييمات في مكان
            واحد.
          </p>
        </div>

        <p className="text-sm text-primary-foreground/60">© {new Date().getFullYear()} دار التبيان</p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-6" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-foreground">دار التبيان</p>
              <p className="text-sm text-muted-foreground">لتحفيظ القرآن الكريم</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="font-display text-2xl font-bold text-foreground">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              أدخل بياناتك للوصول إلى لوحة التحكم الخاصة بك
            </p>

            <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  البريد الإلكتروني
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@tibyan.sa"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pr-10 pl-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  كلمة المرور
                </label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pr-10 pl-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="role" className="text-sm font-medium text-foreground">
                  الدخول كـ (للتجربة)
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  {roleOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label} — {o.hint}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-muted-foreground">
                  اترك الحقول فارغة للدخول السريع بالدور المحدد. كلمة المرور للحسابات التجريبية:
                  <span className="font-medium text-foreground"> 123456</span>
                </p>
              </div>

              {error ? (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0" />
                  <span>{error}</span>
                </div>
              ) : null}

              <button
                type="submit"
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                دخول لوحة {roleLabels[role]}
                <ChevronLeft className="size-4" />
              </button>
            </form>
          </div>
        </div>
      </section>
    </main>
  )
}
