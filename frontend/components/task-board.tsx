"use client"

import { useEffect, useState } from "react"
import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"
import { 
  arrayMove,
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"
import { Plus, MoreHorizontal, AlertCircle, CheckCircle2, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { SortableTask } from "@/components/sortable-task"
import api from "@/lib/api"

interface Task {
  id: string
  title: string
  type: "bug" | "task" | "story" | "epic"
  priority: "highest" | "high" | "medium" | "low" | "lowest"
  status: "todo" | "inProgress" | "review" | "done" | "blocked" | "cancelled"
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

interface Columns {
  [key: string]: Column
}

// Mapeo de IDs de estado a nombres de columnas
const columnTitles = {
  todo: "Pendiente",
  inProgress: "En Proceso",
  review: "En Revisión",
  blocked: "Bloqueado",
  done: "Completado",
  cancelled: "Cancelado"
}

// Columnas por defecto en caso de error o para inicialización
const defaultColumns: Columns = {
  todo: {
    id: "todo",
    title: "Pendiente",
    tasks: [],
  },
  inProgress: {
    id: "inProgress",
    title: "En Proceso",
    tasks: [],
  },
  review: {
    id: "review",
    title: "En Revisión",
    tasks: [],
  },
  blocked: {
    id: "blocked",
    title: "Bloqueado",
    tasks: [],
  },
  done: {
    id: "done",
    title: "Completado",
    tasks: [],
  },
  cancelled: {
    id: "cancelled",
    title: "Cancelado",
    tasks: [],
  }
}

export function TaskBoard() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [columns, setColumns] = useState<Columns>(defaultColumns)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Cargar las tareas desde el backend
  useEffect(() => {
    fetchTareas()
  }, [])

  const fetchTareas = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await api.get('/api/tareas/board')
      const data = response.data
      
      if (data.columns) {
        // Convertir el formato del backend al formato que espera el componente
        const newColumns: Columns = {}
        
        // Inicializar las columnas con las predeterminadas
        Object.keys(defaultColumns).forEach(columnKey => {
          newColumns[columnKey] = {
            id: columnKey,
            title: columnTitles[columnKey as keyof typeof columnTitles],
            tasks: []
          }
        })
        
        // Llenar con los datos del backend
        Object.entries(data.columns).forEach(([columnKey, tasks]) => {
          if (newColumns[columnKey]) {
            newColumns[columnKey].tasks = tasks as Task[]
          }
        })
        
        setColumns(newColumns)
      }
    } catch (err) {
      console.error("Error al cargar las tareas:", err)
      setError("No se pudieron cargar las tareas. Por favor, intenta de nuevo más tarde.")
      // Usar las columnas por defecto en caso de error
      setColumns(defaultColumns)
    } finally {
      setLoading(false)
    }
  }

  // Recibe la nueva tarea y la agrega en la columna "todo"
  function handleCreateTask(newTask: Task) {
    const status = newTask.status || "todo"
    const columnCopy = { ...columns }
    columnCopy[status].tasks = [...columnCopy[status].tasks, newTask]
    setColumns(columnCopy)
  }

  // Mueve la tarea de columna al soltar
  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    
    if (!over) {
      return
    }

    const activeId = active.id as string
    const overId = over.id as string
    
    if (activeId === overId) {
      return
    }

    // Find which columns contain the dragged and target items
    let sourceColumnId = ""
    let destinationColumnId = ""
    let sourceIndex = -1
    let destinationIndex = -1
    
    Object.entries(columns).forEach(([columnId, column]) => {
      const activeIndex = column.tasks.findIndex((task: Task) => task.id === activeId)
      const overIndex = column.tasks.findIndex((task: Task) => task.id === overId)
      
      if (activeIndex !== -1) {
        sourceColumnId = columnId
        sourceIndex = activeIndex
      }
      
      if (overIndex !== -1) {
        destinationColumnId = columnId
        destinationIndex = overIndex
      }
    })
    
    if (sourceColumnId === "" || destinationColumnId === "") {
      return
    }

    // Create new columns object
    const newColumns = { ...columns }
    
    // Get the task being moved
    const sourceColumn = newColumns[sourceColumnId]
    const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1)
    
    // Update the task's status based on the destination column
    movedTask.status = destinationColumnId as Task["status"]
    
    // Insert the task into the destination column
    const destinationColumn = newColumns[destinationColumnId]
    destinationColumn.tasks.splice(destinationIndex, 0, movedTask)
    
    // Update state
    setColumns(newColumns)
    
    // Actualizar el estado en el backend
    try {
      // Extraer el ID de la tarea (quitar el prefijo 'ORA-')
      const taskId = movedTask.id.replace('ORA-', '');
      
      // Obtener el ID de estado correspondiente al status del frontend
      const estadoId = getEstadoIdFromStatus(destinationColumnId);
      
      // Llamar al endpoint para actualizar el estado
      await api.put(`/api/tareas/${taskId}/estado`, {
        estadoId: estadoId
      });
      
      console.log(`Tarea ${taskId} actualizada al estado ${estadoId} (${destinationColumnId})`);
    } catch (error) {
      console.error('Error al actualizar el estado de la tarea:', error);
      // Opcionalmente: mostrar un mensaje de error al usuario
      setError("No se pudo actualizar el estado de la tarea. Los cambios podrían no guardarse.");
      
      // También podrías deshacer el cambio visual si falla la actualización en el backend
      // setColumns(prevColumns);
    }
  }
  
  // Función auxiliar que podría usarse para convertir el status del frontend al ID de estado del backend
  const getEstadoIdFromStatus = (status: string): number => {
    switch (status) {
      case 'inProgress': return 1;
      case 'todo': return 3;
      case 'review': return 4;
      case 'blocked': return 5;
      case 'done': return 6;
      case 'cancelled': return 7;
      default: return 3; // Pendiente como valor predeterminado
    }
  }

  const getPriorityIcon = (priority: Task["priority"]) => {
    switch (priority) {
      case "highest":
        return <ArrowUpRight className="h-3 w-3 text-[#F80000]" />
      case "high":
        return <ArrowUpRight className="h-3 w-3 text-[#FF8B00]" />
      case "medium":
        return <ArrowUpRight className="h-3 w-3 text-[#FFAB00]" />
      case "low":
        return <ArrowUpRight className="h-3 w-3 rotate-180 text-[#00C7E6]" />
      case "lowest":
        return <ArrowUpRight className="h-3 w-3 rotate-180 text-[#0066FF]" />
    }
  }

  const getTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "bug":
        return <AlertCircle className="h-3 w-3 text-[#C74634]" />
      case "task":
        return <CheckCircle2 className="h-3 w-3 text-[#3A3A3A]" />
      case "story":
        return <Clock className="h-3 w-3 text-[#707070]" />
      case "epic":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="12"
            height="12"
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

  // Find the active task for the drag overlay
  const getActiveTask = (): Task | undefined => {
    if (!activeId) return undefined
    
    for (const column of Object.values(columns)) {
      const task = column.tasks.find((task: Task) => task.id === activeId)
      if (task) return task
    }
    
    return undefined
  }

  const activeTask = getActiveTask()

  return (
    <div className="container-fluid px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Board</h1>
        <Button onClick={() => setCreateTaskOpen(true)} className="inline-flex items-center">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-600">Cargando tareas...</span>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            onClick={fetchTareas}
          >
            Reintentar
          </button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={(event) => setActiveId(event.active.id as string)}
          onDragEnd={onDragEnd}
          onDragCancel={() => setActiveId(null)}
        >
          <div className="flex overflow-x-auto pb-6 gap-6" style={{ minHeight: "calc(100vh - 200px)" }}>
            {Object.values(columns).map((column) => (
              <Card key={column.id} className="bg-gray-50 flex-shrink-0" style={{ width: "320px" }}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-lg text-[#3A3A3A]">{column.title}</h2>
                    <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{column.tasks.length}</span>
                  </div>
                  <SortableContext
                    items={column.tasks.map((task: Task) => task.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2 min-h-[200px]">
                      {column.tasks.length === 0 ? (
                        <div className="text-gray-400 text-center py-4">
                          No hay tareas en esta columna
                        </div>
                      ) : (
                        column.tasks.map((task: Task) => (
                          <SortableTask 
                            key={task.id} 
                            task={task} 
                            getPriorityIcon={getPriorityIcon}
                            getTypeIcon={getTypeIcon}
                          />
                        ))
                      )}
                    </div>
                  </SortableContext>
                </CardContent>
              </Card>
            ))}
          </div>

          <DragOverlay>
            {activeId && activeTask && (
              <div className="bg-white p-3 rounded-lg shadow-lg">
                <div className="flex items-start gap-2">
                  <div className="flex items-center gap-1">
                    {getTypeIcon(activeTask.type)}
                    {getPriorityIcon(activeTask.priority)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3A3A3A] truncate">{activeTask.title}</p>
                    {activeTask.assignee && (
                      <div className="flex items-center gap-1 mt-1">
                        <Avatar className="h-5 w-5">
                          {activeTask.assignee.avatar && (
                            <AvatarImage src={activeTask.assignee.avatar} alt={activeTask.assignee.name} />
                          )}
                          <AvatarFallback>{activeTask.assignee.initials}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-gray-500">{activeTask.assignee.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </DragOverlay>
        </DndContext>
      )}

      <CreateTaskDialog open={createTaskOpen} onOpenChange={setCreateTaskOpen} onCreateTask={handleCreateTask} />
    </div>
  )
}
