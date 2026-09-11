// Data model designed to mirror a relational database (Supabase / PostgreSQL ready).

export type Role = 'admin' | 'teacher' | 'student'

export interface User {
  id: string
  name: string
  role: Role
  email: string
  password: string
  /** Student-only: current memorization level, e.g. "سورة البقرة" or "الجزء الثالث" */
  level?: string
  /** Student-only: memorization progress percentage 0-100 */
  progress?: number
}

export type SessionStatus = 'scheduled' | 'completed' | 'cancelled'

export interface Session {
  id: string
  teacher_id: string
  date: string // ISO date: YYYY-MM-DD
  time: string // HH:MM
  topic: string // Surah target
  link: string // Zoom/Meet link (optional online)
  status: SessionStatus
}

export interface Enrollment {
  id: string
  student_id: string
  teacher_id: string
}

export type AttendanceStatus = 'present' | 'absent' | 'pending'

export interface Evaluation {
  id: string
  session_id: string
  student_id: string
  grade: number // out of 10
  attendance: AttendanceStatus
  notes: string
}

export type AssignmentStatus = 'pending' | 'ready' | 'reviewed'

export interface Assignment {
  id: string
  student_id: string
  teacher_id: string
  title: string
  status: AssignmentStatus
  due_date: string
}

export interface Store {
  users: User[]
  sessions: Session[]
  enrollments: Enrollment[]
  evaluations: Evaluation[]
  assignments: Assignment[]
}
