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
import { es } from "date-fns/locale"
import "react-datepicker/dist/react-datepicker.css"
import { walletKit } from "../wallets/walletsKit"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { createProject } from "../services/projectService"

// Registrar el idioma español
registerLocale("es", es)

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
      // Validar el tipo de archivo
      if (!file.type.startsWith('image/')) {
        toast.error("Tipo de archivo no válido", {
          description: "Por favor, seleccione una imagen (PNG, JPG, JPEG)",
        })
        return
      }
      
      // Validar el tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Archivo muy grande", {
          description: "La imagen debe ser menor a 5MB",
        })
        return
      }

      try {
        // Convertir la imagen a Base64
        const reader = new FileReader()
        reader.onloadend = () => {
          const base64String = reader.result as string
          setFormData(prev => ({ ...prev, imageBase64: base64String }))
          setImagePreview(base64String)
        }
        reader.readAsDataURL(file)
      } catch (error) {
        console.error('Error al convertir la imagen:', error)
        toast.error("Error al procesar la imagen", {
          description: "Por favor, intente con otra imagen",
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
      newErrors.projectId = "El ID del proyecto es requerido"
    }

    if (!formData.creator) {
      newErrors.creator = "Debe conectar su wallet"
    }

    if (!formData.goal || Number(formData.goal) <= 0) {
      newErrors.goal = "La meta debe ser mayor a 0 XLM"
    }

    if (!formData.deadline) {
      newErrors.deadline = "La fecha límite es requerida"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          projectId: formData.projectId,
          creator: formData.creator,
          goal: formData.goal,
          deadline: formData.deadline?.toISOString() || '',
          imageBase64: formData.imageBase64,
          description: formData.description,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al crear el proyecto');
      }

      const data = await response.json();

      toast.success("¡Proyecto creado exitosamente!", {
        description: `El proyecto ${formData.projectId} ha sido creado con una meta de ${formData.goal} XLM.`,
        duration: 5000,
      });

      // Limpiar el formulario
      setFormData({
        projectId: "",
        creator: localStorage.getItem('walletAddress') || "",
        goal: "",
        deadline: null,
        imageBase64: null,
        description: "",
      });
      setImagePreview(null);

    } catch (error) {
      console.error("Error al crear el proyecto:", error);
      toast.error("Error al crear el proyecto", {
        description: error instanceof Error ? error.message : "Por favor, intente nuevamente más tarde.",
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
    <div className="min-h-screen bg-black text-white">
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
              Crear Proyecto
            </Badge>
            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              Inicia tu Proyecto en Stellar
            </h1>
            <p className="text-white/70">
              Complete los detalles del proyecto para comenzar su viaje de financiamiento
            </p>
          </div>

          <Card className="bg-black/50 backdrop-blur-md border-white/10">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="projectId" className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    ID del Proyecto
                  </Label>
                  <Input
                    id="projectId"
                    name="projectId"
                    value={formData.projectId}
                    onChange={handleInputChange}
                    required
                    className={`bg-black/30 border-white/10 text-white ${errors.projectId ? 'border-red-500' : ''}`}
                    placeholder="Ingrese el ID único del proyecto"
                  />
                  {errors.projectId && (
                    <p className="text-sm text-red-500">{errors.projectId}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creator" className="flex items-center gap-2">
                    <User className="h-4 w-4 text-primary" />
                    Creador (Wallet)
                  </Label>
                  <Input
                    id="creator"
                    name="creator"
                    value={formData.creator}
                    readOnly
                    className={`bg-black/30 border-white/10 text-white cursor-not-allowed opacity-70 ${errors.creator ? 'border-red-500' : ''}`}
                    placeholder="Conecte su wallet para continuar"
                  />
                  {errors.creator && (
                    <p className="text-sm text-red-500">{errors.creator}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descripción del Proyecto</Label>
                  <textarea
                    id="description"
                    name="description"
                    placeholder="Describe tu proyecto en detalle..."
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    className="w-full min-h-[150px] rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-white placeholder:text-white/60 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goal" className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-primary" />
                    Meta (XLM)
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
                      className={`bg-black/30 border-white/10 text-white ${errors.goal ? 'border-red-500' : ''}`}
                      placeholder="Ingrese la cantidad objetivo en XLM"
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
                          className="px-3 py-1 text-sm bg-black/30 border border-white/10 rounded-md hover:bg-white/5 hover:border-primary/50 transition-colors"
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
                    Fecha Límite
                  </Label>
                  <div className="relative">
                    <DatePicker
                      selected={formData.deadline}
                      onChange={(date) => {
                        setFormData({ ...formData, deadline: date })
                        setErrors(prev => ({ ...prev, deadline: "" }))
                      }}
                      dateFormat="dd/MM/yyyy HH:mm"
                      locale="es"
                      minDate={new Date()}
                      showTimeSelect
                      timeIntervals={15}
                      timeFormat="HH:mm"
                      placeholderText="Seleccione fecha y hora"
                      className={`w-full bg-black/30 border border-white/10 text-white rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer ${errors.deadline ? 'border-red-500' : ''}`}
                      calendarClassName="bg-black/90 border border-white/10 text-white rounded-lg shadow-lg"
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
                    Imagen del Proyecto
                  </Label>
                  <div className="relative">
                    {imagePreview ? (
                      <div className="relative w-full aspect-video rounded-lg overflow-hidden group">
                        <img
                          src={imagePreview}
                          alt="Vista previa"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                          <label
                            htmlFor="image"
                            className="cursor-pointer px-4 py-2 bg-primary/80 hover:bg-primary rounded-md transition-colors"
                          >
                            Cambiar
                          </label>
                          <button
                            type="button"
                            onClick={removeImage}
                            className="px-4 py-2 bg-red-500/80 hover:bg-red-500 rounded-md transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    ) : (
                      <label
                        htmlFor="image"
                        className="flex flex-col items-center justify-center w-full aspect-video rounded-lg border-2 border-dashed border-white/10 hover:border-primary/50 transition-colors cursor-pointer bg-black/30"
                      >
                        <ImageIcon className="h-12 w-12 text-white/40 mb-2" />
                        <span className="text-white/60">
                          Haga clic para subir una imagen
                        </span>
                        <span className="text-white/40 text-sm">
                          PNG, JPG o JPEG (máx. 5MB)
                        </span>
                      </label>
                    )}
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    {errors.image && (
                      <p className="text-sm text-red-500 mt-2">{errors.image}</p>
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
                      Creando Proyecto...
                    </>
                  ) : (
                    'Crear Proyecto'
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