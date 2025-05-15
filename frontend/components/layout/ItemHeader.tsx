"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle2, Clock, ArrowUpRight, ChevronDown } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Priority, Status } from "@/types/item"

interface ItemHeaderProps {
  id: string
  title: string
  type: "bug" | "task" | "story" | "epic"
  priority: Priority
  status: Status
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
  onStatusChange: (newStatus: Status) => void
}

export function ItemHeader({ id, title, type, priority, status, assignee, onStatusChange }: ItemHeaderProps) {
  const [currentStatus, setCurrentStatus] = useState<Status>(status)
  const [currentAssignee, setCurrentAssignee] = useState(assignee)

  const handleStatusChange = (newStatus: Status) => {
    setCurrentStatus(newStatus)
    onStatusChange(newStatus)
  }

  const getTypeIcon = (type: ItemHeaderProps["type"]) => {
    switch (type) {
      case "bug":
        return <AlertCircle className="h-5 w-5 text-[#C74634]" />
      case "task":
        return <CheckCircle2 className="h-5 w-5 text-[#3A3A3A]" />
      case "story":
        return <Clock className="h-5 w-5 text-[#707070]" />
      case "epic":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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

  const getPriorityIcon = (priority: Priority) => {
    switch (priority) {
      case "highest":
        return <ArrowUpRight className="h-4 w-4 text-[#C74634]" />
      case "high":
        return <ArrowUpRight className="h-4 w-4 text-[#FF8B00]" />
      case "medium":
        return <ArrowUpRight className="h-4 w-4 text-[#FFAB00]" />
      case "low":
        return <ArrowUpRight className="h-4 w-4 rotate-180 text-[#00C7E6]" />
      case "lowest":
        return <ArrowUpRight className="h-4 w-4 rotate-180 text-[#0066FF]" />
    }
  }

  const getStatusColor = (status: Status) => {
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

  const getStatusText = (status: Status) => {
    switch(status) {
      case "todo": return "To Do";
      case "inProgress": return "In Progress";
      case "review": return "Review";
      case "done": return "Done";
    }
  }

  return (
    <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:space-y-0">
      <div className="flex items-start space-x-3">
        <div className="flex items-center space-x-2">
          {getTypeIcon(type)}
          <span className="text-lg font-semibold text-[#3A3A3A]">{id}</span>
        </div>
        <h1 className="text-2xl font-bold text-[#3A3A3A]">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[130px]">
              <Badge className={`mr-2 ${getStatusColor(currentStatus)}`}>{getStatusText(currentStatus)}</Badge>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Set status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange("todo")}>To Do</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("inProgress")}>In Progress</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("review")}>Review</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("done")}>Done</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-[130px]">
              {currentAssignee ? (
                <Avatar className="h-6 w-6 mr-2">
                  {currentAssignee.avatar && <AvatarImage src={currentAssignee.avatar} alt={currentAssignee.name} />}
                  <AvatarFallback>{currentAssignee.initials}</AvatarFallback>
                </Avatar>
              ) : (
                <span className="mr-2">Unassigned</span>
              )}
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Assign to</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setCurrentAssignee({ name: "John Doe", initials: "JD" })}>
              John Doe
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentAssignee({ name: "Jane Smith", initials: "JS" })}>
              Jane Smith
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setCurrentAssignee(undefined)}>Unassign</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Badge variant="outline" className="text-[#3A3A3A] border-[#3A3A3A]">
          {getPriorityIcon(priority)}
          <span className="ml-1">{priority.charAt(0).toUpperCase() + priority.slice(1)}</span>
        </Badge>
      </div>
    </div>
  )
}

