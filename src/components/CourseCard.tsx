'use client'

import { Course } from '@/types/course'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Play, 
  DollarSign,
  Calendar,
  User,
  Award
} from 'lucide-react'

interface CourseCardProps {
  course: Course
  onEnroll?: (courseId: string) => void
  onView?: (courseId: string) => void
  showProgress?: boolean
  progress?: number
}

export function CourseCard({ 
  course, 
  onEnroll, 
  onView, 
  showProgress = false, 
  progress = 0 
}: CourseCardProps) {
  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins}min`
    }
    return `${mins}min`
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return 'Débutant'
      case 'intermediate': return 'Intermédiaire'
      case 'advanced': return 'Avancé'
      default: return level
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getLevelColor(course.level)}>
                {getLevelText(course.level)}
              </Badge>
              {course.price === 0 && (
                <Badge variant="secondary">Gratuit</Badge>
              )}
            </div>
            <CardTitle className="text-lg line-clamp-2 mb-2">
              {course.title}
            </CardTitle>
            <CardDescription className="line-clamp-3">
              {course.description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Métadonnées */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{formatDuration(course.duration)}</span>
          </div>
        </div>

        {/* Statistiques */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">{course.enrolledStudents} étudiants</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{course.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {course.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {course.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{course.tags.length - 3}
            </Badge>
          )}
        </div>

        {/* Progression (si affichée) */}
        {showProgress && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Progression</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          {onView && (
            <Button 
              onClick={() => onView(course.id)} 
              className="flex-1"
              variant={showProgress ? "default" : "outline"}
            >
              {showProgress ? (
                <>
                  <Play className="h-4 w-4 mr-2" />
                  Continuer
                </>
              ) : (
                <>
                  <BookOpen className="h-4 w-4 mr-2" />
                  Voir
                </>
              )}
            </Button>
          )}
          
          {!showProgress && onEnroll && (
            <Button 
              onClick={() => onEnroll(course.id)} 
              className="flex-1"
            >
              {course.price > 0 ? (
                <>
                  <DollarSign className="h-4 w-4 mr-2" />
                  {course.price}€
                </>
              ) : (
                <>
                  <Award className="h-4 w-4 mr-2" />
                  S'inscrire
                </>
              )}
            </Button>
          )}
        </div>

        {/* Date de création */}
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>Créé le {course.createdAt.toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  )
}