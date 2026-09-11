'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/modal'
import { useData } from '@/contexts/data-context'
import type { Session, User, AttendanceStatus } from '@/lib/types'

export function GradesModal({
  open,
  onClose,
  session,
  students,
}: {
  open: boolean
  onClose: () => void
  session: Session | null
  students: User[]
}) {
  const { store, upsertEvaluation } = useData()

  const [studentId, setStudentId] = useState('')
  const [grade, setGrade] = useState('')
  const [attendance, setAttendance] = useState<AttendanceStatus>('present')
  const [notes, setNotes] = useState('')
  const [error, setError] = useState('')

  // Reset selection each time the modal opens for a session.
  useEffect(() => {
    if (open) {
      setStudentId('')
      setGrade('')
      setAttendance('present')
      setNotes('')
      setError('')
    }
  }, [open, session?.id])

  // When a student is chosen, prefill from any existing evaluation for this session.
  useEffect(() => {
    if (!session || !studentId) return
    const existing = store.evaluations.find(
      (e) => e.session_id === session.id && e.student_id === studentId,
    )
    setGrade(existing ? String(existing.grade) : '')
    setAttendance(existing?.attendance ?? 'present')
    setNotes(existing?.notes ?? '')
  }, [studentId, session, store.evaluations])

  if (!session) return null

  const handleSave = () => {
    if (!studentId) {
      setError('يرجى اختيار الطالب المراد تقييمه')
      return
    }
    const numericGrade = Number(grade)
    if (grade === '' || Number.isNaN(numericGrade) || numericGrade < 0 || numericGrade > 10) {
      setError('أدخل درجة صحيحة بين ٠ و ١٠')
      return
    }
    upsertEvaluation({
      session_id: session.id,
      student_id: studentId,
      grade: numericGrade,
      attendance,
      notes: notes.trim(),
    })
    onClose()
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <Modal open={open} onClose={onClose} title={`رصد التقييم — ${session.topic}`}>
      <div className="flex flex-col gap-4">
        {students.length === 0 ? (
          <p className="rounded-lg bg-muted px-4 py-6 text-center text-sm text-muted-foreground">
            لا يوجد طلاب مسجّلون في حلقتك بعد.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="grade-student" className="text-xs text-muted-foreground">
                اختر الطالب
              </label>
              <select
                id="grade-student"
                value={studentId}
                onChange={(e) => {
                  setStudentId(e.target.value)
                  setError('')
                }}
                className={fieldClass}
              >
                <option value="" disabled>
                  — اختر الطالب المراد تقييمه —
                </option>
                {students.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {studentId ? (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="grade-value" className="text-xs text-muted-foreground">
                      الدرجة (من ١٠)
                    </label>
                    <input
                      id="grade-value"
                      type="number"
                      min={0}
                      max={10}
                      value={grade}
                      onChange={(e) => setGrade(e.target.value)}
                      className={fieldClass}
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="grade-attendance" className="text-xs text-muted-foreground">
                      الحضور
                    </label>
                    <select
                      id="grade-attendance"
                      value={attendance}
                      onChange={(e) => setAttendance(e.target.value as AttendanceStatus)}
                      className={fieldClass}
                    >
                      <option value="present">حاضر</option>
                      <option value="absent">غائب</option>
                      <option value="pending">لم يُسجّل</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="grade-notes" className="text-xs text-muted-foreground">
                    ملاحظات
                  </label>
                  <input
                    id="grade-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ملاحظات التجويد والحفظ..."
                    className={fieldClass}
                  />
                </div>
              </>
            ) : null}

            {error ? (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">{error}</p>
            ) : null}
          </>
        )}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={students.length === 0}
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            حفظ التقييم
          </button>
        </div>
      </div>
    </Modal>
  )
}
