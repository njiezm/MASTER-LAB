'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  Download, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  Music, 
  Code, 
  Link as LinkIcon,
  ZoomIn,
  ZoomOut,
  RotateCw
} from 'lucide-react'

interface FileViewerProps {
  resource: {
    id: string
    title: string
    type: string
    content?: string
    fileUrl?: string
    fileName?: string
    fileSize?: number
    mimeType?: string
  }
  open: boolean
  onClose: () => void
}

export function FileViewer({ resource, open, onClose }: FileViewerProps) {
  const [zoom, setZoom] = useState(1)
  const [rotation, setRotation] = useState(0)

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'pdf': return FileText
      case 'image': return ImageIcon
      case 'video': return Video
      case 'audio': return Music
      case 'code': return Code
      case 'link': return LinkIcon
      default: return FileText
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))
  const handleRotate = () => setRotation(prev => (prev + 90) % 360)

  const renderContent = () => {
    switch (resource.type) {
      case 'image':
        if (resource.fileUrl) {
          return (
            <div className="flex items-center justify-center p-4 bg-gray-50 rounded-lg">
              <div className="relative overflow-hidden max-w-full max-h-[70vh]">
                <img
                  src={resource.fileUrl}
                  alt={resource.title}
                  className="max-w-full max-h-[70vh] object-contain transition-transform duration-200"
                  style={{
                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  }}
                />
              </div>
            </div>
          )
        }
        return <p className="text-center text-muted-foreground">Image non disponible</p>

      case 'pdf':
        if (resource.fileUrl) {
          return (
            <div className="w-full h-[70vh]">
              <iframe
                src={resource.fileUrl}
                className="w-full h-full border-0 rounded-lg"
                title={resource.title}
              />
            </div>
          )
        }
        return <p className="text-center text-muted-foreground">PDF non disponible</p>

      case 'video':
        if (resource.fileUrl) {
          return (
            <div className="flex items-center justify-center p-4 bg-black rounded-lg">
              <video
                src={resource.fileUrl}
                controls
                className="max-w-full max-h-[70vh] rounded"
              >
                Votre navigateur ne supporte pas la lecture de cette vidéo.
              </video>
            </div>
          )
        }
        return <p className="text-center text-muted-foreground">Vidéo non disponible</p>

      case 'audio':
        if (resource.fileUrl) {
          return (
            <div className="flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <div className="w-full max-w-md">
                <audio
                  src={resource.fileUrl}
                  controls
                  className="w-full"
                >
                  Votre navigateur ne supporte pas la lecture de cet audio.
                </audio>
              </div>
            </div>
          )
        }
        return <p className="text-center text-muted-foreground">Audio non disponible</p>

      case 'code':
        return (
          <div className="p-4 bg-gray-900 text-green-400 rounded-lg overflow-x-auto">
            <pre className="text-sm font-mono whitespace-pre-wrap">
              {resource.content || 'Code non disponible'}
            </pre>
          </div>
        )

      case 'link':
        return (
          <div className="p-6 text-center">
            <LinkIcon className="h-12 w-12 mx-auto mb-4 text-blue-500" />
            <h3 className="text-lg font-medium mb-2">{resource.title}</h3>
            {resource.content && (
              <p className="text-muted-foreground mb-4">{resource.content}</p>
            )}
            <Button asChild>
              <a href={resource.content} target="_blank" rel="noopener noreferrer">
                Ouvrir le lien
              </a>
            </Button>
          </div>
        )

      case 'note':
      default:
        return (
          <ScrollArea className="h-[70vh] p-6">
            <div className="prose prose-sm max-w-none">
              <h3 className="text-lg font-medium mb-4">{resource.title}</h3>
              <div className="whitespace-pre-wrap text-sm">
                {resource.content || 'Contenu non disponible'}
              </div>
            </div>
          </ScrollArea>
        )
    }
  }

  const Icon = getFileIcon(resource.type)

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-lg">{resource.title}</DialogTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs">
                    {resource.type.toUpperCase()}
                  </Badge>
                  {resource.fileName && (
                    <span className="text-xs text-muted-foreground">
                      {resource.fileName}
                    </span>
                  )}
                  {resource.fileSize && (
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(resource.fileSize)}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {(resource.type === 'image') && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomOut}
                    disabled={zoom <= 0.5}
                  >
                    <ZoomOut className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleZoomIn}
                    disabled={zoom >= 3}
                  >
                    <ZoomIn className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleRotate}
                  >
                    <RotateCw className="h-4 w-4" />
                  </Button>
                </>
              )}
              {resource.fileUrl && (
                <Button variant="outline" size="icon" asChild>
                  <a href={resource.fileUrl} download={resource.fileName}>
                    <Download className="h-4 w-4" />
                  </a>
                </Button>
              )}
              <Button variant="outline" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </DialogContent>
    </Dialog>
  )
}