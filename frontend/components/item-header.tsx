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

interface ItemHeaderProps {
  id: string
  title: string
  type: "bug" | "task" | "story"
  priority: "highest" | "high" | "medium" | "low" | "lowest"
  status: "to do" | "in progress" | "review" | "done"
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
  onStatusChange: (newStatus: string) => void
}

export function ItemHeader({ id, title, type, priority, status, assignee, onStatusChange }: ItemHeaderProps) {
  const [currentStatus, setCurrentStatus] = useState(status)
  const [currentAssignee, setCurrentAssignee] = useState(assignee)

  const handleStatusChange = (newStatus: string) => {
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
    }
  }

  const getPriorityIcon = (priority: ItemHeaderProps["priority"]) => {
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

  const getStatusColor = (status: ItemHeaderProps["status"]) => {
    switch (status) {
      case "to do":
        return "bg-gray-100 text-[#3A3A3A]"
      case "in progress":
        return "bg-orange-100 text-[#C74634]"
      case "review":
        return "bg-gray-200 text-[#707070]"
      case "done":
        return "bg-green-100 text-green-700"
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
              <Badge className={`mr-2 ${getStatusColor(currentStatus)}`}>{currentStatus}</Badge>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Set status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleStatusChange("to do")}>To Do</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange("in progress")}>In Progress</DropdownMenuItem>
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

