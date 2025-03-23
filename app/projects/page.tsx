"use client"

import { useState, useEffect } from "react"
import { Header } from "../components/Header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Star, Calendar, Target, User, Loader2, Image as ImageIcon, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import DatePicker, { registerLocale } from "react-datepicker"
import { enUS } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"
import { walletKit } from "../wallets/walletsKit"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { createProject } from "../services/projectService"
import { Textarea } from "@/components/ui/textarea"

// Register English locale
registerLocale("en", enUS)

export default function ProjectsPage() {
  const [formData, setFormData] = useState({
    projectId: "",
    creator: "",
    goal: "",
    deadline: null as Date | null,
    imageBase64: null as string | null,
    description: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const checkWalletConnection = () => {
      const storedWallet = localStorage.getItem('walletAddress')
      const isConnected = !!storedWallet && storedWallet !== ''
      
      setFormData(prev => ({
        ...prev,
        creator: isConnected ? storedWallet : ""
      }))
    }

    // Verificar al montar el componente
    checkWalletConnection()

    // Verificar cuando cambie el estado de la wallet
    window.addEventListener('walletChanged', checkWalletConnection)
    window.addEventListener('walletDisconnected', checkWalletConnection)

    return () => {
      window.removeEventListener('walletChanged', checkWalletConnection)
      window.removeEventListener('walletDisconnected', checkWalletConnection)
    }
  }, [])

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Invalid file type", {
          description: "Please select an image (PNG, JPG, JPEG)",
        })
        return
      }
      
      // Validate size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File too large", {
          description: "Image must be less than 5MB",
        })
        return
      }

      try {
        // Convert image to Base64
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setFormData(prev => ({ ...prev, imageBase64: base64String }))
          setImagePreview(base64String)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error converting image:', error)
        toast.error("Error processing image", {
          description: "Please try with another image",
        })
      }
    }
  }

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageBase64: null }))
    setImagePreview(null)
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.projectId.trim()) {
      newErrors.projectId = "Project ID is required"
    }

    if (!formData.creator) {
      newErrors.creator = "You must connect your wallet"
    }

    if (!formData.goal || Number(formData.goal) <= 0) {
      newErrors.goal = "Goal must be greater than 0 XLM"
    }

    if (!formData.deadline) {
      newErrors.deadline = "Deadline is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: Implement project creation
      console.log("Creating project:", formData);
      toast.success("Project created successfully!", {
        className: "bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark",
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        },
      });
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error("Error creating project", {
        className: "bg-card dark:bg-card-dark text-text dark:text-text-dark border border-border dark:border-border-dark",
        style: {
          background: "var(--background)",
          color: "var(--foreground)",
          borderColor: "var(--border)",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background-dark text-text dark:text-text-dark">
      <Header />
      <Toaster />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <Badge className="mb-4 px-4 py-1.5 bg-primary/20 text-primary border-primary/30">
              Create Project
            </Badge>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Start Your Project on Stellar
            </h1>
            <p className="text-white/70">
              Complete the project details to begin your funding journey
            </p>
          </div>

          <Card className="bg-card dark:bg-card-dark backdrop-blur-md border-border dark:border-border-dark">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectId" className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Project ID
                  </Label>
                  <Input
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    required
                    className={`bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark ${errors.projectId ? 'border-red-500' : ''}`}
                    placeholder="Enter unique project ID"
                  />
                  {errors.projectId && (
                    <p className="text-sm text-red-500">{errors.projectId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creator" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Creator (Wallet)
                  </Label>
                  <Input
                    id="creator"
                    name="creator"
                    value={formData.creator}
                    readOnly
                    className={`bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark cursor-not-allowed opacity-70 ${errors.creator ? 'border-red-500' : ''}`}
                    placeholder="Connect your wallet to continue"
                  />
                  {errors.creator && (
                    <p className="text-sm text-red-500">{errors.creator}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Project Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe your project in detail..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full min-h-[150px] rounded-md border border-border dark:border-border-dark bg-card dark:bg-card-dark px-3 py-2 text-sm text-text dark:text-text-dark placeholder:text-text/60 dark:placeholder:text-text-dark/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal" className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Goal (XLM)
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="goal"
                      name="goal"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.goal}
                      onChange={handleInputChange}
                      required
                      className={`bg-card dark:bg-card-dark border-border dark:border-border-dark text-text dark:text-text-dark ${errors.goal ? 'border-red-500' : ''}`}
                      placeholder="Enter target amount in XLM"
                    />
                    {errors.goal && (
                      <p className="text-sm text-red-500">{errors.goal}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {[100, 500, 1000, 5000, 10000].map((amount) => (
                        <button
                          key={amount}
                          type="button"
                          onClick={() => {
                            setFormData(prev => ({ ...prev, goal: amount.toString() }))
                            setErrors(prev => ({ ...prev, goal: "" }))
                          }}
                          className="px-3 py-1 text-sm bg-card dark:bg-card-dark border border-border dark:border-border-dark rounded-md hover:bg-card/5 hover:border-primary/50 transition-colors"
                        >
                          {amount.toLocaleString()} XLM
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deadline" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    Deadline
                  </Label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.deadline}
                      onChange={(date) => {
                        setFormData({ ...formData, deadline: date })
                        setErrors(prev => ({ ...prev, deadline: "" }))
                      }}
                      dateFormat="MM/dd/yyyy HH:mm"
                      locale="en"
                      minDate={new Date()}
                      showTimeSelect
                      timeIntervals={15}
                      timeFormat="HH:mm"
                      placeholderText="Select date and time"
                      className={`w-full bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer ${errors.deadline ? 'border-red-500' : ''}`}
                      calendarClassName="bg-card dark:bg-card-dark border border-border dark:border-border-dark text-text dark:text-text-dark rounded-lg shadow-lg"
                      wrapperClassName="w-full"
                      showPopperArrow={false}
                      popperClassName="react-datepicker-popper"
                    />
                    {errors.deadline && (
                      <p className="text-sm text-red-500">{errors.deadline}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-primary" />
                    Project Image
                  </Label>
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <label
                            htmlFor="image"
                            className="cursor-pointer px-4 py-2 bg-primary/80 hover:bg-primary rounded-md transition-colors"
                          >
                            Change
                          </label>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-md transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-border dark:border-border-dark hover:border-primary/50 transition-colors cursor-pointer bg-card dark:bg-card-dark"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <svg
                            className="w-8 h-8 mb-2 text-text dark:text-text-dark/60"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 20 16"
                          >
                            <path
                              stroke="currentColor"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                            />
                          </svg>
                          <p className="mb-1 text-sm text-text dark:text-text-dark/60">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-text dark:text-text-dark/60">PNG, JPG or JPEG (MAX. 5MB)</p>
                        </div>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Project...
                    </>
                  ) : (
                    'Create Project'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </main>

      <style jsx global>{`
        .react-datepicker {
          font-family: inherit;
          background-color: rgba(0, 0, 0, 0.9) !important;
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 0.5rem;
          color: white !important;
        }
        .react-datepicker__header {
          background-color: rgba(0, 0, 0, 0.5) !important;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker__day {
          color: white !important;
        }
        .react-datepicker__day:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .react-datepicker__day--selected,
        .react-datepicker__day--keyboard-selected {
          background-color: #7c3aed !important;
          color: white !important;
        }
        .react-datepicker__day--disabled {
          color: rgba(255, 255, 255, 0.3) !important;
        }
        .react-datepicker__navigation-icon::before {
          border-color: white !important;
        }
        .react-datepicker__navigation:hover *::before {
          border-color: #7c3aed !important;
        }
        .react-datepicker-popper {
          z-index: 50;
        }
        /* Estilos para el selector de hora */
        .react-datepicker__time-container {
          background-color: rgba(0, 0, 0, 0.9) !important;
          border-left: 1px solid rgba(255, 255, 255, 0.1) !important;
        }
        .react-datepicker__time-box {
          background-color: rgba(0, 0, 0, 0.9) !important;
        }
        .react-datepicker__time-list-item {
          color: white !important;
        }
        .react-datepicker__time-list-item:hover {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .react-datepicker__time-list-item--selected {
          background-color: #7c3aed !important;
          color: white !important;
        }
      `}</style>
    </div>
  )
} 