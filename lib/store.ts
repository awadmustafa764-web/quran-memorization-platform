import type { Store } from './types'

const STORAGE_KEY = 'tibyan_store_v1'

// Seed data mimicking a relational database. Passwords are mock only.
export const seedStore: Store = {
  users: [
    { id: 'u_admin', name: 'إدارة الدار', role: 'admin', email: 'admin@tibyan.sa', password: '123456' },

    { id: 'u_t1', name: 'الشيخ أحمد المقرئ', role: 'teacher', email: 'ahmad@tibyan.sa', password: '123456' },
    { id: 'u_t2', name: 'الشيخ يوسف الحافظ', role: 'teacher', email: 'yusuf@tibyan.sa', password: '123456' },

    {
      id: 'u_s1',
      name: 'عبد الله الزهراني',
      role: 'student',
      email: 'abdullah@tibyan.sa',
      password: '123456',
      level: 'سورة البقرة - الآية ١٤٠',
      progress: 62,
    },
    {
      id: 'u_s2',
      name: 'محمد العتيبي',
      role: 'student',
      email: 'mohammed@tibyan.sa',
      password: '123456',
      level: 'الجزء الثامن والعشرون',
      progress: 88,
    },
    {
      id: 'u_s3',
      name: 'سارة القحطاني',
      role: 'student',
      email: 'sara@tibyan.sa',
      password: '123456',
      level: 'سورة آل عمران - الآية ٥٠',
      progress: 34,
    },
    {
      id: 'u_s4',
      name: 'فاطمة الدوسري',
      role: 'student',
      email: 'fatima@tibyan.sa',
      password: '123456',
      level: 'الجزء الثلاثون - عمّ',
      progress: 95,
    },
  ],

  enrollments: [
    { id: 'e1', student_id: 'u_s1', teacher_id: 'u_t1' },
    { id: 'e2', student_id: 'u_s2', teacher_id: 'u_t1' },
    { id: 'e3', student_id: 'u_s3', teacher_id: 'u_t1' },
    { id: 'e4', student_id: 'u_s4', teacher_id: 'u_t2' },
  ],

  sessions: [
    {
      id: 'sess1',
      teacher_id: 'u_t1',
      date: todayISO(0),
      time: '16:00',
      topic: 'مراجعة سورة البقرة (١٢٠-١٤٠)',
      link: 'https://meet.google.com/abc-defg-hij',
      status: 'scheduled',
    },
    {
      id: 'sess2',
      teacher_id: 'u_t1',
      date: todayISO(0),
      time: '17:30',
      topic: 'تسميع الجزء الثامن والعشرين',
      link: '',
      status: 'scheduled',
    },
    {
      id: 'sess3',
      teacher_id: 'u_t1',
      date: todayISO(1),
      time: '16:00',
      topic: 'حفظ سورة آل عمران (٤٠-٦٠)',
      link: 'https://zoom.us/j/1234567890',
      status: 'scheduled',
    },
    {
      id: 'sess4',
      teacher_id: 'u_t1',
      date: todayISO(-2),
      time: '16:00',
      topic: 'مراجعة عامة',
      link: '',
      status: 'completed',
    },
  ],

  evaluations: [
    { id: 'ev1', session_id: 'sess4', student_id: 'u_s1', grade: 9, attendance: 'present', notes: 'حفظ ممتاز مع أخطاء بسيطة في التجويد' },
    { id: 'ev2', session_id: 'sess4', student_id: 'u_s2', grade: 10, attendance: 'present', notes: 'إتقان تام' },
    { id: 'ev3', session_id: 'sess4', student_id: 'u_s3', grade: 6, attendance: 'present', notes: 'يحتاج إلى مزيد من المراجعة' },
  ],

  assignments: [
    { id: 'a1', student_id: 'u_s1', teacher_id: 'u_t1', title: 'حفظ سورة البقرة الآيات ١-٢٠', status: 'pending', due_date: todayISO(2) },
    { id: 'a2', student_id: 'u_s1', teacher_id: 'u_t1', title: 'مراجعة سورة الفاتحة والإخلاص', status: 'ready', due_date: todayISO(1) },
    { id: 'a3', student_id: 'u_s2', teacher_id: 'u_t1', title: 'حفظ سورة الملك كاملة', status: 'pending', due_date: todayISO(3) },
    { id: 'a4', student_id: 'u_s3', teacher_id: 'u_t1', title: 'حفظ سورة آل عمران الآيات ٥٠-٦٠', status: 'pending', due_date: todayISO(4) },
  ],
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
