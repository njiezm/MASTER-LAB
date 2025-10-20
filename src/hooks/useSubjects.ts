'use client'

import { useState, useEffect } from 'react'

interface Subject {
  id: string
  name: string
  description?: string
  teacher?: string
  schedule?: string
  room?: string
  color: string
  credits: number
  semester: string
  year: number
  createdAt: string
  updatedAt: string
}

export function useSubjects() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/subjects')
      
      if (!response.ok) {
        throw new Error('Failed to fetch subjects')
      }
      
      const data = await response.json()
      setSubjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const createSubject = async (subjectData: Omit<Subject, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subjectData),
      })

      if (!response.ok) {
        throw new Error('Failed to create subject')
      }

      const newSubject = await response.json()
      setSubjects(prev => [...prev, newSubject])
      return newSubject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }

  const updateSubject = async (id: string, updates: Partial<Subject>) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      if (!response.ok) {
        throw new Error('Failed to update subject')
      }

      const updatedSubject = await response.json()
      setSubjects(prev => prev.map(subject => 
        subject.id === id ? updatedSubject : subject
      ))
      return updatedSubject
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    }
  }

  const deleteSubject = async (id: string) => {
    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete subject')
      }

      setSubjects(prev => prev.filter(subject => subject.id !== id))
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return false
    }
  }

  useEffect(() => {
    fetchSubjects()
  }, [])

  return {
    subjects,
    loading,
    error,
    fetchSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
  }
}