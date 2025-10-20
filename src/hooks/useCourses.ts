import { useState, useEffect } from 'react'
import { Course } from '@/types/course'

interface UseCoursesReturn {
  courses: Course[]
  loading: boolean
  error: string | null
  fetchCourses: (filters?: { category?: string; level?: string; search?: string; published?: boolean }) => Promise<void>
  createCourse: (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudents' | 'rating'>) => Promise<Course | null>
  updateCourse: (id: string, updates: Partial<Course>) => Promise<Course | null>
  deleteCourse: (id: string) => Promise<boolean>
  getCourseById: (id: string) => Course | null
}

export function useCourses(): UseCoursesReturn {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCourses = async (filters?: { category?: string; level?: string; search?: string; published?: boolean }) => {
    try {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (filters?.category) {
        params.append('category', filters.category)
      }
      if (filters?.level) {
        params.append('level', filters.level)
      }
      if (filters?.search) {
        params.append('search', filters.search)
      }
      if (filters?.published !== undefined) {
        params.append('published', filters.published.toString())
      }

      const response = await fetch(`/api/courses?${params.toString()}`)
      const data = await response.json()

      if (data.success) {
        setCourses(data.data)
      } else {
        setError(data.error || 'Failed to fetch courses')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching courses:', err)
    } finally {
      setLoading(false)
    }
  }

  const createCourse = async (course: Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudents' | 'rating'>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(course),
      })

      const data = await response.json()

      if (data.success) {
        setCourses(prev => [...prev, data.data])
        return data.data
      } else {
        setError(data.error || 'Failed to create course')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating course:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateCourse = async (id: string, updates: Partial<Course>) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/courses', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, updates }),
      })

      const data = await response.json()

      if (data.success) {
        setCourses(prev => 
          prev.map(c => c.id === id ? data.data : c)
        )
        return data.data
      } else {
        setError(data.error || 'Failed to update course')
        return null
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error updating course:', err)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteCourse = async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/courses?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        setCourses(prev => prev.filter(c => c.id !== id))
        return true
      } else {
        setError(data.error || 'Failed to delete course')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error deleting course:', err)
      return false
    } finally {
      setLoading(false)
    }
  }

  const getCourseById = (id: string): Course | null => {
    return courses.find(c => c.id === id) || null
  }

  useEffect(() => {
    fetchCourses()
  }, [])

  return {
    courses,
    loading,
    error,
    fetchCourses,
    createCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
  }
}