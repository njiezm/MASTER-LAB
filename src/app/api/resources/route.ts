import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const type = searchParams.get('type')
    const search = searchParams.get('search')
    const favorite = searchParams.get('favorite')

    let whereClause: any = {}

    if (subjectId) {
      whereClause.subjectId = subjectId
    }

    if (type && type !== 'all') {
      whereClause.type = type
    }

    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }

    if (favorite === 'true') {
      whereClause.favorite = true
    }

    const resources = await db.resource.findMany({
      where: whereClause,
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      },
      orderBy: [
        { favorite: 'desc' },
        { createdAt: 'desc' }
      ]
    })

    return NextResponse.json(resources)
  } catch (error) {
    console.error('Error fetching resources:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, type, content, tags, subjectId, fileUrl, fileName, fileSize, mimeType } = body

    if (!title || !subjectId) {
      return NextResponse.json(
        { error: 'Title and subjectId are required' },
        { status: 400 }
      )
    }

    // Verify subject exists
    const subject = await db.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject) {
      return NextResponse.json(
        { error: 'Subject not found' },
        { status: 404 }
      )
    }

    const resource = await db.resource.create({
      data: {
        title,
        type: type || 'note',
        content: content || '',
        tags: tags ? JSON.stringify(tags) : JSON.stringify([]),
        subjectId,
        fileUrl,
        fileName,
        fileSize,
        mimeType,
        favorite: false
      },
      include: {
        subject: {
          select: {
            id: true,
            name: true,
            color: true
          }
        }
      }
    })

    return NextResponse.json(resource, { status: 201 })
  } catch (error) {
    console.error('Error creating resource:', error)
    return NextResponse.json(
      { error: 'Failed to create resource' },
      { status: 500 }
    )
  }
}