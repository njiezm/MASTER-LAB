'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  BookOpen, 
  Clock, 
  User, 
  MapPin, 
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  Music,
  Code,
  Link as LinkIcon,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  Eye,
  Download,
  Star,
  MoreHorizontal,
  Edit,
  Trash2
} from 'lucide-react'
import { SubjectDropZone } from './SubjectDropZone'
import { FileViewer } from './FileViewer'

interface Subject {
  id: string
  name: string
  description?: string
  teacher?: string
  schedule?: string
  room?: string
  color: string
  credits: number
  semester: string
  year: number
  icon: string
  createdAt: string
  updatedAt: string
}

interface Resource {
  id: string
  title: string
  type: string
  content?: string
  tags?: string
  fileName?: string
  fileUrl?: string
  fileSize?: number
  mimeType?: string
  favorite: boolean
  subjectId: string
  createdAt: string
  updatedAt: string
}

interface SubjectDetailProps {
  subject: Subject
  onBack: () => void
  onUpdate?: (subject: Subject) => void
}

export function SubjectDetail({ subject, onBack, onUpdate }: SubjectDetailProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null)
  const [showDropZone, setShowDropZone] = useState(false)

  const resourceTypes = [
    { value: 'all', label: 'Tous', icon: Grid, color: 'bg-gray-500' },
    { value: 'pdf', label: 'PDF', icon: FileText, color: 'bg-red-500' },
    { value: 'note', label: 'Notes', icon: FileText, color: 'bg-blue-500' },
    { value: 'video', label: 'Vidéos', icon: Video, color: 'bg-purple-500' },
    { value: 'audio', label: 'Audio', icon: Music, color: 'bg-green-500' },
    { value: 'image', label: 'Images', icon: ImageIcon, color: 'bg-yellow-500' },
    { value: 'link', label: 'Liens', icon: LinkIcon, color: 'bg-indigo-500' },
    { value: 'code', label: 'Code', icon: Code, color: 'bg-gray-500' }
  ]

  useEffect(() => {
    fetchResources()
  }, [subject.id])

  const fetchResources = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/resources?subjectId=${subject.id}`)
      if (!response.ok) throw new Error('Failed to fetch resources')
      const data = await response.json()
      setResources(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleFilesUploaded = (newResources: Resource[]) => {
    setResources(prev => [...newResources, ...prev])
    setShowDropZone(false)
  }

  const handleDeleteResource = async (resourceId: string) => {
    try {
      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete resource')
      setResources(prev => prev.filter(r => r.id !== resourceId))
    } catch (err) {
      console.error('Delete error:', err)
    }
  }

  const handleToggleFavorite = async (resourceId: string) => {
    try {
      const resource = resources.find(r => r.id === resourceId)
      if (!resource) return

      const response = await fetch(`/api/resources/${resourceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ favorite: !resource.favorite })
      })
      if (!response.ok) throw new Error('Failed to update resource')
      
      setResources(prev => 
        prev.map(r => r.id === resourceId ? { ...r, favorite: !r.favorite } : r)
      )
    } catch (err) {
      console.error('Update error:', err)
    }
  }

  const filteredResources = resources.filter(resource => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!resource.title.toLowerCase().includes(query) &&
          !resource.content?.toLowerCase().includes(query)) {
        return false
      }
    }
    if (selectedType !== 'all' && resource.type !== selectedType) {
      return false
    }
    return true
  })

  const getResourceIcon = (type: string) => {
    const resourceType = resourceTypes.find(t => t.value === type)
    return resourceType?.icon || FileText
  }

  const getResourceColor = (type: string) => {
    const resourceType = resourceTypes.find(t => t.value === type)
    return resourceType?.color || 'bg-gray-500'
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const renderResourceCard = (resource: Resource) => {
    const Icon = getResourceIcon(resource.type)
    return (
      <Card key={resource.id} className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className={`w-10 h-10 rounded-lg ${getResourceColor(resource.type)} flex items-center justify-center flex-shrink-0`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-sm font-medium truncate">{resource.title}</CardTitle>
                <CardDescription className="text-xs">
                  {resource.type} • {new Date(resource.createdAt).toLocaleDateString('fr-FR')}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleToggleFavorite(resource.id)}
              className="h-8 w-8 opacity-60 group-hover:opacity-100 transition-opacity"
            >
              <Star className={`h-4 w-4 ${resource.favorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {resource.fileSize && (
                <span className="text-xs text-muted-foreground">
                  {formatFileSize(resource.fileSize)}
                </span>
              )}
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSelectedResource(resource)}
                className="h-7 w-7"
              >
                <Eye className="h-3 w-3" />
              </Button>
              {resource.fileUrl && (
                <Button variant="ghost" size="icon" asChild className="h-7 w-7">
                  <a href={resource.fileUrl} download={resource.fileName}>
                    <Download className="h-3 w-3" />
                  </a>
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteResource(resource.id)}
                className="h-7 w-7 text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 sm:p-6 border-b bg-card">
        <div className="flex items-center justify-between mb-4">
          <Button variant="ghost" onClick={onBack} className="mb-2 sm:mb-0">
            ← Retour
          </Button>
          <Button onClick={() => setShowDropZone(true)} className="hidden sm:flex">
            <Plus className="h-4 w-4 mr-2" />
            Ajouter des ressources
          </Button>
          <Button onClick={() => setShowDropZone(true)} size="icon" className="sm:hidden">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-3">
              <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-${subject.color}-100 flex items-center justify-center`}>
                <BookOpen className={`h-4 w-4 sm:h-5 sm:w-5 text-${subject.color}-600`} />
              </div>
              {subject.name}
            </h1>
            {subject.description && (
              <p className="text-muted-foreground mt-2">{subject.description}</p>
            )}
          </div>
        </div>

        {/* Subject Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {subject.teacher && (
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{subject.teacher}</span>
            </div>
          )}
          {subject.schedule && (
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{subject.schedule}</span>
            </div>
          )}
          {subject.room && (
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{subject.room}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{subject.semester} • {subject.credits} crédits</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="resources" className="h-full flex flex-col">
          <div className="flex-shrink-0 px-4 sm:px-6 pt-4">
            <TabsList className="grid w-full grid-cols-2 lg:w-400">
              <TabsTrigger value="resources">Ressources ({resources.length})</TabsTrigger>
              <TabsTrigger value="upload">Ajouter des fichiers</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="resources" className="flex-1 mt-0 px-4 sm:px-6 pb-6">
            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher des ressources..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {resourceTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <div className="flex border rounded-lg">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('grid')}
                    className="rounded-r-none"
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="icon"
                    onClick={() => setViewMode('list')}
                    className="rounded-l-none"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Resources Grid/List */}
            <ScrollArea className="h-[calc(100vh-300px)]">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-500">{error}</p>
                </div>
              ) : filteredResources.length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">Aucune ressource</h3>
                  <p className="text-muted-foreground mb-4">
                    Commencez par ajouter des fichiers à cette matière
                  </p>
                  <Button onClick={() => setShowDropZone(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter des ressources
                  </Button>
                </div>
              ) : (
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4' 
                  : 'space-y-2'
                }>
                  {filteredResources.map(renderResourceCard)}
                </div>
              )}
            </ScrollArea>
          </TabsContent>

          <TabsContent value="upload" className="flex-1 mt-0 px-4 sm:px-6 pb-6">
            <SubjectDropZone
              subjectId={subject.id}
              onFilesUploaded={handleFilesUploaded}
              maxFiles={50}
              maxSize={200 * 1024 * 1024} // 200MB
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* File Viewer Dialog */}
      {selectedResource && (
        <FileViewer
          resource={selectedResource}
          open={!!selectedResource}
          onClose={() => setSelectedResource(null)}
        />
      )}

      {/* Drop Zone Dialog */}
      {showDropZone && (
        <Dialog open={showDropZone} onOpenChange={setShowDropZone}>
          <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter des ressources à {subject.name}</DialogTitle>
            </DialogHeader>
            <SubjectDropZone
              subjectId={subject.id}
              onFilesUploaded={handleFilesUploaded}
              maxFiles={50}
              maxSize={200 * 1024 * 1024} // 200MB
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}