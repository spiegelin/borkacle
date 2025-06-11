"use client"

import { useEffect, useState } from "react"
import { DndContext, DragOverlay, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent, useDroppable } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent } from "@/components/ui/card"
import { SortableTask } from "@/components/tasks/SortableTask"
import api from "@/lib/api"
import { defaultColumns, columnTitles } from "./TaskBoard"
import { Plus, MoreHorizontal, AlertCircle, CheckCircle2, Clock, ArrowUpRight } from "lucide-react"

interface SprintBoardProps {
  sprintId: string
  onBack: () => void
}

interface Task {
  id: string
  title: string
  type: "bug" | "task" | "story" | "epic"
  priority: "highest" | "high" | "medium" | "low" | "lowest"
  status: "todo" | "inProgress" | "review" | "done" | "blocked" | "cancelled"
  description?: string
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

export function SprintBoard({ sprintId, onBack }: SprintBoardProps) {
  const [columns, setColumns] = useState<Columns>(defaultColumns)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  useEffect(() => {
    fetchSprintTasks()
    // eslint-disable-next-line
  }, [sprintId])

  const fetchSprintTasks = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/api/sprints/${sprintId}`)
      const sprint = response.data
      console.log('Sprint data:', sprint) // Debug log
      
      // Inicializar las columnas con defaultColumns
      let newColumns: Columns = { ...defaultColumns }
      
      // Mapear las columnas del backend a las columnas del frontend
      if (sprint.columns) {
        Object.entries(sprint.columns).forEach(([columnKey, tasks]) => {
          if (newColumns[columnKey]) {
            newColumns[columnKey].tasks = tasks as Task[]
          }
        })
      }
      
      console.log('Mapped columns:', newColumns) // Debug log
      setColumns(newColumns)
    } catch (err) {
      console.error("Error fetching sprint tasks:", err)
      setError("No se pudieron cargar las tareas del sprint.")
      setColumns(defaultColumns)
    } finally {
      setLoading(false)
    }
  }

  const mapTaskType = (tipo: string): Task["type"] => {
    switch (tipo?.toLowerCase()) {
      case 'bug': return 'bug'
      case 'story': return 'story'
      case 'epic': return 'epic'
      default: return 'task'
    }
  }

  const mapPriority = (prioridadId: number): Task["priority"] => {
    switch (prioridadId) {
      case 1: return 'highest'
      case 2: return 'high'
      case 3: return 'medium'
      case 4: return 'low'
      case 5: return 'lowest'
      default: return 'medium'
    }
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
  }

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return
    const activeId = active.id as string
    const overId = over.id as string
    if (activeId === overId) return

    let sourceColumnId = ""
    let destinationColumnId = ""
    let sourceIndex = -1
    let destinationIndex = -1
    Object.entries(columns).forEach(([columnId, column]) => {
      const activeIndex = column.tasks.findIndex((task: Task) => task.id === activeId)
      if (activeIndex !== -1) {
        sourceColumnId = columnId
        sourceIndex = activeIndex
      }
      if (overId === columnId) {
        destinationColumnId = columnId
        destinationIndex = column.tasks.length
      } else {
        const overIndex = column.tasks.findIndex((task: Task) => task.id === overId)
          if (overIndex !== -1) {
          destinationColumnId = columnId
          destinationIndex = overIndex
          }
      }
    })
    if (sourceColumnId === "" || destinationColumnId === "") return
    const newColumns = { ...columns }
    const sourceColumn = newColumns[sourceColumnId as keyof Columns]
    const [movedTask] = sourceColumn.tasks.splice(sourceIndex, 1)
    movedTask.status = destinationColumnId as Task["status"]
    const destinationColumn = newColumns[destinationColumnId as keyof Columns]
    destinationColumn.tasks.splice(destinationIndex, 0, movedTask)
    setColumns(newColumns)
    // Actualizar el estado en el backend igual que en TaskBoard
    try {
      const taskId = movedTask.id;
      const estadoId = getEstadoIdFromStatus(destinationColumnId);
      await api.put(`/api/tareas/${taskId}/estado`, { estadoId });
      // Opcional: recargar tareas del sprint para mantener sincronizado
      // await fetchSprintTasks();
    } catch (error) {
      setError("No se pudo actualizar el estado de la tarea. Los cambios podrían no guardarse.")
    }
  }

  const getEstadoIdFromStatus = (status: string): number => {
    switch (status) {
      case 'inProgress': return 1;
      case 'todo': return 3;
      case 'review': return 4;
      case 'blocked': return 5;
      case 'done': return 6;
      case 'cancelled': return 7;
      default: return 3;
    }
  }

  const getActiveTask = (): Task | undefined => {
    if (!activeId) return undefined
    for (const column of Object.values(columns)) {
      const task = column.tasks.find((task: Task) => task.id === activeId)
      if (task) return task
    }
    return undefined
  }
  const activeTask = getActiveTask()

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

  return (
    <div className="container-fluid px-4 py-6">
      <button onClick={onBack} className="mb-4 text-blue-600 hover:underline">&larr; Volver a Sprints</button>
      <h1 className="text-2xl font-semibold mb-6">Sprint Board</h1>
      {loading ? (
        <div>Cargando tareas...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
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
                    <DroppableColumn columnId={column.id}>
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
                    </DroppableColumn>
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        </div>
        <DragOverlay>
            {activeId && activeTask && (
              <div className="bg-white p-3 rounded-lg shadow-lg">
              <div className="flex items-start gap-2">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#3A3A3A] truncate">{activeTask.title}</p>
                    </div>
                </div>
              </div>
            )}
        </DragOverlay>
      </DndContext>
      )}
    </div>
  )
}

function DroppableColumn({ columnId, children }: { columnId: string, children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({ id: columnId })
  return <div ref={setNodeRef}>{children}</div>
}

