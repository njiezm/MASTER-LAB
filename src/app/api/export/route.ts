import { NextRequest, NextResponse } from 'next/server'

interface Resource {
  id: string
  title: string
  type: 'pdf' | 'note' | 'video' | 'audio' | 'image' | 'link' | 'code'
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  favorite: boolean
  fileUrl?: string
  fileName?: string
  fileSize?: number
}

// Simuler une base de données en mémoire (dans une vraie app, utiliser une vraie BDD)
let resources: Resource[] = []

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'csv'

    if (format === 'csv') {
      // Générer le CSV
      const csv = [
        ['ID', 'Titre', 'Type', 'Contenu', 'Tags', 'Date de création', 'Date de modification', 'Favori', 'Nom du fichier', 'Taille du fichier'],
        ...resources.map(r => [
          r.id,
          r.title,
          r.type,
          r.content.replace(/"/g, '""'), // Échapper les guillemets
          r.tags.join(';'),
          r.createdAt.toISOString(),
          r.updatedAt.toISOString(),
          r.favorite ? 'Oui' : 'Non',
          r.fileName || '',
          r.fileSize || ''
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="masterlab-export-${new Date().toISOString().split('T')[0]}.csv"`
        }
      })
    } else if (format === 'json') {
      // Générer le JSON
      const jsonData = JSON.stringify(resources, null, 2)
      
      return new NextResponse(jsonData, {
        headers: {
          'Content-Type': 'application/json',
          'Content-Disposition': `attachment; filename="masterlab-export-${new Date().toISOString().split('T')[0]}.json"`
        }
      })
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting resources:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export resources' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { resources: resourcesToExport, format } = body

    if (!resourcesToExport || !Array.isArray(resourcesToExport)) {
      return NextResponse.json(
        { success: false, error: 'Resources array is required' },
        { status: 400 }
      )
    }

    if (format === 'csv') {
      const csv = [
        ['ID', 'Titre', 'Type', 'Contenu', 'Tags', 'Date de création', 'Date de modification', 'Favori', 'Nom du fichier', 'Taille du fichier'],
        ...resourcesToExport.map(r => [
          r.id,
          r.title,
          r.type,
          r.content.replace(/"/g, '""'),
          r.tags.join(';'),
          r.createdAt,
          r.updatedAt,
          r.favorite ? 'Oui' : 'Non',
          r.fileName || '',
          r.fileSize || ''
        ])
      ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

      return NextResponse.json({
        success: true,
        data: csv,
        filename: `masterlab-export-${new Date().toISOString().split('T')[0]}.csv`
      })
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported format' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error exporting resources:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to export resources' },
      { status: 500 }
    )
  }
}