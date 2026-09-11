'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { User } from '@/lib/types'
import { useData } from '@/contexts/data-context'

const AUTH_KEY = 'tibyan_auth_user_v1'

interface AuthContextValue {
  user: User | null
  login: (email: string, pass: string) => boolean
  logout: () => void
  ready: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const { store } = useData()
  const router = useRouter()

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(AUTH_KEY)
      if (raw) {
        setUser(JSON.parse(raw))
      }
    } catch {
      // ignore
    }
    setReady(true)
  }, [])

  // دالة تسجيل الدخول الحقيقية بالبريد وكلمة المرور
  const login = useCallback((email: string, pass: string): boolean => {
    const found = store.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === pass
    )
    if (found) {
      setUser(found)
      try {
        window.localStorage.setItem(AUTH_KEY, JSON.stringify(found))
      } catch {
        // ignore
      }
      return true
    }
    return false
  }, [store.users])

  const logout = useCallback(() => {
    setUser(null)
    try {
      window.localStorage.removeItem(AUTH_KEY)
    } catch {
      // ignore
    }
    router.push('/login')
  }, [router])

  return (
    <AuthContext.Provider value={{ user, login, logout, ready }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
