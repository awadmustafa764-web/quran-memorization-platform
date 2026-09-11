'use client'

import { useState } from 'react'
import { Users, GraduationCap, CalendarDays, BookOpen, Trash2, UserPlus } from 'lucide-react'
import { ProtectedRoute } from '@/components/protected-route'
import { Navigation } from '@/components/navigation'
import { StatCard } from '@/components/stat-card'
import { StatusBadge } from '@/components/status-badge'
import { useAuth } from '@/contexts/auth-context'
import { useData } from '@/contexts/data-context'
import { roleLabels } from '@/lib/format'

function AdminDashboard() {
  const { user } = useAuth()
  const { store, deleteUser, addTeacher } = useData()

  const [teacherFormOpen, setTeacherFormOpen] = useState(false)
  const [teacherName, setTeacherName] = useState('')
  const [teacherEmail, setTeacherEmail] = useState('')
  const [teacherPassword, setTeacherPassword] = useState('')

  const teachers = store.users.filter((u) => u.role === 'teacher')
  const students = store.users.filter((u) => u.role === 'student')

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault()
    if (!teacherName.trim() || !teacherEmail.trim() || !teacherPassword.trim()) return
    addTeacher({
      name: teacherName.trim(),
      email: teacherEmail.trim(),
      password: teacherPassword.trim(),
    })
    setTeacherName('')
    setTeacherEmail('')
    setTeacherPassword('')
    setTeacherFormOpen(false)
  }

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
          <div className="mb-3 flex items-center justify-between gap-4">
            <h2 className="font-display text-lg font-bold text-foreground">المحفّظون وطلابهم</h2>
            <button
              type="button"
              onClick={() => setTeacherFormOpen(true)}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <UserPlus className="size-4" />
              محفّظ جديد
            </button>
          </div>

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

      {/* نافذة إضافة محفّظ جديد */}
      {teacherFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-lg border border-border">
            <h3 className="font-display text-lg font-bold text-foreground mb-4">إضافة محفّظ جديد</h3>
            <form onSubmit={handleAddTeacher} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">اسم المحفّظ</label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="مثال: الشيخ محمود"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="mahmoud@tibyan.sa"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  dir="ltr"
                  required
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-foreground">كلمة المرور</label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="••••••"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus:border-primary"
                  dir="ltr"
                  required
                />
              </div>
              <div className="mt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setTeacherFormOpen(false)}
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-muted"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  إضافة المحفّظ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
