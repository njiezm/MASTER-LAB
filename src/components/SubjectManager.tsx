'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  Plus, 
  BookOpen, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Clock,
  MapPin,
  FolderOpen,
  CheckCircle,
  AlertCircle,
  ArrowRight
} from 'lucide-react'
import { SubjectDetail } from './SubjectDetail'

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
  _count?: {
    resources: number
  }
}

const colors = [
  { value: 'blue', label: 'Bleu', class: 'bg-blue-500' },
  { value: 'green', label: 'Vert', class: 'bg-green-500' },
  { value: 'purple', label: 'Violet', class: 'bg-purple-500' },
  { value: 'red', label: 'Rouge', class: 'bg-red-500' },
  { value: 'yellow', label: 'Jaune', class: 'bg-yellow-500' },
  { value: 'pink', label: 'Rose', class: 'bg-pink-500' },
  { value: 'indigo', label: 'Indigo', class: 'bg-indigo-500' },
  { value: 'gray', label: 'Gris', class: 'bg-gray-500' }
]

const semesters = [
  'Semestre 1',
  'Semestre 2',
  'Semestre 3',
  'Semestre 4'
]

export function SubjectManager() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    teacher: '',
    schedule: '',
    room: '',
    color: 'blue',
    credits: 0,
    semester: 'Semestre 1',
    year: new Date().getFullYear()
  })

  useEffect(() => {
    fetchSubjects()
  }, [])

  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subjects')
      if (!response.ok) throw new Error('Failed to fetch subjects')
      const data = await response.json()
      setSubjects(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const addSubject = async () => {
    if (!newSubject.name) return

    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubject)
      })

      if (!response.ok) throw new Error('Failed to create subject')
      
      const createdSubject = await response.json()
      setSubjects(prev => [...prev, createdSubject])
      
      setNewSubject({
        name: '',
        description: '',
        teacher: '',
        schedule: '',
        room: '',
        color: 'blue',
        credits: 0,
        semester: 'Semestre 1',
        year: new Date().getFullYear()
      })
      setShowAddDialog(false)
    } catch (err) {
      console.error('Create subject error:', err)
    }
  }

  const deleteSubject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette matière et toutes ses ressources ?')) return

    try {
      const response = await fetch(`/api/subjects/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete subject')
      setSubjects(prev => prev.filter(s => s.id !== id))
    } catch (err) {
      console.error('Delete subject error:', err)
    }
  }

  const getColorClass = (color: string) => {
    return colors.find(c => c.value === color)?.class || 'bg-gray-500'
  }

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
  const currentYearSubjects = subjects.filter(s => s.year === new Date().getFullYear())

  // Si un sujet est sélectionné, afficher les détails
  if (selectedSubject) {
    return (
      <SubjectDetail
        subject={selectedSubject}
        onBack={() => setSelectedSubject(null)}
        onUpdate={(updated) => {
          setSubjects(prev => prev.map(s => s.id === updated.id ? updated : s))
          setSelectedSubject(updated)
        }}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-2 text-muted-foreground">Chargement des matières...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">Erreur de chargement</h3>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={fetchSubjects} className="mt-4">
          Réessayer
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête avec statistiques */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Mes Matières</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            {currentYearSubjects.length} matière{currentYearSubjects.length > 1 ? 's' : ''} cette année • {totalCredits} crédits au total
          </p>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une matière
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] w-[95vw] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Ajouter une nouvelle matière</DialogTitle>
              <DialogDescription>
                Créez une nouvelle matière pour organiser vos ressources
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nom de la matière *</Label>
                <Input
                  id="name"
                  value={newSubject.name}
                  onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                  placeholder="Ex: Machine Learning Avancé"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={newSubject.description}
                  onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                  placeholder="Description du contenu de la matière"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="teacher">Professeur</Label>
                  <Input
                    id="teacher"
                    value={newSubject.teacher}
                    onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                    placeholder="Nom du professeur"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="credits">Crédits ECTS</Label>
                  <Input
                    id="credits"
                    type="number"
                    value={newSubject.credits}
                    onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) || 0 })}
                    placeholder="6"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule">Emploi du temps</Label>
                  <Input
                    id="schedule"
                    value={newSubject.schedule}
                    onChange={(e) => setNewSubject({ ...newSubject, schedule: e.target.value })}
                    placeholder="Lundi 14h-17h"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="room">Salle</Label>
                  <Input
                    id="room"
                    value={newSubject.room}
                    onChange={(e) => setNewSubject({ ...newSubject, room: e.target.value })}
                    placeholder="A101"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="semester">Semestre</Label>
                  <Select value={newSubject.semester} onValueChange={(value) => setNewSubject({ ...newSubject, semester: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map(semester => (
                        <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="year">Année</Label>
                  <Input
                    id="year"
                    type="number"
                    value={newSubject.year}
                    onChange={(e) => setNewSubject({ ...newSubject, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Couleur</Label>
                <div className="flex flex-wrap gap-2">
                  {colors.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setNewSubject({ ...newSubject, color: color.value })}
                      className={`w-8 h-8 rounded-full ${color.class} ${newSubject.color === color.value ? 'ring-2 ring-offset-2 ring-ring' : ''}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="w-full sm:w-auto">
                Annuler
              </Button>
              <Button onClick={addSubject} disabled={!newSubject.name} className="w-full sm:w-auto">
                Ajouter
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Cartes des matières */}
      {subjects.length === 0 ? (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucune matière</h3>
          <p className="text-muted-foreground mb-4">
            Commencez par créer votre première matière
          </p>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Créer une matière
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {subjects.map(subject => (
            <Card key={subject.id} className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${getColorClass(subject.color)} flex items-center justify-center flex-shrink-0`}>
                      <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm sm:text-lg font-medium truncate group-hover:text-primary transition-colors">
                        {subject.name}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {subject.semester} • {subject.credits} crédits
                      </CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteSubject(subject.id)
                    }}
                    className="h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent onClick={() => setSelectedSubject(subject)}>
                {subject.description && (
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">
                    {subject.description}
                  </p>
                )}
                
                <div className="space-y-2">
                  {subject.teacher && (
                    <div className="flex items-center text-xs sm:text-sm">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{subject.teacher}</span>
                    </div>
                  )}
                  {subject.schedule && (
                    <div className="flex items-center text-xs sm:text-sm">
                      <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground" />
                      <span className="truncate">{subject.schedule}</span>
                    </div>
                  )}
                  {subject.room && (
                    <div className="flex items-center text-xs sm:text-sm">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2 text-muted-foreground" />
                      <span>{subject.room}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center space-x-2">
                    <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {subject._count?.resources || 0} ressource{(subject._count?.resources || 0) > 1 ? 's' : ''}
                    </span>
                  </div>
                  <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}