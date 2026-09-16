'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { User } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  login: (email: string, pass: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // عشان يضل مسجل دخول إذا عملت تحديث للصفحة
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email: string, pass: string) => {
    try {
      // البحث عن المستخدم مباشرة من قاعدة بيانات Supabase
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('password', pass)
        .single()

      if (data) {
        const loggedInUser: User = {
          id: data.id,
          name: data.name,
          email: data.email,
          role: data.role,
          password: data.password,
          createdAt: data.created_at
        }
        setUser(loggedInUser)
        localStorage.setItem('currentUser', JSON.stringify(loggedInUser))
        return true
      }
      
      return false
    } catch (error) {
      console.error('Login error:', error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
