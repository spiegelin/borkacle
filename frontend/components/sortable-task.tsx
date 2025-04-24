"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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

interface SortableTaskProps {
  task: Task
  getPriorityIcon: (priority: Task["priority"]) => React.ReactNode
  getTypeIcon: (type: Task["type"]) => React.ReactNode
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
      className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow"
    >
      <Link href={`/item/${task.id}`} className="block">
        <div className="flex items-start gap-2">
          <div className="flex items-center gap-1">
            {getTypeIcon(task.type)}
            {getPriorityIcon(task.priority)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#3A3A3A] truncate">{task.title}</p>
            {task.assignee && (
              <div className="flex items-center gap-1 mt-1">
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
          <Button variant="ghost" size="icon" className="h-6 w-6">
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
              className="lucide lucide-more-horizontal"
            >
              <circle cx="12" cy="12" r="1" />
              <circle cx="19" cy="12" r="1" />
              <circle cx="5" cy="12" r="1" />
            </svg>
          </Button>
        </div>
      </Link>
    </div>
  )
} 