'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type {
  Store,
  Session,
  Assignment,
  Evaluation,
  User,
  AssignmentStatus,
} from '@/lib/types'
import { loadStore, saveStore, seedStore, newId } from '@/lib/store'

interface DataContextValue {
  store: Store
  ready: boolean
  // queries
  getUser: (id: string) => User | undefined
  getStudentsForTeacher: (teacherId: string) => User[]
  getSessionsForTeacher: (teacherId: string) => Session[]
  getSessionsForStudent: (studentId: string) => Session[]
  getAssignmentsForStudent: (studentId: string) => Assignment[]
  getLatestEvaluation: (studentId: string) => Evaluation | undefined
  // mutations
  addStudent: (input: { name: string; email: string; level: string; teacherId: string }) => void
  addTeacher: (input: { name: string; email: string; password: string }) => void
  addSession: (s: Omit<Session, 'id'>) => void
  updateSession: (id: string, patch: Partial<Session>) => void
  deleteSession: (id: string) => void
  deleteUser: (userId: string) => void
  upsertEvaluation: (e: Omit<Evaluation, 'id'> & { id?: string }) => void
  setAssignmentStatus: (id: string, status: AssignmentStatus) => void
  resetData: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(seedStore)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setStore(loadStore())
    setReady(true)
  }, [])

  const persist = useCallback((next: Store) => {
    setStore(next)
    saveStore(next)
  }, [])

  const getUser = useCallback((id: string) => store.users.find((u) => u.id === id), [store])

  const getStudentsForTeacher = useCallback(
    (teacherId: string) => {
      const ids = store.enrollments.filter((e) => e.teacher_id === teacherId).map((e) => e.student_id)
      return store.users.filter((u) => ids.includes(u.id))
    },
    [store],
  )

  const getSessionsForTeacher = useCallback(
    (teacherId: string) =>
      store.sessions
        .filter((s) => s.teacher_id === teacherId)
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time)),
    [store],
  )

  const getSessionsForStudent = useCallback(
    (studentId: string) => {
      const teacherIds = store.enrollments
        .filter((e) => e.student_id === studentId)
        .map((e) => e.teacher_id)
      return store.sessions
        .filter((s) => teacherIds.includes(s.teacher_id))
        .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    },
    [store],
  )

  const getAssignmentsForStudent = useCallback(
    (studentId: string) => store.assignments.filter((a) => a.student_id === studentId),
    [store],
  )

  const getLatestEvaluation = useCallback(
    (studentId: string) => {
      const list = store.evaluations.filter((e) => e.student_id === studentId)
      return list[list.length - 1]
    },
    [store],
  )

  const addStudent = useCallback(
    (input: { name: string; email: string; level: string; teacherId: string }) => {
      const studentId = newId('u_s')
      const student: User = {
        id: studentId,
        name: input.name.trim(),
        role: 'student',
        email: input.email.trim(),
        password: '123456',
        level: input.level.trim(),
        progress: 0,
      }
      persist({
        ...store,
        users: [...store.users, student],
        enrollments: [
          ...store.enrollments,
          { id: newId('e'), student_id: studentId, teacher_id: input.teacherId },
        ],
      })
    },
    [store, persist],
  )

  const addTeacher = useCallback(
    (input: { name: string; email: string; password: string }) => {
      const teacherId = newId('u_t')
      const teacher: User = {
        id: teacherId,
        name: input.name.trim(),
        role: 'teacher',
        email: input.email.trim(),
        password: input.password.trim(),
      }
      persist({
        ...store,
        users: [...store.users, teacher],
      })
    },
    [store, persist],
  )

  const addSession = useCallback(
    (s: Omit<Session, 'id'>) => persist({ ...store, sessions: [...store.sessions, { ...s, id: newId('sess') }] }),
    [store, persist],
  )

  const updateSession = useCallback(
    (id: string, patch: Partial<Session>) =>
      persist({ ...store, sessions: store.sessions.map((s) => (s.id === id ? { ...s, ...patch } : s)) }),
    [store, persist],
  )

  const deleteSession = useCallback(
    (id: string) => persist({ ...store, sessions: store.sessions.filter((s) => s.id !== id) }),
    [store, persist],
  )

  const deleteUser = useCallback(
    (userId: string) => {
      const updatedUsers = store.users.filter((u) => u.id !== userId)
      const updatedEnrollments = store.enrollments.filter((e) => e.student_id !== userId && e.teacher_id !== userId)
      const updatedAssignments = store.assignments.filter((a) => a.student_id !== userId && a.teacher_id !== userId)
      const updatedEvaluations = store.evaluations.filter((ev) => ev.student_id !== userId)
      
      persist({
        ...store,
        users: updatedUsers,
        enrollments: updatedEnrollments,
        assignments: updatedAssignments,
        evaluations: updatedEvaluations,
      })
    },
    [store, persist],
  )

  const upsertEvaluation = useCallback(
    (e: Omit<Evaluation, 'id'> & { id?: string }) => {
      const existing = store.evaluations.find(
        (x) => x.session_id === e.session_id && x.student_id === e.student_id,
      )
      if (existing) {
        persist({
          ...store,
          evaluations: store.evaluations.map((x) => (x.id === existing.id ? { ...existing, ...e } : x)),
        })
      } else {
        persist({ ...store, evaluations: [...store.evaluations, { ...e, id: newId('ev') }] })
      }
    },
    [store, persist],
  )

  const setAssignmentStatus = useCallback(
    (id: string, status: AssignmentStatus) =>
      persist({ ...store, assignments: store.assignments.map((a) => (a.id === id ? { ...a, status } : a)) }),
    [store, persist],
  )

  const resetData = useCallback(() => persist(seedStore), [persist])

  return (
    <DataContext.Provider
      value={{
        store,
        ready,
        getUser,
        getStudentsForTeacher,
        getSessionsForTeacher,
        getSessionsForStudent,
        getAssignmentsForStudent,
        getLatestEvaluation,
        addStudent,
        addTeacher,
        addSession,
        updateSession,
        deleteSession,
        deleteUser,
        upsertEvaluation,
        setAssignmentStatus,
        resetData,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
