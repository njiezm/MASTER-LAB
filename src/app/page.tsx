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
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { 
  Menu, 
  X, 
  Plus, 
  BookOpen, 
  Edit, 
  Trash2, 
  Users, 
  Calendar,
  Clock,
  MapPin,
  FolderOpen,
  Search,
  Filter,
  Star,
  Settings,
  LogOut
} from 'lucide-react'
import { SubjectManager } from '@/components/SubjectManager'
import { SubjectDetail } from '@/components/SubjectDetail'
import PWAInstaller from '@/components/PWAInstaller'

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

export default function MasterLabApp() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSemester, setSelectedSemester] = useState('all')
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

  // Fetch subjects from database
  const fetchSubjects = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subjects')
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      } else {
        setError('Failed to fetch subjects')
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
      setError('Error fetching subjects')
    } finally {
      setLoading(false)
    }
  }

  // Add new subject
  const handleAddSubject = async () => {
    if (!newSubject.name.trim()) return

    try {
      const response = await fetch('/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSubject),
      })

      if (response.ok) {
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
      } else {
        setError('Failed to create subject')
      }
    } catch (error) {
      console.error('Error creating subject:', error)
      setError('Error creating subject')
    }
  }

  // Load subjects on component mount
  useEffect(() => {
    fetchSubjects()
  }, [])

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

  const getColorClass = (color: string) => {
    return colors.find(c => c.value === color)?.class || 'bg-gray-500'
  }

  const filteredSubjects = subjects.filter(subject => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      if (!subject.name.toLowerCase().includes(query) &&
          !subject.description?.toLowerCase().includes(query) &&
          !subject.teacher?.toLowerCase().includes(query)) {
        return false
      }
    }
    if (selectedSemester !== 'all' && subject.semester !== selectedSemester) {
      return false
    }
    return true
  })

  const totalCredits = subjects.reduce((sum, subject) => sum + subject.credits, 0)
  const currentYearSubjects = subjects.filter(s => s.year === new Date().getFullYear())

  return (
    <div className="min-h-screen bg-background">
      {/* Header optimisé pour tablette */}
      <header className="border-b bg-card sticky top-0 z-30">
        <div className="flex h-14 md:h-16 items-center px-2 md:px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mr-2 md:mr-4"
          >
            <Menu className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          
          <div className="flex-1 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <div className="relative flex-1 w-full md:max-w-md">
              <Search className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 md:h-4 md:w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher une matière..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 md:pl-10 text-sm h-9 md:h-10"
              />
            </div>
            
            <Select value={selectedSemester} onValueChange={setSelectedSemester}>
              <SelectTrigger className="w-full md:w-40 lg:w-48 text-sm h-9 md:h-10">
                <SelectValue placeholder="Semestre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les semestres</SelectItem>
                {semesters.map(semester => (
                  <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-1 md:space-x-2 ml-2 md:ml-4">
            <Button onClick={() => setShowAddDialog(true)} size="sm" className="hidden md:flex">
              <Plus className="h-4 w-4 mr-2" />
              Ajouter
            </Button>
            <Button onClick={() => setShowAddDialog(true)} size="icon" className="md:hidden">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar optimisée pour tablette */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden animate-fade-in backdrop-blur-xs"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        <aside className={`w-64 md:w-72 lg:w-80 border-r bg-card transition-all duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 animate-slide-left' : '-translate-x-full'} md:translate-x-0 fixed md:relative h-full z-40`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="text-base md:text-lg font-semibold">Master Lab v2.0</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
                className="md:hidden"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <nav className="space-y-2">
              <Button 
                variant="default" 
                className="w-full justify-start"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Mes Matières
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Star className="h-4 w-4 mr-2" />
                Favoris
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Emploi du temps
              </Button>
            </nav>

            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h3 className="font-medium mb-2">Statistiques</h3>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{currentYearSubjects.length} matière{currentYearSubjects.length > 1 ? 's' : ''} cette année</p>
                <p>{totalCredits} crédits au total</p>
                <p>{subjects.reduce((sum, s) => sum + (s._count?.resources || 0), 0)} ressources</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content optimisé pour tablette */}
        <main className="flex-1 p-3 md:p-4 lg:p-6">
          <div className="max-w-7xl mx-auto w-full">
            {/* En-tête responsive */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">Mes Matières</h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  {currentYearSubjects.length} matière{currentYearSubjects.length > 1 ? 's' : ''} cette année • {totalCredits} crédits au total
                </p>
              </div>
            </div>

            {/* Grille responsive optimisée pour tablette */}
            {filteredSubjects.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <BookOpen className="h-8 w-8 md:h-12 md:w-12 text-muted-foreground mx-auto mb-3 md:mb-4" />
                <h3 className="text-base md:text-lg font-medium mb-2">
                  {searchQuery || selectedSemester !== 'all' ? 'Aucune matière trouvée' : 'Aucune matière'}
                </h3>
                <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6 px-4">
                  {searchQuery || selectedSemester !== 'all' 
                    ? 'Essayez de modifier vos filtres' 
                    : 'Commencez par créer votre première matière'
                  }
                </p>
                <Button onClick={() => setShowAddDialog(true)} className="w-full md:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer une matière
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {filteredSubjects.map(subject => (
                  <Card 
                    key={subject.id} 
                    className="hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-[1.02] hover:-translate-y-1 animate-fade-in"
                    onClick={() => setSelectedSubject(subject)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
                          <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg ${getColorClass(subject.color)} flex items-center justify-center flex-shrink-0`}>
                            <BookOpen className="h-3 w-3 md:h-4 md:w-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-xs md:text-sm font-medium truncate group-hover:text-primary transition-colors">
                              {subject.name}
                            </CardTitle>
                            <CardDescription className="text-xs">
                              {subject.semester} • {subject.credits} crédits
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {subject.description && (
                        <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                          {subject.description}
                        </p>
                      )}
                      
                      <div className="space-y-1">
                        {subject.teacher && (
                          <div className="flex items-center text-xs">
                            <Users className="h-3 w-3 mr-1.5 text-muted-foreground" />
                            <span className="truncate">{subject.teacher}</span>
                          </div>
                        )}
                        {subject.schedule && (
                          <div className="flex items-center text-xs">
                            <Clock className="h-3 w-3 mr-1.5 text-muted-foreground" />
                            <span className="truncate">{subject.schedule}</span>
                          </div>
                        )}
                        {subject.room && (
                          <div className="flex items-center text-xs">
                            <MapPin className="h-3 w-3 mr-1.5 text-muted-foreground" />
                            <span>{subject.room}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t">
                        <div className="flex items-center space-x-1.5">
                          <FolderOpen className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {subject._count?.resources || 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add Subject Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl w-[95vw] sm:w-full max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-lg sm:text-xl">Ajouter une matière</DialogTitle>
            <DialogDescription className="text-sm">
              Créez une nouvelle matière pour organiser vos ressources
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Nom de la matière *</Label>
              <Input
                id="name"
                value={newSubject.name}
                onChange={(e) => setNewSubject({ ...newSubject, name: e.target.value })}
                placeholder="Ex: Machine Learning Avancé"
                className="h-10 sm:h-11"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <Textarea
                id="description"
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
                placeholder="Description du contenu de la matière"
                rows={3}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="teacher" className="text-sm font-medium">Professeur</Label>
                <Input
                  id="teacher"
                  value={newSubject.teacher}
                  onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
                  placeholder="Nom du professeur"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="credits" className="text-sm font-medium">Crédits ECTS</Label>
                <Input
                  id="credits"
                  type="number"
                  value={newSubject.credits}
                  onChange={(e) => setNewSubject({ ...newSubject, credits: parseInt(e.target.value) || 0 })}
                  placeholder="6"
                  className="h-10 sm:h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="schedule" className="text-sm font-medium">Emploi du temps</Label>
                <Input
                  id="schedule"
                  value={newSubject.schedule}
                  onChange={(e) => setNewSubject({ ...newSubject, schedule: e.target.value })}
                  placeholder="Lundi 14h-17h"
                  className="h-10 sm:h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room" className="text-sm font-medium">Salle</Label>
                <Input
                  id="room"
                  value={newSubject.room}
                  onChange={(e) => setNewSubject({ ...newSubject, room: e.target.value })}
                  placeholder="A101"
                  className="h-10 sm:h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="semester" className="text-sm font-medium">Semestre</Label>
                <Select value={newSubject.semester} onValueChange={(value) => setNewSubject({ ...newSubject, semester: value })}>
                  <SelectTrigger className="h-10 sm:h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {semesters.map(semester => (
                      <SelectItem key={semester} value={semester}>{semester}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year" className="text-sm font-medium">Année</Label>
                <Input
                  id="year"
                  type="number"
                  value={newSubject.year}
                  onChange={(e) => setNewSubject({ ...newSubject, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="h-10 sm:h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Couleur</Label>
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

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowAddDialog(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Annuler
              </Button>
              <Button 
                onClick={handleAddSubject}
                disabled={!newSubject.name}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                <Plus className="h-4 w-4 mr-2" />
                Ajouter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <PWAInstaller />
    </div>
  )
}