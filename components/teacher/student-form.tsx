'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@/components/modal'

export interface StudentDraft {
  name: string
  email: string
  level: string
}

export function StudentForm({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (draft: StudentDraft) => void
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [level, setLevel] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setName('')
      setEmail('')
      setLevel('')
      setError('')
    }
  }, [open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !level.trim()) {
      setError('يرجى تعبئة جميع الحقول')
      return
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
    if (!emailOk) {
      setError('صيغة البريد الإلكتروني غير صحيحة')
      return
    }
    onSubmit({ name: name.trim(), email: email.trim(), level: level.trim() })
  }

  const fieldClass =
    'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20'

  return (
    <Modal open={open} onClose={onClose} title="تسجيل طالب جديد">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="student-name" className="text-xs text-muted-foreground">
            الاسم الكامل
          </label>
          <input
            id="student-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="مثال: خالد الشمري"
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="student-email" className="text-xs text-muted-foreground">
            البريد الإلكتروني
          </label>
          <input
            id="student-email"
            type="email"
            dir="ltr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@qudamah.sa"
            className={`${fieldClass} text-left`}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="student-level" className="text-xs text-muted-foreground">
            السورة / المستوى الحالي
          </label>
          <input
            id="student-level"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            placeholder="مثال: سورة البقرة - الآية ٤٠"
            className={fieldClass}
          />
        </div>

        {error ? (
          <p className="rounded-lg bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive">{error}</p>
        ) : null}

        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted"
          >
            إلغاء
          </button>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            تسجيل الطالب
          </button>
        </div>
      </form>
    </Modal>
  )
}
