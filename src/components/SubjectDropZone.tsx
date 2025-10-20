'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Upload, 
  X, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Code, 
  Link as LinkIcon,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface SubjectDropZoneProps {
  subjectId: string
  onFilesUploaded: (files: any[]) => void
  maxFiles?: number
  maxSize?: number
}

interface UploadProgress {
  file: File
  progress: number
  status: 'pending' | 'uploading' | 'success' | 'error'
  error?: string
}

export function SubjectDropZone({ 
  subjectId, 
  onFilesUploaded, 
  maxFiles = 20, 
  maxSize = 100 * 1024 * 1024 // 100MB
}: SubjectDropZoneProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const getFileIcon = (file: File) => {
    const type = file.type.split('/')[0]
    switch (type) {
      case 'application': return FileText
      case 'image': return ImageIcon
      case 'video': return Video
      case 'audio': return Music
      case 'text': return FileText
      default: return FileText
    }
  }

  const getResourceType = (file: File): string => {
    if (file.type === 'application/pdf') return 'pdf'
    if (file.type.startsWith('image/')) return 'image'
    if (file.type.startsWith('video/')) return 'video'
    if (file.type.startsWith('audio/')) return 'audio'
    if (file.type.startsWith('text/') || file.type.endsWith('.md')) return 'code'
    return 'note'
  }

  const uploadFile = async (file: File): Promise<any> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('subjectId', subjectId)
    formData.append('type', getResourceType(file))

    try {
      const response = await fetch('/api/resources/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      return await response.json()
    } catch (error) {
      throw new Error('Failed to upload file')
    }
  }

  const processFiles = async (files: File[]) => {
    const newUploads: UploadProgress[] = files.map(file => ({
      file,
      progress: 0,
      status: 'pending' as const
    }))

    setUploads(prev => [...prev, ...newUploads])

    const uploadedResources = []

    for (let i = 0; i < newUploads.length; i++) {
      const upload = newUploads[i]
      
      // Update status to uploading
      setUploads(prev => 
        prev.map((u, index) => 
          index === prev.length - newUploads.length + i 
            ? { ...u, status: 'uploading', progress: 10 }
            : u
        )
      )

      try {
        // Simulate progress
        const progressInterval = setInterval(() => {
          setUploads(prev => 
            prev.map((u, index) => 
              index === prev.length - newUploads.length + i && u.progress < 90
                ? { ...u, progress: Math.min(u.progress + 10, 90) }
                : u
            )
          )
        }, 200)

        const resource = await uploadFile(upload.file)
        clearInterval(progressInterval)

        // Update to success
        setUploads(prev => 
          prev.map((u, index) => 
            index === prev.length - newUploads.length + i
              ? { ...u, status: 'success', progress: 100 }
              : u
          )
        )

        uploadedResources.push(resource)
      } catch (error) {
        // Update to error
        setUploads(prev => 
          prev.map((u, index) => 
            index === prev.length - newUploads.length + i
              ? { ...u, status: 'error', error: 'Upload failed' }
              : u
          )
        )
      }
    }

    if (uploadedResources.length > 0) {
      onFilesUploaded(uploadedResources)
    }

    // Clear successful uploads after 3 seconds
    setTimeout(() => {
      setUploads(prev => prev.filter(u => u.status !== 'success'))
    }, 3000)
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setIsDragActive(false)
    processFiles(acceptedFiles)
  }, [subjectId, onFilesUploaded])

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    maxFiles,
    maxSize,
    multiple: true
  })

  const removeUpload = (index: number) => {
    setUploads(prev => prev.filter((_, i) => i !== index))
  }

  const clearCompleted = () => {
    setUploads(prev => prev.filter(u => u.status === 'pending' || u.status === 'uploading'))
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <Card 
        {...getRootProps()} 
        className={`
          border-2 border-dashed transition-all duration-200 cursor-pointer
          ${isDragActive || dropzoneActive 
            ? 'border-primary bg-primary/5 scale-[1.02]' 
            : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50'
          }
        `}
      >
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <input {...getInputProps()} />
          <Upload className={`h-12 w-12 mb-4 transition-colors ${
            isDragActive || dropzoneActive ? 'text-primary' : 'text-muted-foreground'
          }`} />
          <div className="space-y-2">
            <h3 className="text-lg font-medium">
              {isDragActive || dropzoneActive 
                ? 'Déposez les fichiers ici' 
                : 'Glissez-déposez des fichiers ici'
              }
            </h3>
            <p className="text-sm text-muted-foreground">
              ou cliquez pour sélectionner des fichiers
            </p>
            <div className="flex flex-wrap gap-1 justify-center mt-2">
              <Badge variant="outline" className="text-xs">PDF</Badge>
              <Badge variant="outline" className="text-xs">Images</Badge>
              <Badge variant="outline" className="text-xs">Vidéos</Badge>
              <Badge variant="outline" className="text-xs">Audio</Badge>
              <Badge variant="outline" className="text-xs">Documents</Badge>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Max {maxFiles} fichiers • {Math.round(maxSize / 1024 / 1024)}MB par fichier
          </p>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium">Téléchargements ({uploads.length})</h4>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearCompleted}
                disabled={uploads.some(u => u.status === 'pending' || u.status === 'uploading')}
              >
                Effacer complétés
              </Button>
            </div>
            
            <ScrollArea className="h-48">
              <div className="space-y-3">
                {uploads.map((upload, index) => {
                  const Icon = getFileIcon(upload.file)
                  return (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                      <Icon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium truncate">{upload.file.name}</p>
                          <div className="flex items-center space-x-2">
                            {upload.status === 'success' && (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                            {upload.status === 'error' && (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeUpload(index)}
                              className="h-6 w-6"
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        {(upload.status === 'uploading' || upload.status === 'pending') && (
                          <Progress value={upload.progress} className="h-1" />
                        )}
                        
                        {upload.status === 'error' && (
                          <p className="text-xs text-red-500">{upload.error}</p>
                        )}
                        
                        <p className="text-xs text-muted-foreground">
                          {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  )
}