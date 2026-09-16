'use client'

import { useMemo, useState } from 'react'
import { Users, CalendarDays, GraduationCap, Plus, Pencil, Trash2, ClipboardCheck, Video, Clock, UserPlus } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { Navigation } from '@/components/navigation'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { StudentsTable } from '@/components/teacher/students-table'
import { SessionForm, type SessionDraft } from '@/components/teacher/session-form'
import { GradesModal } from '@/components/teacher/grades-modal'
import { StudentForm, type StudentDraft } from '@/components/teacher/student-form'
import { useAuth } from '@/contexts/auth-context'
import { useData } from '@/contexts/data-context'
import type { Session } from '@/lib/types'
import { formatArabicDate, formatTime, sessionStatusLabels, todayISO } from '@/lib/format'

function TeacherDashboard() {
  const { user } = useAuth()
  const { getStudentsForTeacher, getSessionsForTeacher, addStudent, addSession, updateSession, deleteSession } =
    useData()

  const teacherId = user!.id
  const students = getStudentsForTeacher(teacherId)
  const sessions = getSessionsForTeacher(teacherId)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Session | null>(null)
  const [gradingSession, setGradingSession] = useState<Session | null>(null)
  const [studentFormOpen, setStudentFormOpen] = useState(false)

  const today = todayISO()
  const todaysSessions = useMemo(
    () => sessions.filter((s) => s.date === today && s.status === 'scheduled'),
    [sessions, today],
  )
  const upcomingCount = sessions.filter((s) => s.status === 'scheduled' && s.date >= today).length

  const openCreate = () => {
    setEditing(null)
    setFormOpen(true)
  }
  const openEdit = (s: Session) => {
    setEditing(s)
    setFormOpen(true)
  }
  
  // التعديل السحري هون: ضفنا async/await وعدلنا teacher_id لـ teacherId
  const handleSubmit = async (draft: SessionDraft) => {
    if (editing) {
      await updateSession(editing.id, draft)
    } else {
      // شلنا الشحطة عشان تطابق الكود اللي بملف الداتا
      await addSession({ ...draft, teacherId }) 
    }
    setFormOpen(false)
    setEditing(null)
  }

  const handleAddStudent = async (draft: StudentDraft) => {
    await addStudent({ ...draft, teacherId })
    setStudentFormOpen(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation subtitle="لوحة المحفّظ" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            أهلاً، {user!.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            متابعة حلقتك، الطلاب، والجلسات القادمة
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard label="إجمالي الطلاب" value={students.length} hint="طلاب حلقتك النشطون" icon={Users} />
          <StatCard label="جلسات اليوم" value={todaysSessions.length} hint="جلسات مجدولة لليوم" icon={CalendarDays} />
          <StatCard label="الجلسات القادمة" value={upcomingCount} hint="جلسات لم تُعقد بعد" icon={GraduationCap} />
        </div>

        {/* Students */}
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-foreground">طلاب الحلقة</h2>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">{students.length} طالب</span>
              <button
                type="button"
                onClick={() => setStudentFormOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <UserPlus className="size-4" />
                طالب جديد
              </button>
            </div>
          </div>
          <StudentsTable students={students} />
        </section>

        {/* Schedule */}
        <section className="mt-10">
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-foreground">الجدول والجلسات</h2>
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus className="size-4" />
              جلسة جديدة
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-lg bg-secondary text-primary">
                    <CalendarDays className="size-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-foreground">{s.topic}</p>
                      <StatusBadge
                        tone={s.status === 'completed' ? 'green' : s.status === 'cancelled' ? 'red' : 'gold'}
                      >
                        {sessionStatusLabels[s.status]}
                      </StatusBadge>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{formatArabicDate(s.date)}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {formatTime(s.time)}
                      </span>
                      {s.link ? (
                        <a
                          href={s.link}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <Video className="size-3.5" />
                          رابط الجلسة
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => setGradingSession(s)}
                    className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-primary transition-colors hover:bg-secondary"
                  >
                    <ClipboardCheck className="size-4" />
                    التقييم
                  </button>
                  <button
                    type="button"
                    onClick={() => openEdit(s)}
                    aria-label="تعديل"
                    className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <Pencil className="size-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteSession(s.id)}
                    aria-label="حذف"
                    className="flex size-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-red-50 hover:text-destructive"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            ))}

            {sessions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card px-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">لا توجد جلسات بعد. ابدأ بإضافة جلسة جديدة.</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <SessionForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false)
          setEditing(null)
        }}
        onSubmit={handleSubmit}
        initial={editing}
      />
      <GradesModal
        open={gradingSession !== null}
        onClose={() => setGradingSession(null)}
        session={gradingSession}
        students={students}
      />
      <StudentForm
        open={studentFormOpen}
        onClose={() => setStudentFormOpen(false)}
        onSubmit={handleAddStudent}
      />
    </div>
  )
}

export default function TeacherPage() {
  return (
    <ProtectedRoute role="teacher">
      <TeacherDashboard />
    </ProtectedRoute>
  )
}