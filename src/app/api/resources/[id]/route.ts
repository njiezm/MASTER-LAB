import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const resource = await db.resource.findUnique({
      where: { id: params.id },
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

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error fetching resource:', error)
    return NextResponse.json(
      { error: 'Failed to fetch resource' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { title, content, tags, favorite } = body

    const resource = await db.resource.update({
      where: { id: params.id },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
        ...(tags && { tags: JSON.stringify(tags) }),
        ...(favorite !== undefined && { favorite }),
        updatedAt: new Date()
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

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Error updating resource:', error)
    return NextResponse.json(
      { error: 'Failed to update resource' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // First get the resource to delete the file if it exists
    const resource = await db.resource.findUnique({
      where: { id: params.id }
    })

    if (!resource) {
      return NextResponse.json(
        { error: 'Resource not found' },
        { status: 404 }
      )
    }

    // Delete the resource from database
    await db.resource.delete({
      where: { id: params.id }
    })

    // TODO: Delete the file from disk if it exists
    // This would require fs operations

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting resource:', error)
    return NextResponse.json(
      { error: 'Failed to delete resource' },
      { status: 500 }
    )
  }
}