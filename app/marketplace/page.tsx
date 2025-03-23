"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Loader2 } from "lucide-react"
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { Header } from '@/app/components/Header'
import { ProjectDetailsModal } from '@/app/components/ProjectDetailsModal'

interface Project {
  id: string
  projectId: string
  creator: string
  goal: number
  deadline: string | { seconds: number; nanoseconds: number }
  donationsXLM: number
  description: string
  imageBase64?: string | null
  createdAt: string | { seconds: number; nanoseconds: number }
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

  const calculateProgress = (donationsXLM: number, goal: number) => {
    if (goal === 0) return 0
    return Math.min((donationsXLM / goal) * 100, 100)
  }

  const formatDate = (date: string | { seconds: number; nanoseconds: number }) => {
    try {
      if (typeof date === 'string') {
        return format(new Date(date), 'MMM dd yyyy', { locale: enUS })
      }
      // If it's a Firestore timestamp
      if ('seconds' in date) {
        return format(new Date(date.seconds * 1000), 'MMM dd yyyy', { locale: enUS })
      }
      return 'Date not available'
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Date not available'
    }
  }

  const handleDonate = (projectId: string) => {
    // TODO: Implement donation logic
    console.log('Donate to project:', projectId)
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const handleProjectUpdate = (updatedProject: Project) => {
    console.log('Updating project:', updatedProject)
    // Update project in the projects list
    setProjects(prevProjects => {
      const newProjects = prevProjects.map(p => 
        p.projectId === updatedProject.projectId ? updatedProject : p
      )
      console.log('New projects list:', newProjects)
      return newProjects
    })
    
    // Update selected project if it's the same
    if (selectedProject?.projectId === updatedProject.projectId) {
      setSelectedProject(updatedProject)
    }
  }

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
      <Header />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Project Marketplace
            </h1>
            <p className="mt-2 text-text/60 dark:text-text-dark/60">
              Explore and support innovative projects on the Stellar network
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
                  key={project.projectId} 
                  className="bg-card dark:bg-card-dark border-border dark:border-border-dark overflow-hidden cursor-pointer transition-all hover:scale-[1.02] hover:border-primary/50"
                  onClick={() => handleProjectClick(project)}
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
                        <span className="text-text/40 dark:text-text-dark/40">No image</span>
                      </div>
                    )}
                  </div>

                  <CardHeader className="space-y-1">
                    <h3 className="text-xl font-semibold">{project.projectId}</h3>
                    <p className="text-sm text-text/60 dark:text-text-dark/60 truncate">
                      Creator: {project.creator}
                    </p>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-text/60 dark:text-text-dark/60">Progress</span>
                        <span>{project.donationsXLM} / {project.goal} XLM</span>
                      </div>
                      <Progress 
                        value={calculateProgress(project.donationsXLM, project.goal)} 
                        className="h-2"
                      />
                      <div className="text-xs text-right text-text/60 dark:text-text-dark/60">
                        {calculateProgress(project.donationsXLM, project.goal).toFixed(1)}% completed
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-text/60 dark:text-text-dark/60">Deadline</span>
                        <span>
                          {formatDate(project.deadline)}
                        </span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation() // Prevent modal from opening
                        handleProjectClick(project)
                      }}
                      className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                    >
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <ProjectDetailsModal
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        project={selectedProject || {
          id: '',
          projectId: '',
          creator: '',
          goal: 0,
          deadline: '',
          donationsXLM: 0,
          description: '',
          imageBase64: null,
          createdAt: new Date().toISOString()
        }}
        onProjectUpdate={handleProjectUpdate}
      />
    </div>
  )
} 