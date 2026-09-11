'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Role, User } from '@/lib/types'
import { AUTH_KEY } from '@/lib/store'
import { useData } from './data-context'

interface AuthContextValue {
  user: User | null
  ready: boolean
  login: (email: string, password: string, role: Role) => { ok: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { store, ready: dataReady } = useData()
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!dataReady) return
    try {
      const raw = window.localStorage.getItem(AUTH_KEY)
      if (raw) {
        const stored = JSON.parse(raw) as { id: string }
        const found = store.users.find((u) => u.id === stored.id)
        if (found) setUser(found)
      }
    } catch {
      // ignore
    }
    setReady(true)
  }, [dataReady, store.users])

  const login = useCallback(
    (email: string, password: string, role: Role) => {
      // Mock auth: match by role first (dropdown bypass), then validate credentials if provided.
      const byRole = store.users.filter((u) => u.role === role)
      if (byRole.length === 0) return { ok: false, error: 'لا يوجد مستخدم بهذا الدور' }

      const trimmedEmail = email.trim()
      let target: User | undefined

      if (trimmedEmail) {
        target = byRole.find((u) => u.email === trimmedEmail)
        if (!target) return { ok: false, error: 'البريد الإلكتروني غير مسجل لهذا الدور' }
        if (password && target.password !== password) {
          return { ok: false, error: 'كلمة المرور غير صحيحة' }
        }
      } else {
        // Quick bypass for testing: pick the first user of the selected role.
        target = byRole[0]
      }

      setUser(target)
      window.localStorage.setItem(AUTH_KEY, JSON.stringify({ id: target.id }))
      return { ok: true }
    },
    [store.users],
  )

  const logout = useCallback(() => {
    setUser(null)
    window.localStorage.removeItem(AUTH_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ user, ready, login, logout }}>{children}</AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
