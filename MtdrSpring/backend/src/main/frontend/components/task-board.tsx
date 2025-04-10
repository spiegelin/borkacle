"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Plus, MoreHorizontal, AlertCircle, CheckCircle2, Clock, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import Link from "next/link"

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

export function TaskBoard() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const [columns, setColumns] = useState({
    todo: {
      id: "todo",
      title: "To Do",
      tasks: [
        { id: "ORA-2345", title: "Setup cloud infrastructure", type: "task", priority: "high", status: "todo" },
        {
          id: "ORA-2346",
          title: "Database migration plan",
          type: "story",
          priority: "highest",
          status: "todo",
          assignee: { name: "John Doe", initials: "JD" },
        },
        { id: "ORA-2347", title: "Login page not responsive", type: "bug", priority: "medium", status: "todo" },
      ],
    },
    inProgress: {
      id: "inProgress",
      title: "In Progress",
      tasks: [
        {
          id: "ORA-2348",
          title: "Implement SSO authentication",
          type: "task",
          priority: "high",
          status: "inProgress",
          assignee: { name: "Sarah Lee", initials: "SL" },
        },
        {
          id: "ORA-2349",
          title: "Create API documentation",
          type: "story",
          priority: "medium",
          status: "inProgress",
          assignee: { name: "John Doe", initials: "JD" },
        },
      ],
    },
    review: {
      id: "review",
      title: "Review",
      tasks: [
        {
          id: "ORA-2350",
          title: "Code review for security module",
          type: "task",
          priority: "highest",
          status: "review",
        },
        {
          id: "ORA-2351",
          title: "Performance testing results",
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
          title: "Initial project setup",
          type: "task",
          priority: "medium",
          status: "done",
          assignee: { name: "John Doe", initials: "JD" },
        },
        { id: "ORA-2353", title: "Requirements gathering", type: "story", priority: "high", status: "done" },
      ],
    },
  })

  const onDragEnd = (result) => {
    const { source, destination } = result

    // If the item was dropped outside of a droppable area
    if (!destination) {
      return
    }

    // If the item was dropped in the same place
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    const sourceColumn = columns[source.droppableId]
    const destColumn = columns[destination.droppableId]
    const sourceTasks = [...sourceColumn.tasks]
    const destTasks = source.droppableId === destination.droppableId ? sourceTasks : [...destColumn.tasks]

    const [removed] = sourceTasks.splice(source.index, 1)
    destTasks.splice(destination.index, 0, { ...removed, status: destination.droppableId })

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        tasks: sourceTasks,
      },
      [destination.droppableId]: {
        ...destColumn,
        tasks: destTasks,
      },
    })
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
        return <AlertCircle className="h-3 w-3 text-[#F7630C]" />
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
            className="lucide lucide-layers text-[#F7630C]"
          >
            <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
            <path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.5" />
            <path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.5" />
          </svg>
        )
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Enterprise Cloud Migration</h1>
          <p className="text-gray-500">Current Sprint: Sprint 3 (Feb 15 - Mar 1)</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-gray-200">
            Filter
          </Button>
          <Button onClick={() => setCreateTaskOpen(true)} className="bg-[#F7630C] hover:bg-[#E25A00]">
            <Plus className="h-4 w-4 mr-1" /> Create
          </Button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-700">
                  {column.title} <span className="text-gray-400 text-sm">({column.tasks.length})</span>
                </h3>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-gray-50 rounded-lg p-2 flex-1 min-h-[500px]"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable key={task.id} draggableId={task.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 cursor-pointer hover:shadow-md transition-shadow"
                          >
                            <CardContent className="p-3">
                              <Link href={`/item/${task.id}`}>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs font-medium text-[#3A3A3A]">{task.id}</span>
                                    <div className="flex items-center gap-0.5">
                                      {getTypeIcon(task.type)}
                                      {getPriorityIcon(task.priority)}
                                    </div>
                                  </div>
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <MoreHorizontal className="h-3 w-3" />
                                  </Button>
                                </div>
                                <p className="text-sm font-medium mb-2">{task.title}</p>
                                <div className="flex items-center justify-between">
                                  <Badge variant="outline" className="text-xs bg-gray-50">
                                    {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                                  </Badge>
                                  {task.assignee && (
                                    <Avatar className="h-6 w-6">
                                      {task.assignee.avatar && (
                                        <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                                      )}
                                      <AvatarFallback className="text-[10px] bg-[#3A3A3A] text-white">
                                        {task.assignee.initials}
                                      </AvatarFallback>
                                    </Avatar>
                                  )}
                                </div>
                              </Link>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>

      <CreateTaskDialog open={createTaskOpen} setOpen={setCreateTaskOpen} />
    </div>
  )
}

