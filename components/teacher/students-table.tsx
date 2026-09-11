'use client'

import { useData } from '@/contexts/data-context'
import { StatusBadge } from '@/components/status-badge'
import type { User } from '@/lib/types'

export function StudentsTable({ students }: { students: User[] }) {
  const { getLatestEvaluation } = useData()

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-right text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-xs text-muted-foreground">
              <th className="px-4 py-3 font-medium">الطالب</th>
              <th className="px-4 py-3 font-medium">المستوى الحالي</th>
              <th className="px-4 py-3 font-medium">نسبة الحفظ</th>
              <th className="px-4 py-3 font-medium">آخر تقييم</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => {
              const evaluation = getLatestEvaluation(s.id)
              return (
                <tr key={s.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-full bg-secondary font-display text-sm font-bold text-primary">
                        {s.name.charAt(0)}
                      </span>
                      <div>
                        <p className="font-medium text-foreground">{s.name}</p>
                        <p className="text-xs text-muted-foreground" dir="ltr">
                          {s.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{s.level ?? '—'}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{ width: `${s.progress ?? 0}%` }}
                        />
                      </div>
                      <span className="text-xs font-medium text-foreground">{s.progress ?? 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {evaluation ? (
                      <StatusBadge tone={evaluation.grade >= 8 ? 'green' : 'gold'}>
                        {evaluation.grade} / 10
                      </StatusBadge>
                    ) : (
                      <span className="text-xs text-muted-foreground">لا يوجد</span>
                    )}
                  </td>
                </tr>
              )
            })}
            {students.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-sm text-muted-foreground">
                  لا يوجد طلاب مسجّلون في حلقتك بعد.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
