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

  // التعديل السحري هون: حطينا try/catch عشان لو الذاكرة مضروبة ما يعلق عجل التحميل للأبد
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('currentUser')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error('Error parsing user data:', error)
      localStorage.removeItem('currentUser') // إذا الذاكرة مضروبة بيمسحها
    } finally {
      setLoading(false) // بكل الأحوال بيطفي عجل التحميل
    }
  }, [])

  const login = async (email: string, pass: string) => {
    try {
      const cleanEmail = email.trim()
      const cleanPass = pass.trim()

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', cleanEmail)
        .eq('password', cleanPass)
        .maybeSingle()

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