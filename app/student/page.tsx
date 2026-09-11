'use client'

import { useMemo } from 'react'
import { CalendarDays, Clock, Video, BookMarked, CheckCircle2, Circle } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { Navigation } from '@/components/navigation'
import { ProgressRing } from '@/components/progress-ring'
import { StatusBadge } from '@/components/status-badge'
import { useAuth } from '@/contexts/auth-context'
import { useData } from '@/contexts/data-context'
import { formatArabicDate, formatTime, assignmentStatusLabels, todayISO } from '@/lib/format'

function StudentDashboard() {
  const { user } = useAuth()
  const { getSessionsForStudent, getAssignmentsForStudent, getUser, store, setAssignmentStatus } = useData()

  const studentId = user!.id
  const today = todayISO()

  const sessions = useMemo(
    () => getSessionsForStudent(studentId).filter((s) => s.date >= today && s.status === 'scheduled'),
    [getSessionsForStudent, studentId, today],
  )
  const assignments = getAssignmentsForStudent(studentId)

  const teacherId = store.enrollments.find((e) => e.student_id === studentId)?.teacher_id
  const teacher = teacherId ? getUser(teacherId) : undefined

  const toggleReady = (id: string, current: string) => {
    setAssignmentStatus(id, current === 'ready' ? 'pending' : 'ready')
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation subtitle="لوحة الطالب" />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">
            حيّاك الله، {user!.name}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {teacher ? `محفّظك: ${teacher.name}` : 'لم يتم إسنادك لمحفّظ بعد'}
          </p>
        </div>

        {/* Overview: progress ring */}
        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-card p-6 shadow-sm">
            <ProgressRing value={user!.progress ?? 0} />
          </div>
          <div className="flex flex-col justify-center gap-4 rounded-lg border border-border bg-card p-6 shadow-sm md:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary">
                <BookMarked className="size-5" />
              </span>
              <div>
                <p className="text-sm text-muted-foreground">مستواك الحالي</p>
                <p className="font-display text-lg font-bold text-foreground">{user!.level ?? '—'}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <p className="text-sm text-muted-foreground">الجلسات القادمة</p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">{sessions.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">واجبات قيد الحفظ</p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">
                  {assignments.filter((a) => a.status !== 'reviewed').length}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming classes */}
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">الجلسات القادمة</h2>
          <div className="flex flex-col gap-3">
            {sessions.map((s) => (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-secondary text-primary">
                    <CalendarDays className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{s.topic}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>{formatArabicDate(s.date)}</span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {formatTime(s.time)}
                      </span>
                    </div>
                  </div>
                </div>
                {s.link ? (
                  <a
                    href={s.link}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                  >
                    <Video className="size-4" />
                    دخول الجلسة
                  </a>
                ) : (
                  <StatusBadge tone="neutral">حضوري في الدار</StatusBadge>
                )}
              </div>
            ))}
            {sessions.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card px-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">لا توجد جلسات قادمة حالياً.</p>
              </div>
            ) : null}
          </div>
        </section>

        {/* Assignments */}
        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">الواجبات</h2>
          <div className="flex flex-col gap-3">
            {assignments.map((a) => {
              const isReady = a.status === 'ready'
              const isReviewed = a.status === 'reviewed'
              return (
                <div
                  key={a.id}
                  className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 shadow-sm"
                >
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => !isReviewed && toggleReady(a.id, a.status)}
                      disabled={isReviewed}
                      aria-label="تحديد كجاهز للتسميع"
                      className="mt-0.5 text-primary transition-colors disabled:opacity-60"
                    >
                      {isReady || isReviewed ? (
                        <CheckCircle2 className="size-5" />
                      ) : (
                        <Circle className="size-5 text-muted-foreground" />
                      )}
                    </button>
                    <div>
                      <p
                        className={`font-medium ${isReviewed ? 'text-muted-foreground line-through' : 'text-foreground'}`}
                      >
                        {a.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        موعد التسميع: {formatArabicDate(a.due_date)}
                      </p>
                    </div>
                  </div>
                  <StatusBadge tone={isReviewed ? 'green' : isReady ? 'gold' : 'neutral'}>
                    {assignmentStatusLabels[a.status]}
                  </StatusBadge>
                </div>
              )
            })}
            {assignments.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border bg-card px-4 py-12 text-center">
                <p className="text-sm text-muted-foreground">لا توجد واجبات حالياً.</p>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  )
}

export default function StudentPage() {
  return (
    <ProtectedRoute role="student">
      <StudentDashboard />
    </ProtectedRoute>
  )
}
