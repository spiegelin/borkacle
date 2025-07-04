"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import type { Task, TaskPriority, TaskType } from "@/types/task"

interface SortableTaskProps {
  task: Task
  getPriorityIcon: (priority: TaskPriority) => React.ReactNode
  getTypeIcon: (type: TaskType) => React.ReactNode
}

export function SortableTask({ task, getPriorityIcon, getTypeIcon }: SortableTaskProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          {getTypeIcon(task.type)}
          {getPriorityIcon(task.priority)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{task.id}</span>
          </div>
          <p className="text-sm font-medium text-[#3A3A3A] mb-2">{task.title}</p>
          {task.assignee && (
            <div className="flex items-center gap-1 mt-2">
              <Avatar className="h-5 w-5">
                {task.assignee.avatar && (
                  <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                )}
                <AvatarFallback>{task.assignee.initials}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">{task.assignee.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 