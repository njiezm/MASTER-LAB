import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'
import { Course, Chapter } from '@/types/course'

// Simuler une base de données en mémoire
let courses: Course[] = [
  {
    id: '1',
    title: 'Introduction à Next.js',
    description: 'Apprenez les bases de Next.js pour créer des applications web modernes',
    instructor: 'Jean Dupont',
    category: 'Développement Web',
    level: 'beginner',
    duration: 480, // 8 heures
    price: 0,
    tags: ['Next.js', 'React', 'JavaScript', 'Web'],
    resources: [],
    chapters: [
      {
        id: '1-1',
        title: 'Introduction à Next.js',
        description: 'Découverte de Next.js et de ses concepts fondamentaux',
        order: 1,
        duration: 60,
        resources: [],
        completed: false
      },
      {
        id: '1-2',
        title: 'Routing et Navigation',
        description: 'Apprendre le système de routing de Next.js',
        order: 2,
        duration: 90,
        resources: [],
        completed: false
      },
      {
        id: '1-3',
        title: 'Gestion des données',
        description: 'Comment gérer les données dans Next.js',
        order: 3,
        duration: 120,
        resources: [],
        completed: false
      }
    ],
    enrolledStudents: 156,
    rating: 4.8,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    published: true
  },
  {
    id: '2',
    title: 'TypeScript Avancé',
    description: 'Maîtrisez les concepts avancés de TypeScript',
    instructor: 'Marie Martin',
    category: 'Programmation',
    level: 'advanced',
    duration: 600, // 10 heures
    price: 49.99,
    tags: ['TypeScript', 'JavaScript', 'Typage', 'Avancé'],
    resources: [],
    chapters: [
      {
        id: '2-1',
        title: 'Types avancés',
        description: 'Découverte des types complexes et génériques',
        order: 1,
        duration: 120,
        resources: [],
        completed: false
      },
      {
        id: '2-2',
        title: 'Decorators et Métaprogrammation',
        description: 'Utilisation des decorators en TypeScript',
        order: 2,
        duration: 90,
        resources: [],
        completed: false
      }
    ],
    enrolledStudents: 89,
    rating: 4.9,
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    published: true
  }
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')
    const published = searchParams.get('published')

    let filteredCourses = courses

    if (category) {
      filteredCourses = filteredCourses.filter(c => c.category === category)
    }

    if (level) {
      filteredCourses = filteredCourses.filter(c => c.level === level)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filteredCourses = filteredCourses.filter(c => 
        c.title.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower) ||
        c.tags.some(tag => tag.toLowerCase().includes(searchLower))
      )
    }

    if (published !== null) {
      const isPublished = published === 'true'
      filteredCourses = filteredCourses.filter(c => c.published === isPublished)
    }

    return NextResponse.json({
      success: true,
      data: filteredCourses,
      count: filteredCourses.length
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, instructor, category, level, duration, price, tags, chapters } = body

    if (!title || !description || !instructor || !category) {
      return NextResponse.json(
        { success: false, error: 'Required fields are missing' },
        { status: 400 }
      )
    }

    const newCourse: Course = {
      id: Date.now().toString(),
      title,
      description,
      instructor,
      category,
      level: level || 'beginner',
      duration: duration || 0,
      price: price || 0,
      tags: tags || [],
      resources: [],
      chapters: chapters || [],
      enrolledStudents: 0,
      rating: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      published: false
    }

    // Utiliser ZAI pour générer une description améliorée si nécessaire
    if (description.length < 100) {
      try {
        const zai = await ZAI.create()
        const completion = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'Tu es un assistant qui génère des descriptions de cours attractives et détaillées.'
            },
            {
              role: 'user',
              content: `Génère une description détaillée pour ce cours : Titre: "${title}", Catégorie: "${category}", Niveau: "${level}"`
            }
          ],
          max_tokens: 200,
          temperature: 0.7
        })

        const enhancedDescription = completion.choices[0]?.message?.content
        if (enhancedDescription) {
          newCourse.description = enhancedDescription
        }
      } catch (aiError) {
        console.error('Error generating enhanced description:', aiError)
      }
    }

    courses.push(newCourse)

    return NextResponse.json({
      success: true,
      data: newCourse
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const courseIndex = courses.findIndex(c => c.id === id)
    if (courseIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    courses[courseIndex] = {
      ...courses[courseIndex],
      ...updates,
      updatedAt: new Date()
    }

    return NextResponse.json({
      success: true,
      data: courses[courseIndex]
    })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Course ID is required' },
        { status: 400 }
      )
    }

    const courseIndex = courses.findIndex(c => c.id === id)
    if (courseIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Course not found' },
        { status: 404 }
      )
    }

    const deletedCourse = courses.splice(courseIndex, 1)[0]

    return NextResponse.json({
      success: true,
      data: deletedCourse
    })
  } catch (error) {
    console.error('Error deleting course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete course' },
      { status: 500 }
    )
  }
}