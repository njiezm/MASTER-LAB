'use client'

import { useState } from 'react'
import { Course } from '@/types/course'
import { useCourses } from '@/hooks/useCourses'
import { CourseCard } from '@/components/CourseCard'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Plus, 
  Search, 
  Filter, 
  BookOpen, 
  Users, 
  Star,
  Clock,
  DollarSign,
  Edit,
  Trash2,
  Eye
} from 'lucide-react'

interface CourseManagerProps {
  mode?: 'student' | 'instructor' | 'admin'
}

export function CourseManager({ mode = 'student' }: CourseManagerProps) {
  const { courses, loading, error, fetchCourses, createCourse, updateCourse, deleteCourse } = useCourses()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedLevel, setSelectedLevel] = useState<string>('all')
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)
  const [newCourse, setNewCourse] = useState<Partial<Course>>({
    title: '',
    description: '',
    instructor: '',
    category: '',
    level: 'beginner',
    duration: 0,
    price: 0,
    tags: [],
    chapters: [],
    published: false
  })

  const categories = Array.from(new Set(courses.map(c => c.category)))
  const levels = ['beginner', 'intermediate', 'advanced']

  const filteredCourses = courses.filter(course => {
    if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !course.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (selectedCategory !== 'all' && course.category !== selectedCategory) {
      return false
    }
    if (selectedLevel !== 'all' && course.level !== selectedLevel) {
      return false
    }
    if (mode === 'instructor' && course.instructor !== 'Current User') {
      return false
    }
    return true
  })

  const handleCreateCourse = async () => {
    if (!newCourse.title || !newCourse.description || !newCourse.instructor || !newCourse.category) {
      return
    }

    const result = await createCourse(newCourse as Omit<Course, 'id' | 'createdAt' | 'updatedAt' | 'enrolledStudents' | 'rating'>)
    
    if (result) {
      setNewCourse({
        title: '',
        description: '',
        instructor: '',
        category: '',
        level: 'beginner',
        duration: 0,
        price: 0,
        tags: [],
        chapters: [],
        published: false
      })
      setShowCreateDialog(false)
    }
  }

  const handleUpdateCourse = async () => {
    if (!editingCourse) return

    await updateCourse(editingCourse.id, editingCourse)
    setEditingCourse(null)
  }

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce cours ?')) {
      await deleteCourse(id)
    }
  }

  const handleEnroll = (courseId: string) => {
    // Logique d'inscription au cours
    console.log('Inscription au cours:', courseId)
  }

  const handleViewCourse = (courseId: string) => {
    // Logique de visualisation du cours
    console.log('Visualisation du cours:', courseId)
  }

  const totalStudents = courses.reduce((sum, course) => sum + course.enrolledStudents, 0)
  const averageRating = courses.length > 0 
    ? (courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)
    : '0'

  if (mode === 'admin') {
    return (
      <div className="space-y-6">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Cours</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{courses.length}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Étudiants</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Note Moyenne</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageRating}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenus</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {courses.reduce((sum, course) => sum + (course.price * course.enrolledStudents), 0).toFixed(2)}€
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtres et actions */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-2 flex-1">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un cours..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedLevel} onValueChange={setSelectedLevel}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Niveau" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les niveaux</SelectItem>
                {levels.map(level => (
                  <SelectItem key={level} value={level}>
                    {level === 'beginner' ? 'Débutant' : level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Créer un cours
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Créer un nouveau cours</DialogTitle>
                <DialogDescription>
                  Remplissez les informations pour créer un nouveau cours
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Titre</Label>
                  <Input
                    id="title"
                    value={newCourse.title}
                    onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })}
                    placeholder="Titre du cours"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })}
                    placeholder="Description du cours"
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="instructor">Instructeur</Label>
                    <Input
                      id="instructor"
                      value={newCourse.instructor}
                      onChange={(e) => setNewCourse({ ...newCourse, instructor: e.target.value })}
                      placeholder="Nom de l'instructeur"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="category">Catégorie</Label>
                    <Input
                      id="category"
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })}
                      placeholder="Catégorie"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="level">Niveau</Label>
                    <Select value={newCourse.level} onValueChange={(value) => setNewCourse({ ...newCourse, level: value as any })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Débutant</SelectItem>
                        <SelectItem value="intermediate">Intermédiaire</SelectItem>
                        <SelectItem value="advanced">Avancé</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="duration">Durée (minutes)</Label>
                    <Input
                      id="duration"
                      type="number"
                      value={newCourse.duration}
                      onChange={(e) => setNewCourse({ ...newCourse, duration: parseInt(e.target.value) || 0 })}
                      placeholder="Durée"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="price">Prix (€)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({ ...newCourse, price: parseFloat(e.target.value) || 0 })}
                      placeholder="Prix"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Annuler
                  </Button>
                  <Button onClick={handleCreateCourse}>
                    Créer le cours
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Liste des cours */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map(course => (
            <div key={course.id} className="relative">
              <CourseCard
                course={course}
                onView={handleViewCourse}
              />
              {(mode === 'admin' || mode === 'instructor') && (
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingCourse(course)}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteCourse(course.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredCourses.length === 0 && !loading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun cours trouvé</h3>
            <p className="text-muted-foreground mb-4">
              Commencez par créer votre premier cours
            </p>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Créer un cours
            </Button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Cours</h1>
          <p className="text-muted-foreground">
            {filteredCourses.length} cours trouvé{filteredCourses.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Filtres */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un cours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLevel} onValueChange={setSelectedLevel}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Niveau" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les niveaux</SelectItem>
            {levels.map(level => (
              <SelectItem key={level} value={level}>
                {level === 'beginner' ? 'Débutant' : level === 'intermediate' ? 'Intermédiaire' : 'Avancé'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Grid des cours */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCourses.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onEnroll={handleEnroll}
            onView={handleViewCourse}
          />
        ))}
      </div>

      {filteredCourses.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Aucun cours trouvé</h3>
          <p className="text-muted-foreground">
            Essayez de modifier vos filtres de recherche
          </p>
        </div>
      )}
    </div>
  )
}