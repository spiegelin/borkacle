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

interface Task {
  id: string
  title: string
  type: "bug" | "task" | "story" | "epic"
  priority: "highest" | "high" | "medium" | "low" | "lowest"
  status: "todo" | "inProgress" | "review" | "done"
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

const defaultColumns: Columns = {
  todo: {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "ORA-2345", title: "Initial prototype for each microservice", type: "task", priority: "high", status: "todo" },
      {
        id: "ORA-2346",
        title: "Resource Planning",
        type: "story",
        priority: "low",
        status: "todo",
        assignee: { name: "John Doe", initials: "JD" },
      },
      { id: "ORA-2347", title: "Requirements Elicitation", type: "task", priority: "high", status: "todo" },
    ],
  },
  inProgress: {
    id: "inProgress",
    title: "In Progress",
    tasks: [
      {
        id: "ORA-2348",
        title: "Stack Design",
        type: "task",
        priority: "high",
        status: "inProgress",
        assignee: { name: "Sarah Lee", initials: "SL" },
      },
    ],
  },
  review: {
    id: "review",
    title: "Review",
    tasks: [
      {
        id: "ORA-2350",
        title: "Backend Development",
        type: "task",
        priority: "highest",
        status: "review",
      },
      {
        id: "ORA-2351",
        title: "Design of frontend routes",
        type: "story",
        priority: "high",
        status: "review",
        assignee: { name: "Mike Chen", initials: "MC" },
      },
    ],
  },
  done: {
    id: "done",
    title: "Done",
    tasks: [
      {
        id: "ORA-2352",
        title: "UI/UX Design",
        type: "task",
        priority: "medium",
        status: "done",
        assignee: { name: "John Doe", initials: "JD" },
      },
      { id: "ORA-2353", title: "Requirements gathering", type: "story", priority: "high", status: "done" },
    ],
  },
}

export function TaskBoard() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [columns, setColumns] = useState<Columns>({})
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Carga desde localStorage o establece columns por defecto
  useEffect(() => {
    const storedColumns = localStorage.getItem("columns")
    if (storedColumns) {
      setColumns(JSON.parse(storedColumns))
    } else {
      setColumns(defaultColumns)
    }
  }, [])

  // Guarda automáticamente cada vez que cambien las columnas
  useEffect(() => {
    if (Object.keys(columns).length > 0) {
      localStorage.setItem("columns", JSON.stringify(columns))
    }
  }, [columns])

  // Recibe la nueva tarea y la agrega en la columna "todo"
  function handleCreateTask(newTask: Task) {
    const status = newTask.status || "todo"
    const columnCopy = { ...columns }
    columnCopy[status].tasks = [...columnCopy[status].tasks, newTask]
    setColumns(columnCopy)
  }

  // Mueve la tarea de columna al soltar
  const onDragEnd = (event: DragEndEvent) => {
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Task Board</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-200">
            Filter
          </Button>
          <Button 
            className="bg-[#C74634] hover:bg-[#b03d2e]"
            onClick={() => setCreateTaskOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add Task
          </Button>
        </div>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(event.active.id as string)}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(columns).map((column) => (
            <Card key={column.id} className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-[#3A3A3A]">{column.title}</h2>
                  <span className="text-sm text-gray-500">{column.tasks.length}</span>
                </div>
                <SortableContext
                  items={column.tasks.map((task: Task) => task.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2 min-h-[200px]">
                    {column.tasks.map((task: Task) => (
                      <SortableTask 
                        key={task.id} 
                        task={task} 
                        getPriorityIcon={getPriorityIcon}
                        getTypeIcon={getTypeIcon}
                      />
                    ))}
                  </div>
                </SortableContext>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white p-3 rounded-lg shadow-md">
              <div className="flex items-start gap-2">
                <div className="flex items-center gap-1">
                  {getTypeIcon(activeTask.type)}
                  {getPriorityIcon(activeTask.priority)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#3A3A3A] truncate">
                    {activeTask.title}
                  </p>
                  {activeTask.assignee && (
                    <div className="flex items-center gap-1 mt-1">
                      <Avatar className="h-5 w-5">
                        {activeTask.assignee.avatar && (
                          <AvatarImage 
                            src={activeTask.assignee.avatar} 
                            alt={activeTask.assignee.name} 
                          />
                        )}
                        <AvatarFallback>
                          {activeTask.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-xs text-gray-500">
                        {activeTask.assignee.name}
                      </span>
                    </div>
                  )}
                </div>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <CreateTaskDialog 
        open={createTaskOpen} 
        onOpenChange={setCreateTaskOpen}
        onCreateTask={handleCreateTask}
      />
    </div>
  )
}
