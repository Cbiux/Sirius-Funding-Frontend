"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { Header } from '@/app/components/Header'
import { ProjectDetailsModal } from '@/app/components/ProjectDetailsModal'

interface Project {
  id: string
  projectId: string
  creator: string
  goal: string
  deadline: string
  imageBase64?: string
  createdAt: string | { seconds: number; nanoseconds: number }
  donationsXLM: string
}

export default function MarketplacePage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

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

    fetchProjects()
  }, [])

  const calculateProgress = (donationsXLM: string, goal: string) => {
    const donations = parseFloat(donationsXLM || '0')
    const targetGoal = parseFloat(goal || '0')
    if (targetGoal === 0) return 0
    return Math.min((donations / targetGoal) * 100, 100)
  }

  const formatDate = (date: string | { seconds: number; nanoseconds: number }) => {
    try {
      if (typeof date === 'string') {
        return format(new Date(date), 'dd MMM yyyy', { locale: es })
      }
      // Si es un timestamp de Firestore
      if ('seconds' in date) {
        return format(new Date(date.seconds * 1000), 'dd MMM yyyy', { locale: es })
      }
      return 'Fecha no disponible'
    } catch (error) {
      console.error('Error al formatear la fecha:', error)
      return 'Fecha no disponible'
    }
  }

  const handleDonate = (projectId: string) => {
    // TODO: Implementar la lógica de donación
    console.log('Donar a proyecto:', projectId)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Marketplace de Proyectos
            </h1>
            <p className="mt-2 text-white/60">
              Explora y apoya proyectos innovadores en la red Stellar
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-[60vh]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card 
                  key={project.id} 
                  className="bg-black/50 border-white/10 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/50"
                  onClick={() => setSelectedProject(project)}
                >
                  <div className="aspect-video w-full overflow-hidden">
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
                          {formatDate(project.deadline)}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation() // Evitar que se abra el modal
                        handleDonate(project.id)
                      }}
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
      </main>

      <ProjectDetailsModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        onDonate={handleDonate}
      />
    </div>
  )
} 