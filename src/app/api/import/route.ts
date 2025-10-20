import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

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

// Simuler une base de données en mémoire
let resources: Resource[] = []

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    const fileContent = await file.text()
    const fileExtension = file.name.split('.').pop()?.toLowerCase()

    if (fileExtension === 'csv') {
      // Parser le CSV
      const lines = fileContent.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        return NextResponse.json(
          { success: false, error: 'CSV file must have at least a header and one data row' },
          { status: 400 }
        )
      }

      const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim())
      const importedResources: Resource[] = []
      
      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim())
        
        if (values.length >= headers.length && values[0]) {
          const resource: Resource = {
            id: `imported-${Date.now()}-${i}`,
            title: values[headers.indexOf('Titre')] || values[headers.indexOf('title')] || '',
            type: (values[headers.indexOf('Type')] || values[headers.indexOf('type')] || 'note') as Resource['type'],
            content: values[headers.indexOf('Contenu')] || values[headers.indexOf('content')] || '',
            tags: (values[headers.indexOf('Tags')] || values[headers.indexOf('tags')] || '').split(';').filter(t => t.trim()),
            createdAt: new Date(values[headers.indexOf('Date de création')] || values[headers.indexOf('created_at')] || Date.now()),
            updatedAt: new Date(values[headers.indexOf('Date de modification')] || values[headers.indexOf('updated_at')] || Date.now()),
            favorite: (values[headers.indexOf('Favori')] || values[headers.indexOf('favorite')] || 'Non') === 'Oui' || 
                     (values[headers.indexOf('Favori')] || values[headers.indexOf('favorite')] || 'false') === 'true',
            fileName: values[headers.indexOf('Nom du fichier')] || values[headers.indexOf('file_name')] || '',
            fileSize: parseInt(values[headers.indexOf('Taille du fichier')] || values[headers.indexOf('file_size')] || '0') || undefined
          }
          
          importedResources.push(resource)
        }
      }

      // Utiliser ZAI pour analyser et améliorer les ressources importées
      try {
        const zai = await ZAI.create()
        
        for (const resource of importedResources) {
          if (resource.content.length > 50) {
            const completion = await zai.chat.completions.create({
              messages: [
                {
                  role: 'system',
                  content: 'Tu es un assistant qui améliore et catégorise les ressources éducatives. Génère des tags pertinents et améliore le contenu si nécessaire.'
                },
                {
                  role: 'user',
                  content: `Analyse cette ressource et suggère 3-5 tags pertinents : Titre: "${resource.title}", Contenu: "${resource.content.substring(0, 300)}..."`
                }
              ],
              max_tokens: 150,
              temperature: 0.3
            })

            const aiResponse = completion.choices[0]?.message?.content
            if (aiResponse) {
              // Extraire les tags de la réponse AI
              const suggestedTags = aiResponse.match(/#[\w]+/g) || []
              const cleanTags = suggestedTags.map(tag => tag.replace('#', '').trim())
              resource.tags = [...new Set([...resource.tags, ...cleanTags])].slice(0, 5)
            }
          }
        }
      } catch (aiError) {
        console.error('Error analyzing imported resources with AI:', aiError)
        // Continuer sans l'analyse AI si ça échoue
      }

      // Ajouter les ressources importées à la base de données
      resources.push(...importedResources)

      return NextResponse.json({
        success: true,
        data: {
          imported: importedResources.length,
          resources: importedResources
        }
      })
    } else if (fileExtension === 'json') {
      // Parser le JSON
      try {
        const jsonData = JSON.parse(fileContent)
        const importedResources: Resource[] = []

        if (Array.isArray(jsonData)) {
          for (let i = 0; i < jsonData.length; i++) {
            const item = jsonData[i]
            if (item.title && item.content) {
              const resource: Resource = {
                id: `imported-${Date.now()}-${i}`,
                title: item.title,
                type: item.type || 'note',
                content: item.content,
                tags: item.tags || [],
                createdAt: new Date(item.createdAt || Date.now()),
                updatedAt: new Date(item.updatedAt || Date.now()),
                favorite: item.favorite || false,
                fileName: item.fileName,
                fileSize: item.fileSize
              }
              importedResources.push(resource)
            }
          }
        }

        resources.push(...importedResources)

        return NextResponse.json({
          success: true,
          data: {
            imported: importedResources.length,
            resources: importedResources
          }
        })
      } catch (parseError) {
        return NextResponse.json(
          { success: false, error: 'Invalid JSON format' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: false, error: 'Unsupported file format. Please use CSV or JSON.' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error importing resources:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to import resources' },
      { status: 500 }
    )
  }
}