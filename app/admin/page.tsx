'use client'

import { Users, GraduationCap, CalendarDays, BookOpen, Trash2 } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { Navigation } from '@/components/navigation'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { useAuth } from '@/contexts/auth-context'
import { useData } from '@/contexts/data-context'
import { roleLabels } from '@/lib/format'

function AdminDashboard() {
  const { user } = useAuth()
  const { store, deleteUser } = useData()

  const teachers = store.users.filter((u) => u.role === 'teacher')
  const students = store.users.filter((u) => u.role === 'student')

  return (
    <div className="min-h-screen bg-background">
      <Navigation subtitle="لوحة الإدارة" />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground">أهلاً، {user!.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">نظرة عامة على الدار والمحفّظين والطلاب</p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="المحفّظون" value={teachers.length} icon={GraduationCap} />
          <StatCard label="الطلاب" value={students.length} icon={Users} />
          <StatCard label="إجمالي الجلسات" value={store.sessions.length} icon={CalendarDays} />
          <StatCard label="الحلقات" value={store.enrollments.length} hint="ارتباط طالب بمحفّظ" icon={BookOpen} />
        </div>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">المحفّظون وطلابهم</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {teachers.map((t) => {
              const enrolled = store.enrollments
                .filter((e) => e.teacher_id === t.id)
                .map((e) => store.users.find((u) => u.id === e.student_id))
                .filter(Boolean)
              return (
                <div key={t.id} className="rounded-lg border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-full bg-secondary font-display font-bold text-primary">
                        {t.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">
                          {t.email}
                        </p>
                      </div>
                    </div>
                    <StatusBadge tone="green">{enrolled.length} طلاب</StatusBadge>
                  </div>
                  <ul className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
                    {enrolled.map((s) => (
                      <li key={s!.id} className="flex items-center justify-between text-sm">
                        <span className="text-foreground">{s!.name}</span>
                        <span className="text-xs text-muted-foreground">{s!.level}</span>
                      </li>
                    ))}
                    {enrolled.length === 0 ? (
                      <li className="text-xs text-muted-foreground">لا يوجد طلاب مسجّلون</li>
                    ) : null}
                  </ul>
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-10">
          <h2 className="mb-3 font-display text-lg font-bold text-foreground">جميع المستخدمين</h2>
          <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
                  <th className="px-4 py-3 font-medium">الاسم</th>
                  <th className="px-4 py-3 font-medium">البريد</th>
                  <th className="px-4 py-3 font-medium">الدور</th>
                  <th className="px-4 py-3 font-medium text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                {store.users.map((u) => (
                  <tr key={u.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-muted-foreground" dir="ltr">
                      {u.email}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge tone={u.role === 'teacher' ? 'green' : u.role === 'student' ? 'gold' : 'sky'}>
                        {roleLabels[u.role]}
                      </StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-left">
                      {u.role !== 'admin' && (
                        <button
                          onClick={() => {
                            if (confirm(`هل أنت متأكد من رغبتك في إزالة المستخدم "${u.name}" نهائياً؟`)) {
                              deleteUser(u.id)
                            }
                          }}
                          className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-100"
                        >
                          <Trash2 className="size-3.5" />
                          إزالة
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  )
}

export default function AdminPage() {
  return (
    <ProtectedRoute role="admin">
      <AdminDashboard />
    </ProtectedRoute>
  )
}
