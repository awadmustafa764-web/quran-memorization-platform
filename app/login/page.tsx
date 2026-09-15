'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, Mail, Lock, ChevronLeft, AlertCircle } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { useData } from '@/contexts/data-context'
import { dashboardPath } from '@/lib/format'

export default function LoginPage() {
  const { user, ready, login } = useAuth()
  const { store } = useData()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (ready && user) {
      router.replace(dashboardPath(user.role))
    }
  }, [ready, user, router])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    // التحقق من البريد وكلمة المرور عبر سياق المصادقة
    const success = login(email, password)
    if (!success) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة!')
      return
    }

    // البحث عن المستخدم للتعرف على دوره وتوجيهه تلقائياً للوحة الخاصة به
    const foundUser = store.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    )

    if (foundUser) {
      router.replace(dashboardPath(foundUser.role))
    } else {
      router.replace('/')
    }
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
            <p className="font-display text-lg font-bold">مدرسة بني قدامة لتحفيظ القران</p>
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

        <p className="text-sm text-primary-foreground/60">© {new Date().getFullYear()} مدرسة بني قدامة لتحفيظ القران</p>
      </section>

      {/* Form panel */}
      <section className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="flex size-11 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <BookOpen className="size-6" />
            </span>
            <div>
              <p className="font-display text-lg font-bold text-foreground">مدرسة بني قدامة لتحفيظ القران</p>
              <p className="text-sm text-muted-foreground">لتحفيظ القرآن الكريم</p>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-6 shadow-sm sm:p-8">
            <h1 className="font-display text-2xl font-bold text-foreground">تسجيل الدخول</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              أدخل بريدك الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم
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
                    placeholder="admin@tibyan.sa"
                    className="w-full rounded-lg border border-input bg-background py-2.5 pr-10 pl-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                    dir="ltr"
                    required
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
                    className="w-full rounded-lg border border-input bg-background py-2.5 pr-10 pl-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 font-mono"
                    dir="ltr"
                    required
                  />
                </div>
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
                تسجيل الدخول
                <ChevronLeft className="size-4" />
              </button>
            </form>

            <div className="mt-6 border-t border-border pt-4 text-center text-xs text-muted-foreground">
              حساب المدير الافتراضي: <span className="font-mono text-foreground" dir="ltr">admin@tibyan.sa</span> (كلمة السر: <span className="font-mono text-foreground">123456</span>)
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
