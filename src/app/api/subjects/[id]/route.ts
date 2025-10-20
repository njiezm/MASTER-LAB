import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, description, teacher, schedule, room, color, credits, semester, year } = body

    const subject = await db.subject.update({
      where: { id: params.id },
      data: {
        name,
        description,
        teacher,
        schedule,
        room,
        color,
        credits,
        semester,
        year,
        updatedAt: new Date()
      }
    })

    return NextResponse.json(subject)
  } catch (error) {
    console.error('Error updating subject:', error)
    return NextResponse.json(
      { error: 'Failed to update subject' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.subject.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting subject:', error)
    return NextResponse.json(
      { error: 'Failed to delete subject' },
      { status: 500 }
    )
  }
}