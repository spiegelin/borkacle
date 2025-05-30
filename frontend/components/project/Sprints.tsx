"use client"

import { useState, useEffect } from "react"
import { Plus, ChevronDown, ChevronRight, Calendar, Clock, CheckCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CreateSprintDialog } from "@/components/ui/CreateSprintDialog"
import { SprintBoard } from "@/components/project/SprintBoard"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import api from "@/lib/api"
import { Badge } from "@/components/ui/badge"

interface Sprint {
  id: string
  nombre: string
  estado: string
  fechaInicio: string
  fechaFin: string
  tasks: {
    total: number
    completed: number
    inProgress: number
    todo: number
  }
}

export function Sprints() {
  const [createSprintOpen, setCreateSprintOpen] = useState(false)
  const [openSprints, setOpenSprints] = useState<string[]>([])
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)
  const [sprints, setSprints] = useState<Sprint[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchSprints()
  }, [])

  const fetchSprints = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/sprints')
      const data = response.data
      
      // Transform the data to match our Sprint interface
      const transformedSprints = data.map((sprint: any) => {
        // Log the raw sprint data for debugging
        console.log('Raw sprint data:', sprint)
        
        const tasks = sprint.tasks || []
        const completedTasks = tasks.filter((t: any) => t.estado === 'Completado').length
        const inProgressTasks = tasks.filter((t: any) => t.estado === 'En Proceso').length
        const todoTasks = tasks.filter((t: any) => t.estado === 'Pendiente').length
        
        // Log the task counts for debugging
        console.log(`Sprint ${sprint.id} task counts:`, {
          total: tasks.length,
          completed: completedTasks,
          inProgress: inProgressTasks,
          todo: todoTasks,
          tasks: tasks.map((t: any) => ({ id: t.id, titulo: t.titulo, estado: t.estado }))
        })
        
        return {
          id: sprint.id.toString(),
          nombre: sprint.nombre,
          estado: sprint.estado,
          fechaInicio: sprint.fechaInicio,
          fechaFin: sprint.fechaFin,
          tasks: {
            total: tasks.length,
            completed: completedTasks,
            inProgress: inProgressTasks,
            todo: todoTasks
          }
        }
      })
      
      setSprints(transformedSprints)
    } catch (err) {
      console.error("Error fetching sprints:", err)
      setError("Failed to load sprints. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const toggleSprint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent other click handlers
    setOpenSprints((prev) => (prev.includes(id) ? prev.filter((sprintId) => sprintId !== id) : [...prev, id]))
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700"
      case "planned":
        return "bg-gray-100 text-[#3A3A3A]"
      case "completed":
        return "bg-gray-200 text-[#707070]"
      default:
        return "bg-gray-100 text-[#3A3A3A]"
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3A3A3A]">Sprints</h1>
            <p className="text-gray-500">Loading sprints...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3A3A3A]">Sprints</h1>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Sprints</h1>
          <p className="text-gray-500">Manage your project sprints</p>
        </div>
        <Button 
          className="bg-[#C74634] hover:bg-[#b03d2e]"
          onClick={() => setCreateSprintOpen(true)}
        >
          <Plus className="h-4 w-4 mr-1" /> Create Sprint
        </Button>
      </div>

      {selectedSprint ? (
        <SprintBoard
          sprintId={selectedSprint.id}
          onBack={() => setSelectedSprint(null)}
        />
      ) : (
        <div className="space-y-4">
          {sprints
            .sort((a, b) => {
              if (a.estado.toLowerCase() === "active") return -1
              if (b.estado.toLowerCase() === "active") return 1
              if (a.estado.toLowerCase() === "planned" && b.estado.toLowerCase() === "completed") return -1
              if (a.estado.toLowerCase() === "completed" && b.estado.toLowerCase() === "planned") return 1
              return 0
            })
            .map((sprint) => (
              <Card key={sprint.id} className="cursor-pointer hover:bg-gray-50">
                <CardHeader className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Collapsible open={openSprints.includes(sprint.id)}>
                        <CollapsibleTrigger
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleSprint(sprint.id, e)
                          }}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          {openSprints.includes(sprint.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent 
                            className="p-4 pt-0"
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                            }}
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Total Tasks</p>
                                  <p className="font-medium">{sprint.tasks.total}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <div>
                                  <p className="text-sm text-gray-500">Completed</p>
                                  <p className="font-medium">{sprint.tasks.completed}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-orange-500" />
                                <div>
                                  <p className="text-sm text-gray-500">In Progress</p>
                                  <p className="font-medium">{sprint.tasks.inProgress}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                  <p className="text-sm text-gray-500">To Do</p>
                                  <p className="font-medium">{sprint.tasks.todo}</p>
                                </div>
                              </div>
                            </div>
                            <div className="mt-4 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Progress</span>
                                <span>
                                  {sprint.tasks.total > 0
                                    ? Math.round((sprint.tasks.completed / sprint.tasks.total) * 100)
                                    : 0}%
                                </span>
                              </div>
                              <Progress
                                value={
                                  sprint.tasks.total > 0
                                    ? (sprint.tasks.completed / sprint.tasks.total) * 100
                                    : 0
                                }
                                className="h-2"
                              />
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Collapsible>
                      <div 
                        className="flex-1 cursor-pointer" 
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          setSelectedSprint(sprint)
                        }}
                      >
                        <CardTitle className="text-lg">{sprint.nombre}</CardTitle>
                        <div className="flex items-center gap-4 mt-1">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {new Date(sprint.fechaInicio).toLocaleDateString()} - {new Date(sprint.fechaFin).toLocaleDateString()}
                            </span>
                          </div>
                          <Badge className={getStatusColor(sprint.estado)}>
                            {sprint.estado}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem 
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setSelectedSprint(sprint)
                          }}
                        >
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
              </Card>
            ))}
        </div>
      )}

      <CreateSprintDialog
        open={createSprintOpen}
        setOpen={setCreateSprintOpen}
        onCreateSprint={async (newSprint: { name: string; startDate: Date; endDate: Date }) => {
          try {
            const response = await api.post('/api/sprints', {
              nombre: newSprint.name,
              fechaInicio: newSprint.startDate,
              fechaFin: newSprint.endDate
            })
            await fetchSprints() // Refresh the list
            setCreateSprintOpen(false)
          } catch (err) {
            console.error("Error creating sprint:", err)
            // Handle error appropriately
          }
        }}
      />
    </div>
  )
}

