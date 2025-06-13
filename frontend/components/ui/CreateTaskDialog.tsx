"use client"

import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import api from "@/lib/api"
import type { Task, TaskType, TaskPriority, TaskStatus } from "@/types/task"

interface User {
  id: string
  nombre: string
  email: string
  avatar?: string
}

interface Priority {
  id: number
  nombre: string
  valor: TaskPriority
}

interface CreateTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateTask: (task: Task) => void
  sprintId?: string
}

const staticPriorities: Priority[] = [
  { id: 3, nombre: "Crítica", valor: "highest" as TaskPriority },
  { id: 4, nombre: "Media", valor: "medium" as TaskPriority },
  { id: 5, nombre: "Baja", valor: "low" as TaskPriority },
  { id: 6, nombre: "Trivial", valor: "lowest" as TaskPriority },
  { id: 1, nombre: "Alta", valor: "high" as TaskPriority }
];

export function CreateTaskDialog({ open, onOpenChange, onCreateTask, sprintId }: CreateTaskDialogProps) {
  const [taskType, setTaskType] = useState<TaskType>("task")
  const [priority, setPriority] = useState<TaskPriority>("medium")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [priorities, setPriorities] = useState<Priority[]>([])

  const getPriorityId = (priority: TaskPriority): number => {
    switch (priority) {
      case "highest": return 1
      case "high": return 2
      case "medium": return 3
      case "low": return 4
      case "lowest": return 5
      default: return 3
    }
  }

  useEffect(() => {
    setPriorities(staticPriorities);
    setIsLoading(false);
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const selectedPriority = priorities.find(p => p.valor === priority)

      const taskData = {
        titulo: taskTitle,
        descripcion: taskDescription,
        tiempoEstimado: 1, // default value
        proyectoId: 10, // fixed project id
        prioridadId: selectedPriority?.id || 3 // Default to medium priority
      }

      const response = await api.post('/api/tasks', taskData)
      const newTask: Task = {
        id: response.data.id,
        title: response.data.titulo,
        type: taskType,
        priority: priority,
        status: 'todo' as TaskStatus,
        description: response.data.descripcion,
        assignee: undefined,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
      }
      onCreateTask(newTask)
      onOpenChange(false)
      resetForm()
    } catch (err) {
      console.error('Error creating task:', err)
      setError('Error creating task. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setTaskTitle("")
    setTaskDescription("")
    setTaskType("task")
    setPriority("medium")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Tarea</DialogTitle>
          <DialogDescription>
            Agregar una nueva tarea al proyecto. Complete los detalles a continuación.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="col-span-3"
                placeholder="Ingrese el título de la tarea"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Tipo
              </Label>
              <Select 
                value={taskType} 
                onValueChange={(value: TaskType) => setTaskType(value)}
                defaultValue="task"
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione el tipo de tarea" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="task">Tarea</SelectItem>
                  <SelectItem value="bug">Error</SelectItem>
                  <SelectItem value="story">Historia</SelectItem>
                  <SelectItem value="epic">Épica</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priority" className="text-right">
                Prioridad
              </Label>
              <Select 
                value={priority} 
                onValueChange={(value: TaskPriority) => setPriority(value)}
                defaultValue="medium"
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Seleccione la prioridad" />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority.id} value={priority.valor}>
                      {priority.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                value={taskDescription}
                onChange={(e) => setTaskDescription(e.target.value)}
                className="col-span-3"
                placeholder="Ingrese la descripción de la tarea"
              />
            </div>
          </div>
          {error && <div className="text-red-500 mb-4">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-[#C74634] hover:bg-[#b03d2e]"
              disabled={isSubmitting || !taskTitle.trim() || isLoading}
            >
              {isSubmitting ? 'Creando...' : 'Crear Tarea'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
