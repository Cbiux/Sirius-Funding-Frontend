"use client"

import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { format } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { FundProjectModal } from "./FundProjectModal"
import { toast } from "sonner"
import { calculateTimeLeft } from "@/app/lib/utils"

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

interface ProjectDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  project: Project
  onProjectUpdate: (updatedProject: Project) => void
}

function formatDate(date: string | { seconds: number; nanoseconds: number }) {
  try {
    if (typeof date === 'string') {
      return format(new Date(date), 'MMM dd yyyy', { locale: enUS })
    }
    if ('seconds' in date) {
      return format(new Date(date.seconds * 1000), 'MMM dd yyyy', { locale: enUS })
    }
    return 'Date not available'
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Date not available'
  }
}

export function ProjectDetailsModal({
  isOpen,
  onClose,
  project,
  onProjectUpdate,
}: ProjectDetailsModalProps) {
  const [isFundModalOpen, setIsFundModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [walletAddress, setWalletAddress] = useState<string | null>(null)
  const [currentProject, setCurrentProject] = useState<Project>(project)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(project.deadline))

  useEffect(() => {
    // Acceder a localStorage solo en el lado del cliente
    const address = localStorage.getItem('walletAddress')
    setWalletAddress(address)
  }, [])

  useEffect(() => {
    setCurrentProject(project)
    setTimeLeft(calculateTimeLeft(project.deadline))
  }, [project])

  useEffect(() => {
    if (!isOpen) return

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(currentProject.deadline))
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, currentProject.deadline])

  if (!currentProject) {
    return null
  }

  const progress = (currentProject.donationsXLM / currentProject.goal) * 100
  const canClaim = currentProject.creator === walletAddress && progress >= 80

  const handleDonate = async (amount: number) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects/donate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': walletAddress || '',
        },
        body: JSON.stringify({
          projectId: currentProject.id,
          amount,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error processing donation')
      }

      const data = await response.json()
      
      const updatedProject = {
        ...currentProject,
        donationsXLM: data.donationsXLM
      }
      
      setCurrentProject(updatedProject)
      onProjectUpdate(updatedProject)
      setIsFundModalOpen(false)

      toast.success("Donation successful!", {
        description: `You have donated ${amount} XLM to project ${currentProject.projectId}`,
      })
    } catch (error) {
      console.error('Error donating:', error)
      toast.error("Error processing donation", {
        description: error instanceof Error ? error.message : "Please try again later",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const handleClaim = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/projects/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-wallet-address': walletAddress || '',
        },
        body: JSON.stringify({
          projectId: currentProject.projectId,
        }),
      })

      if (!response.ok) {
        throw new Error('Error claiming funds')
      }

      toast.success("Funds claimed successfully!", {
        description: `You have claimed ${currentProject.donationsXLM} XLM from project ${currentProject.projectId}`,
      })
    } catch (error) {
      console.error('Error claiming:', error)
      toast.error("Error claiming funds", {
        description: "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] max-h-[90vh] bg-black/90 border border-white/10 text-white overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Project Image */}
            <div className="relative aspect-square lg:aspect-auto lg:h-[90vh] rounded-lg overflow-hidden group">
              {currentProject.imageBase64 ? (
                <img
                  src={currentProject.imageBase64}
                  alt={currentProject.projectId}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-black/50 flex items-center justify-center">
                  <span className="text-white/50">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Project Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{currentProject.projectId}</h2>
                <p className="text-white/70">Created by: {currentProject.creator}</p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Description</h3>
                <p className="text-white/80 whitespace-pre-wrap">{currentProject.description || "No description"}</p>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{progress.toFixed(1)}%</span>
                </div>
                <div className="h-4 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-purple-600 transition-all duration-500"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between text-sm text-white/70">
                  <span>{currentProject.donationsXLM} XLM</span>
                  <span>{currentProject.goal} XLM</span>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Time Remaining</h3>
                {timeLeft.isExpired ? (
                  <p className="text-red-400">Project has expired</p>
                ) : (
                  <div className="grid grid-cols-4 gap-2">
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-2xl font-bold">{timeLeft.days}</div>
                      <div className="text-sm text-white/70">Days</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-2xl font-bold">{timeLeft.hours}</div>
                      <div className="text-sm text-white/70">Hours</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-2xl font-bold">{timeLeft.minutes}</div>
                      <div className="text-sm text-white/70">Minutes</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-2 text-center">
                      <div className="text-2xl font-bold">{timeLeft.seconds}</div>
                      <div className="text-sm text-white/70">Seconds</div>
                    </div>
                  </div>
                )}
                <p className="text-sm text-white/70">
                  Deadline: {formatDate(currentProject.deadline)}
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  onClick={() => setIsFundModalOpen(true)}
                  className="flex-1 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  disabled={isLoading || timeLeft.isExpired}
                >
                  Donate
                </Button>
                {canClaim && (
                  <Button
                    onClick={handleClaim}
                    className="bg-green-600 hover:bg-green-700"
                    disabled={isLoading}
                  >
                    Claim
                  </Button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <FundProjectModal
        isOpen={isFundModalOpen}
        onClose={() => setIsFundModalOpen(false)}
        projectId={currentProject.projectId}
        goal={currentProject.goal}
        currentDonations={currentProject.donationsXLM}
        onDonate={handleDonate}
      />
    </>
  )
} 