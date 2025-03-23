"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

interface Project {
  id: string
  projectId: string
  creator: string
  goal: string
  deadline: string
  imageBase64?: string
  createdAt: string | { seconds: number; nanoseconds: number }
  donationsXLM: string
  description: string
}

interface ProjectDetailsModalProps {
  project: Project | null
  isOpen: boolean
  onClose: () => void
  onDonate: (projectId: string) => void
}

export function ProjectDetailsModal({ project, isOpen, onClose, onDonate }: ProjectDetailsModalProps) {
  if (!project) return null

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-y-auto bg-black/90 text-white border-white/10 p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
          {/* Columna de la imagen */}
          <div className="relative h-[40vh] lg:h-[90vh] w-full overflow-hidden">
            {project.imageBase64 ? (
              <div className="relative w-full h-full group cursor-zoom-in">
                <img
                  src={project.imageBase64}
                  alt={project.projectId}
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <span className="text-white/40">Sin imagen</span>
              </div>
            )}
          </div>

          {/* Columna de detalles */}
          <div className="p-8 space-y-8 overflow-y-auto">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
                {project.projectId}
              </h2>
              <p className="text-lg text-white/60">
                Creado por: {project.creator}
              </p>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">Descripción del Proyecto</h3>
                <p className="text-white/80 whitespace-pre-wrap">
                  {project.description || "Sin descripción disponible"}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between text-lg">
                  <span className="text-white/60">Progreso de la meta</span>
                  <span className="font-semibold">{project.donationsXLM || '0'} / {project.goal} XLM</span>
                </div>
                <Progress 
                  value={calculateProgress(project.donationsXLM, project.goal)} 
                  className="h-4"
                />
                <div className="text-base text-right text-white/60">
                  {calculateProgress(project.donationsXLM, project.goal).toFixed(1)}% completado
                </div>
              </div>

              <div className="space-y-4 bg-white/5 rounded-lg p-4">
                <div className="flex justify-between text-base">
                  <span className="text-white/60">Fecha límite</span>
                  <span className="font-semibold">
                    {formatDate(project.deadline)}
                  </span>
                </div>
                <div className="flex justify-between text-base">
                  <span className="text-white/60">Fecha de creación</span>
                  <span className="font-semibold">
                    {formatDate(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              onClick={() => onDonate(project.id)}
              className="w-full h-14 text-xl font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
            >
              Donar a este proyecto
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 