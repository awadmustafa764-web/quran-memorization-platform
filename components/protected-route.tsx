'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/auth-context'
import { dashboardPath } from '@/lib/format'
import type { Role } from '@/lib/types'

export function ProtectedRoute({
  role,
  children,
}: {
  role: Role
  children: React.ReactNode
}) {
  const { user, ready } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!ready) return
    if (!user) {
      router.replace('/login')
    } else if (user.role !== role) {
      // Send users to their own dashboard rather than an unauthorized page.
      router.replace(dashboardPath(user.role))
    }
  }, [ready, user, role, router])

  if (!ready || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
