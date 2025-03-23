import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Project {
  id: string
  projectId: string
  creator: string
  goal: string
  deadline: string
  imageBase64?: string
  createdAt: string
  donationsXLM: string // Total de donaciones recibidas
}

interface ProjectsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function ProjectsModal({ isOpen, onClose }: ProjectsModalProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        const data = await response.json()
        if (data.success) {
          setProjects(data.projects)
        }
      } catch (error) {
        console.error('Error al cargar los proyectos:', error)
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      fetchProjects()
    }
  }, [isOpen])

  const calculateProgress = (donationsXLM: string, goal: string) => {
    const donations = parseFloat(donationsXLM || '0')
    const targetGoal = parseFloat(goal || '0')
    if (targetGoal === 0) return 0
    return Math.min((donations / targetGoal) * 100, 100)
  }

  const handleDonate = (projectId: string) => {
    // TODO: Implementar la lógica de donación
    console.log('Donar a proyecto:', projectId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-black/90 text-white border-white/10">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
            Proyectos Disponibles
          </h2>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="bg-black/50 border-white/10">
                  <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                    {project.imageBase64 ? (
                      <img
                        src={project.imageBase64}
                        alt={project.projectId}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                        <span className="text-white/40">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <CardHeader className="space-y-1">
                    <h3 className="text-xl font-semibold">{project.projectId}</h3>
                    <p className="text-sm text-white/60 truncate">
                      Creador: {project.creator}
                    </p>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Progreso</span>
                        <span>{project.donationsXLM || '0'} / {project.goal} XLM</span>
                      </div>
                      <Progress 
                        value={calculateProgress(project.donationsXLM, project.goal)} 
                        className="h-2"
                      />
                      <div className="text-xs text-right text-white/60">
                        {calculateProgress(project.donationsXLM, project.goal).toFixed(1)}% completado
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-white/60">Fecha límite</span>
                        <span>
                          {format(new Date(project.deadline), 'dd MMM yyyy', { locale: es })}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={() => handleDonate(project.id)}
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                    >
                      Donar
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
} 