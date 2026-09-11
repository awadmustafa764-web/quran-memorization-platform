'use client'

import { useState } from 'react'
import { Modal } from '@/components/modal'
import type { Session, SessionStatus } from '@/lib/types'
import { todayISO } from '@/lib/format'

export type SessionDraft = Omit<Session, 'id' | 'teacher_id'>

const fieldClass =
  'w-full rounded-lg border border-input bg-background px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20'

const labelClass = 'text-sm font-medium text-foreground'

export function SessionForm({
  open,
  onClose,
  onSubmit,
  initial,
}: {
  open: boolean
  onClose: () => void
  onSubmit: (draft: SessionDraft) => void
  initial?: Session | null
}) {
  const [topic, setTopic] = useState(initial?.topic ?? '')
  const [date, setDate] = useState(initial?.date ?? todayISO())
  const [time, setTime] = useState(initial?.time ?? '16:00')
  const [location, setLocation] = useState(initial?.location ?? '')
  const [status, setStatus] = useState<SessionStatus>(initial?.status ?? 'scheduled')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!topic.trim()) return
    onSubmit({ topic: topic.trim(), date, time, location: location.trim(), status })
  }

  return (
    <Modal open={open} onClose={onClose} title={initial ? 'تعديل الجلسة' : 'إضافة جلسة جديدة'}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="topic" className={labelClass}>
            الهدف / السورة
          </label>
          <input
            id="topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="مثال: حفظ سورة البقرة (١-٢٠)"
            className={fieldClass}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="date" className={labelClass}>
              التاريخ
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={fieldClass}
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label htmlFor="time" className={labelClass}>
              الوقت
            </label>
            <input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={fieldClass}
              required
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="location" className={labelClass}>
            مكان اللقاء الوجاهي (المسجد / القاعة)
          </label>
          <input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="مثال: مسجد النور - قاعة التحفيظ الرئيسية"
            className={fieldClass}
            required
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className={labelClass}>
            الحالة
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as SessionStatus)}
            className={fieldClass}
          >
            <option value="scheduled">قادمة</option>
            <option value="completed">مكتملة</option>
            <option value="cancelled">ملغاة</option>
          </select>
        </div>

        <div className="mt-2 flex items-center justify-end gap-3">
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
            {initial ? 'حفظ التعديلات' : 'إضافة الجلسة'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
