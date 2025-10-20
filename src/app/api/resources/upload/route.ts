import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const subjectId = formData.get('subjectId') as string
    const type = formData.get('type') as string

    if (!file || !subjectId) {
      return NextResponse.json(
        { error: 'File and subjectId are required' },
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

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    try {
      await mkdir(uploadsDir, { recursive: true })
    } catch (error) {
      // Directory already exists
    }

    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${uuidv4()}.${fileExtension}`
    const filePath = join(uploadsDir, uniqueFileName)

    // Save file to disk
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create resource in database
    const resource = await db.resource.create({
      data: {
        title: file.name,
        type: type,
        fileName: file.name,
        fileUrl: `/uploads/${uniqueFileName}`,
        fileSize: file.size,
        mimeType: file.type,
        subjectId: subjectId,
        tags: JSON.stringify([]), // Empty tags array
      }
    })

    return NextResponse.json(resource)
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}