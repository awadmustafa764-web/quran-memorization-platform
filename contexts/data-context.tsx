'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { 
  Store, 
  Session, 
  Assignment, 
  Evaluation, 
  User, 
  AssignmentStatus 
} from '@/lib/types'
import { seedStore } from '@/lib/store'
import { supabase } from '@/lib/supabase'

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
  addStudent: (input: { name: string; email: string; level: string; teacherId: string }) => Promise<void>
  addTeacher: (input: { name: string; email: string; level: string; password: string }) => Promise<void>
  updateUser: (userId: string, patch: Partial<User>) => Promise<void>
  addSession: (s: Omit<Session, 'id'>) => Promise<void>
  updateSession: (id: string, patch: Partial<Session>) => Promise<void>
  deleteSession: (id: string) => Promise<void>
  deleteUser: (userId: string) => Promise<void>
  upsertEvaluation: (e: Omit<Evaluation, 'id'> & { id?: string }) => void
  setAssignmentStatus: (id: string, status: AssignmentStatus) => void
  resetData: () => void
}

const DataContext = createContext<DataContextValue | null>(null)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(seedStore)
  const [ready, setReady] = useState<boolean>(false)

  const fetchData = async () => {
    try {
      const { data: usersData } = await supabase.from('users').select('*')
      const { data: studentsData } = await supabase.from('students').select('*')
      const { data: sessionsData } = await supabase.from('sessions').select('*')

      const formattedUsers: User[] = usersData ? usersData.map((u: any) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        password: u.password,
        createdAt: u.created_at,
      })) : []

      const formattedStudents = studentsData ? studentsData.map((s: any) => ({
        id: s.id,
        name: s.name,
        email: s.email,
        level: s.level,
        teacherId: s.teacher_id,
        totalSessions: s.total_sessions || 0,
        attendanceRate: s.attendance_rate || 100,
        avgGrade: s.avg_grade || 100,
        lastSessionDate: s.last_session_date || '-',
        createdAt: s.created_at,
      })) : []

      const formattedSessions = sessionsData ? sessionsData.map((ses: any) => ({
        id: ses.id,
        teacherId: ses.teacher_id,
        studentIds: ses.student_ids || [],
        date: ses.date,
        time: ses.time,
        topic: ses.topic,
        status: ses.status,
        link: ses.link || '',
        grades: ses.grades || {},
      })) : []

      setStore({
        users: formattedUsers,
        students: formattedStudents,
        sessions: formattedSessions,
        assignments: [],
        evaluations: [],
      })
    } catch (error) {
      console.error('Error fetching from Supabase:', error)
    } finally {
      setReady(true)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getUser = useCallback((id: string) => {
    return store.users.find(u => u.id === id) || store.students.find(s => s.id === id) as any
  }, [store])

  const getStudentsForTeacher = useCallback((teacherId: string) => {
    return store.students.filter(s => s.teacherId === teacherId)
  }, [store])

  const getSessionsForTeacher = useCallback((teacherId: string) => {
    return store.sessions.filter(ses => ses.teacherId === teacherId)
  }, [store])

  const getSessionsForStudent = useCallback((studentId: string) => {
    return store.sessions.filter(ses => ses.studentIds.includes(studentId))
  }, [store])

  const getAssignmentsForStudent = useCallback((_studentId: string) => {
    return [] as Assignment[]
  }, [])

  const getLatestEvaluation = useCallback((_studentId: string) => {
    return undefined as Evaluation | undefined
  }, [])

  const addStudent = async (input: { name: string; email: string; level: string; teacherId: string }) => {
    const newStudentObj = {
      name: input.name,
      email: input.email,
      level: input.level,
      teacher_id: input.teacherId,
      total_sessions: 0,
      attendance_rate: 100,
      avg_grade: 100,
      last_session_date: '-'
    }

    const { error } = await supabase.from('students').insert([newStudentObj])
    if (!error) {
      await fetchData()
    }
  }

  const addTeacher = async (input: { name: string; email: string; level: string; password: string }) => {
    const newTeacherObj = {
      name: input.name,
      email: input.email,
      password: input.password,
      role: 'teacher'
    }

    // شلنا المتغير data اللي كان عامل تعليقة صامتة لأنو مش مستخدم
    const { error } = await supabase.from('users').insert([newTeacherObj])
    if (!error) {
      await fetchData()
    } else {
      console.error('Error adding teacher to Supabase:', error.message)
    }
  }

  const updateUser = async (userId: string, patch: Partial<User>) => {
    const updateObj: any = {}
    if (patch.name) updateObj.name = patch.name
    if (patch.email) updateObj.email = patch.email
    if (patch.password) updateObj.password = patch.password

    await supabase.from('users').update(updateObj).eq('id', userId)
    await fetchData()
  }

  const addSession = async (s: Omit<Session, 'id'>) => {
    const newSessionObj = {
      teacher_id: s.teacherId,
      student_ids: s.studentIds,
      date: s.date,
      time: s.time,
      topic: s.topic,
      status: s.status,
      link: s.link,
      grades: s.grades
    }

    const { error } = await supabase.from('sessions').insert([newSessionObj])
    if (!error) {
      await fetchData()
    }
  }

  const updateSession = async (id: string, patch: Partial<Session>) => {
    const updateObj: any = {}
    if (patch.status) updateObj.status = patch.status
    if (patch.topic) updateObj.topic = patch.topic
    if (patch.date) updateObj.date = patch.date
    if (patch.time) updateObj.time = patch.time
    if (patch.link !== undefined) updateObj.link = patch.link
    if (patch.grades) updateObj.grades = patch.grades

    await supabase.from('sessions').update(updateObj).eq('id', id)
    await fetchData()
  }

  const deleteSession = async (id: string) => {
    await supabase.from('sessions').delete().eq('id', id)
    await fetchData()
  }

  const deleteUser = async (userId: string) => {
    await supabase.from('users').delete().eq('id', userId)
    await supabase.from('students').delete().eq('id', userId)
    await fetchData()
  }

  const upsertEvaluation = (_e: Omit<Evaluation, 'id'> & { id?: string }) => {}
  const setAssignmentStatus = (_id: string, _status: AssignmentStatus) => {}
  
  const resetData = async () => {
    await fetchData()
  }

  return (
    <DataContext.Provider value={{
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
      updateUser,
      addSession,
      updateSession,
      deleteSession,
      deleteUser,
      upsertEvaluation,
      setAssignmentStatus,
      resetData
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}