import type { Role, SessionStatus, AssignmentStatus, AttendanceStatus } from './types'

export const roleLabels: Record<Role, string> = {
  admin: 'مدير',
  teacher: 'محفّظ',
  student: 'طالب',
}

export const sessionStatusLabels: Record<SessionStatus, string> = {
  scheduled: 'قادمة',
  completed: 'مكتملة',
  cancelled: 'ملغاة',
}

export const assignmentStatusLabels: Record<AssignmentStatus, string> = {
  pending: 'قيد الحفظ',
  ready: 'جاهز للتسميع',
  reviewed: 'تم التسميع',
}

export const attendanceLabels: Record<AttendanceStatus, string> = {
  present: 'حاضر',
  absent: 'غائب',
  pending: 'لم يُسجّل',
}

const arabicDays = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

export function formatArabicDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00')
  if (Number.isNaN(d.getTime())) return iso
  const day = arabicDays[d.getDay()]
  const formatted = new Intl.DateTimeFormat('ar-SA-u-nu-arab', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
  return `${day}، ${formatted}`
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number)
  const period = h < 12 ? 'صباحاً' : 'مساءً'
  const hour12 = h % 12 === 0 ? 12 : h % 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function dashboardPath(role: Role): string {
  if (role === 'student') return '/student'
  if (role === 'admin') return '/admin'
  return '/teacher'
}
