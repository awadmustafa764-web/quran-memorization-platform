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
  // غيرناها لـ loading عشان تتطابق مع ملف المصادقة
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // إذا لسا بيحمل، ما تعمل إشي واستنى
    if (loading) return
    
    if (!user) {
      router.replace('/login')
    } else if (user.role !== role) {
      // توجيه المستخدمين للوحة الخاصة فيهم إذا حاولوا يدخلوا لوحة بالغلط
      router.replace(dashboardPath(user.role))
    }
  }, [loading, user, role, router])

  // إذا لسا بيحمل، أو ما في مستخدم، أو الدور مش مطابق، ضل طلع التحميل عبل ما يوجهه صح
  if (loading || !user || user.role !== role) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}