import type { Store } from './types'

const STORAGE_KEY = 'tibyan_store_v1'

// Seed data mimicking a relational database. Passwords are mock only.
export const seedStore: Store = {
  users: [
    { id: 'u_admin', name: 'إدارة الدار', role: 'admin', email: 'admin@tibyan.sa', password: '123456' },
    { id: 'u_t1', name: 'الشيخ أحمد المقرئ', role: 'teacher', email: 'ahmad@tibyan.sa', password: '123456' },
    { id: 'u_t2', name: 'الشيخ يوسف الحافظ', role: 'teacher', email: 'yusuf@tibyan.sa', password: '123456' },
  ],

  enrollments: [],

  sessions: [],

  evaluations: [],

  assignments: [],
}

function todayISO(offsetDays: number): string {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return d.toISOString().slice(0, 10)
}

export function loadStore(): Store {
  if (typeof window === 'undefined') return seedStore
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(seedStore))
      return seedStore
    }
    return JSON.parse(raw) as Store
  } catch {
    return seedStore
  }
}

export function saveStore(store: Store): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore quota / serialization errors in mock layer
  }
}

export function newId(prefix: string): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`
}

export const AUTH_KEY = 'tibyan_auth_user_v1'
