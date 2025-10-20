'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, File, X, CheckCircle, AlertCircle } from 'lucide-react'

interface DropZoneProps {
  onFilesDrop: (files: File[]) => void
  acceptedTypes?: string[]
  maxFiles?: number
  maxSize?: number
  disabled?: boolean
}

interface FileUpload {
  file: File
  id: string
  status: 'pending' | 'uploading' | 'success' | 'error'
  progress: number
  error?: string
}

export function DropZone({ 
  onFilesDrop, 
  acceptedTypes = ['application/pdf', 'image/*', 'video/*', 'audio/*', '.doc,.docx,.txt,.md'],
  maxFiles = 10,
  maxSize = 50 * 1024 * 1024, // 50MB
  disabled = false
}: DropZoneProps) {
  const [uploads, setUploads] = useState<FileUpload[]>([])
  const [isDragActive, setIsDragActive] = useState(false)

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (disabled) return

    // Traiter les fichiers acceptés
    const newUploads: FileUpload[] = acceptedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      status: 'pending' as const,
      progress: 0
    }))

    setUploads(prev => [...prev, ...newUploads])

    // Simuler l'upload des fichiers
    newUploads.forEach(upload => {
      simulateUpload(upload)
    })

    // Notifier le parent
    onFilesDrop(acceptedFiles)

    // Afficher les erreurs pour les fichiers rejetés
    rejectedFiles.forEach(({ file, errors }) => {
      console.error(`Fichier rejeté: ${file.name}`, errors)
    })
  }, [disabled, onFilesDrop])

  const simulateUpload = (upload: FileUpload) => {
    // Mettre à jour le statut en "uploading"
    setUploads(prev => 
      prev.map(u => u.id === upload.id ? { ...u, status: 'uploading' } : u)
    )

    // Simuler la progression
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        
        // Marquer comme succès
        setUploads(prev => 
          prev.map(u => u.id === upload.id ? { ...u, status: 'success', progress: 100 } : u)
        )

        // Nettoyer après 2 secondes
        setTimeout(() => {
          setUploads(prev => prev.filter(u => u.id !== upload.id))
        }, 2000)
      } else {
        setUploads(prev => 
          prev.map(u => u.id === upload.id ? { ...u, progress } : u)
        )
      }
    }, 200)
  }

  const removeUpload = (id: string) => {
    setUploads(prev => prev.filter(u => u.id !== id))
  }

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => {
      if (type.startsWith('.')) {
        // Extension de fichier
        const extension = type.substring(1)
        acc[extension] = [`.${extension}`]
      } else {
        // MIME type
        if (type.includes('*')) {
          const baseType = type.split('/')[0]
          acc[baseType] = [type]
        } else {
          acc[type] = [type]
        }
      }
      return acc
    }, {} as Record<string, string[]>),
    maxFiles,
    maxSize,
    disabled,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
    onDropAccepted: () => setIsDragActive(false),
    onDropRejected: () => setIsDragActive(false)
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const getFileIcon = (file: File) => {
    const type = file.type
    
    if (type.includes('pdf')) return <File className="h-4 w-4 text-red-500" />
    if (type.includes('image')) return <File className="h-4 w-4 text-green-500" />
    if (type.includes('video')) return <File className="h-4 w-4 text-purple-500" />
    if (type.includes('audio')) return <File className="h-4 w-4 text-blue-500" />
    if (type.includes('word') || type.includes('document')) return <File className="h-4 w-4 text-indigo-500" />
    return <File className="h-4 w-4 text-gray-500" />
  }

  return (
    <div className="space-y-4">
      {/* Zone de glisser-déposer */}
      <Card className={`transition-all duration-200 ${
        isDragActive || dropzoneActive 
          ? 'border-primary bg-primary/5 scale-[1.02]' 
          : 'border-dashed border-2 border-muted-foreground/25 hover:border-muted-foreground/50'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
        <CardContent className="p-8">
          <div {...getRootProps()} className="text-center">
            <input {...getInputProps()} />
            <Upload className={`h-12 w-12 mx-auto mb-4 text-muted-foreground ${
              isDragActive ? 'text-primary animate-bounce' : ''
            }`} />
            
            {isDragActive ? (
              <div className="space-y-2">
                <p className="text-lg font-medium text-primary">
                  Relâchez les fichiers ici...
                </p>
                <p className="text-sm text-muted-foreground">
                  Les fichiers seront traités automatiquement
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium">
                  Glissez-déposez vos fichiers ici
                </p>
                <p className="text-sm text-muted-foreground">
                  ou cliquez pour sélectionner des fichiers
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="secondary">PDF</Badge>
                  <Badge variant="secondary">Images</Badge>
                  <Badge variant="secondary">Vidéos</Badge>
                  <Badge variant="secondary">Audio</Badge>
                  <Badge variant="secondary">Documents</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Max: {maxFiles} fichiers • {formatFileSize(maxSize)} par fichier
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Liste des uploads en cours */}
      {uploads.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Téléchargement en cours...</h4>
            <div className="space-y-3">
              {uploads.map(upload => (
                <div key={upload.id} className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  {getFileIcon(upload.file)}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-medium truncate">
                        {upload.file.name}
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(upload.file.size)}
                        </span>
                        {upload.status === 'success' && (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        )}
                        {upload.status === 'error' && (
                          <AlertCircle className="h-4 w-4 text-red-500" />
                        )}
                        {upload.status !== 'success' && upload.status !== 'error' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeUpload(upload.id)}
                            className="h-6 w-6 p-0"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    {upload.status === 'uploading' && (
                      <Progress value={upload.progress} className="h-1" />
                    )}
                    
                    {upload.status === 'error' && (
                      <p className="text-xs text-red-500">
                        {upload.error || 'Erreur lors du téléchargement'}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}