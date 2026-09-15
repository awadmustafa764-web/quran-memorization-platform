'use client'

import { useRouter } from 'next/navigation'
import { BookOpen, LogOut } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { roleLabels } from '@/lib/format'

export function Navigation({ subtitle }: { subtitle?: string }) {
  const { user, logout } = useAuth()
  const router = useRouter()

  if (!user) return null

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <BookOpen className="size-5" />
          </span>
          <div>
            <p className="font-display text-base font-bold leading-tight text-foreground">مدرسة بني قدامة لتحفيظ القران</p>
            <p className="text-xs text-muted-foreground">{subtitle ?? 'لتحفيظ القرآن الكريم'}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-left">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
          </div>
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-primary">
            {user.name.charAt(0)}
          </span>
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </div>
    </header>
  )
}
