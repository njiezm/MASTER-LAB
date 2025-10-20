export interface Course {
  id: string
  title: string
  description: string
  instructor: string
  category: string
  level: 'beginner' | 'intermediate' | 'advanced'
  duration: number // en minutes
  price: number
  image?: string
  tags: string[]
  resources: string[] // IDs des ressources associées
  chapters: Chapter[]
  enrolledStudents: number
  rating: number
  createdAt: Date
  updatedAt: Date
  published: boolean
}

export interface Chapter {
  id: string
  title: string
  description: string
  order: number
  duration: number // en minutes
  videoUrl?: string
  resources: string[] // IDs des ressources associées
  completed: boolean
}

export interface CourseProgress {
  id: string
  courseId: string
  studentId: string
  completedChapters: string[]
  progress: number // 0-100
  startedAt: Date
  completedAt?: Date
  lastAccessedAt: Date
}