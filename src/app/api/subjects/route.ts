import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET() {
  try {
    const subjects = await db.subject.findMany({
      include: {
        _count: {
          select: {
            resources: true
          }
        }
      },
      orderBy: [
        { year: 'desc' },
        { semester: 'asc' },
        { name: 'asc' }
      ]
    })
    
    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, teacher, schedule, room, color, credits, semester, year } = body

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const subject = await db.subject.create({
      data: {
        name,
        description,
        teacher,
        schedule,
        room,
        color: color || 'blue',
        credits: credits || 0,
        semester: semester || 'Semestre 1',
        year: year || new Date().getFullYear()
      }
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}