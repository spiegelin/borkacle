"use client"

import { useState, useEffect } from "react"
import { Plus, Search, Filter, ArrowUpDown, MoreHorizontal, AlertCircle, CheckCircle2, Clock, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/ui/CreateTaskDialog"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { SprintDetail } from "@/components/project/SprintDetail"
import { TaskDetail } from "@/components/project/TaskDetail"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Sprint {
  id: string
  name: string
  startDate: string
  endDate: string
  status: "active" | "completed" | "planned"
}

interface SprintWithTasks extends Sprint {
  tasks: Task[]
}

export function Backlog() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [selectedSprintId, setSelectedSprintId] = useState<string | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [shouldRefresh, setShouldRefresh] = useState(false)
  const [loadingDetail, setLoadingDetail] = useState(false)

  useEffect(() => {
    fetchTasks()
  }, [])

  useEffect(() => {
    if (shouldRefresh) {
      fetchTasks()
      setShouldRefresh(false)
    }
  }, [shouldRefresh])

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) {
      return new Date().toISOString().split('T')[0]
    }
    try {
      return new Date(dateString).toISOString().split('T')[0]
    } catch (err) {
      console.warn('Invalid date format:', dateString)
      return new Date().toISOString().split('T')[0]
    }
  }

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get('/api/tasks')
      const data = response.data
      
      console.log('API Response:', data)
      
      const allTasks: Task[] = data.map((task: any) => ({
        id: String(task.id),
        title: task.titulo,
        type: 'task', // Por defecto, ya que no viene en la API
        priority: mapPriorityFromText(task.prioridad),
        status: mapStatusFromText(task.estado),
        description: task.descripcion || '',
        descripcion: task.descripcion || '',
        assignee: task.asignadoA ? {
          name: task.asignadoA,
          initials: getInitials(task.asignadoA)
        } : undefined,
        created: formatDate(task.fechaCreacion),
        updated: formatDate(task.fechaCreacion) // Usando fechaCreacion como updated ya que no viene en la API
      }))
      
      console.log('Mapped tasks:', allTasks)
      setTasks(allTasks)
    } catch (err) {
      console.error("Error fetching tasks:", err)
      setError("Error al cargar las tareas. Por favor, intente nuevamente.")
    } finally {
      setLoading(false)
    }
  }

  const mapPriorityFromText = (prioridad: string): TaskPriority => {
    switch (prioridad?.toLowerCase()) {
      case 'crítica':
        return 'highest'
      case 'alta':
        return 'high'
      case 'media':
        return 'medium'
      case 'baja':
        return 'low'
      case 'trivial':
        return 'lowest'
      default:
        return 'medium'
    }
  }

  const mapStatusFromText = (estado: string): TaskStatus => {
    switch (estado?.toLowerCase()) {
      case 'en proceso':
        return 'inProgress'
      case 'completado':
        return 'done'
      case 'pendiente':
        return 'todo'
      case 'en revisión':
        return 'review'
      case 'bloqueado':
        return 'blocked'
      case 'cancelado':
        return 'cancelled'
      default:
        return 'todo'
    }
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  const handleRowClick = async (taskId: string) => {
    setLoadingDetail(true)
    try {
      const response = await api.get(`/api/tasks/${taskId}`);
      const data = response.data;
      setSelectedTask({
        ...data,
        id: String(data.id),
        title: data.titulo,
        type: 'task',
        priority: mapPriorityFromText(data.prioridad),
        status: mapStatusFromText(data.estado),
        description: data.descripcion || '',
        descripcion: data.descripcion || '',
        assignee: data.asignadoA ? {
          name: data.asignadoA,
          initials: getInitials(data.asignadoA)
        } : undefined,
        created: formatDate(data.fechaCreacion),
        updated: formatDate(data.fechaActualizacion)
      });
    } catch (err) {
      console.error('Error fetching task detail:', err);
    } finally {
      setLoadingDetail(false)
    }
  }

  const handleCreateTask = async (newTask: Task) => {
    try {
      // Transform the task to match your API's expected format
      const taskData = {
        titulo: newTask.title,
        descripcion: newTask.description,
        tipo: newTask.type.toUpperCase(),
        prioridadId: getPriorityId(newTask.priority),
        estadoId: getStatusId(newTask.status),
        // Add other required fields based on your API
      }

      const response = await api.post('/api/tareas', taskData)
      
      // Add the created task to the list
      const createdTask = {
        ...newTask,
        id: response.data.id.toString(),
        created: new Date().toISOString().split('T')[0],
        updated: new Date().toISOString().split('T')[0]
      }
      
      setTasks([createdTask, ...tasks])
    } catch (err) {
      console.error("Error creating task:", err)
      setError("Failed to create task. Please try again.")
    }
  }

  const getPriorityId = (priority: Task["priority"]): number => {
    switch (priority) {
      case "highest": return 1
      case "high": return 2
      case "medium": return 3
      case "low": return 4
      case "lowest": return 5
      default: return 3
    }
  }

  const getStatusId = (status: Task["status"]): number => {
    switch (status) {
      case "todo": return 1
      case "inProgress": return 2
      case "review": return 3
      case "done": return 4
      default: return 1
    }
  }

  const getTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "bug":
        return <AlertCircle className="h-4 w-4 text-[#C74634]" />
      case "task":
        return <CheckCircle2 className="h-4 w-4 text-[#3A3A3A]" />
      case "story":
        return <Clock className="h-4 w-4 text-[#707070]" />
      case "epic":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-layers text-[#C74634]"
          >
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.5" />
            <path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.5" />
          </svg>
        )
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "highest":
        return "bg-red-100 text-[#C74634]"
      case "high":
        return "bg-orange-100 text-[#b03d2e]"
      case "medium":
        return "bg-yellow-100 text-[#D9A600]"
      case "low":
        return "bg-gray-100 text-[#707070]"
      case "lowest":
        return "bg-gray-100 text-[#3A3A3A]"
    }
  }

  const getStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-[#3A3A3A]"
      case "inProgress":
        return "bg-orange-100 text-[#C74634]"
      case "review":
        return "bg-gray-200 text-[#707070]"
      case "done":
        return "bg-green-100 text-green-700"
    }
  }

  const getStatusText = (status: Task["status"]): string => {
    switch (status) {
      case "todo":
        return "Pendiente"
      case "inProgress":
        return "En progreso"
      case "review":
        return "En revisión"
      case "done":
        return "Completado"
      default:
        return status
    }
  }

  const getPriorityText = (priority: Task["priority"]): string => {
    switch (priority) {
      case "highest":
        return "Máxima"
      case "high":
        return "Alta"
      case "medium":
        return "Media"
      case "low":
        return "Baja"
      case "lowest":
        return "Mínima"
      default:
        return priority
    }
  }

  const getTypeText = (type: Task["type"]): string => {
    switch (type) {
      case "bug":
        return "Error"
      case "task":
        return "Tarea"
      case "story":
        return "Historia"
      case "epic":
        return "Épica"
      default:
        return type
    }
  }

  const handleBackFromTaskDetail = () => {
    setSelectedTask(null)
    setShouldRefresh(true)
  }

  if (selectedTask) {
    if (loadingDetail) {
      return (
        <div className="flex flex-col items-center justify-center h-96">
          <Loader2 className="h-8 w-8 animate-spin text-[#C74634] mb-2" />
          <span className="text-gray-500">Cargando detalle de la tarea...</span>
        </div>
      )
    }
    return (
      <TaskDetail
        task={selectedTask}
        onBack={handleBackFromTaskDetail}
      />
    )
  }

  if (selectedSprintId) {
    return (
      <SprintDetail
        sprintId={selectedSprintId}
        onBack={() => setSelectedSprintId(null)}
      />
    )
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#3A3A3A]">Backlog</h1>
            <p className="text-gray-500">Cargando tareas...</p>
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
            <h1 className="text-2xl font-bold text-[#3A3A3A]">Backlog</h1>
            <p className="text-red-500">Error al cargar las tareas. Por favor, intente nuevamente.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Backlog</h1>
          <p className="text-gray-500">Migración a la Nube Empresarial</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Buscar tareas..."
              className="w-[200px]"
              type="search"
            />
            <Button variant="outline" className="border-gray-200">
              <Filter className="h-4 w-4 mr-1" /> Filtrar
            </Button>
            <Button 
              className="bg-[#C74634] hover:bg-[#b03d2e]"
              onClick={() => setCreateTaskOpen(true)}
            >
              <Plus className="h-4 w-4 mr-1" /> Crear
            </Button>
          </div>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Prioridad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Asignado a</TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Creado
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center gap-1">
                Actualizado
                <ArrowUpDown className="h-3 w-3" />
              </div>
            </TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => (
            <TableRow
              key={task.id}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(task.id)}
            >
              <TableCell className="font-medium">{task.id}</TableCell>
              <TableCell>{task.title}</TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  {getTypeIcon(task.type)}
                  <span className="text-sm">{getTypeText(task.type)}</span>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityText(task.priority)}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </Badge>
              </TableCell>
              <TableCell>
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {task.assignee.avatar && (
                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                      )}
                      <AvatarFallback className="text-[10px] bg-[#3A3A3A] text-white">
                        {task.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Sin asignar</span>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-500">{task.created}</TableCell>
              <TableCell className="text-sm text-gray-500">{task.updated}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <CreateTaskDialog 
        open={createTaskOpen} 
        onOpenChange={setCreateTaskOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}

