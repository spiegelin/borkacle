"use client"

import { useState } from "react"
import { Plus, Search, Filter, ArrowUpDown, MoreHorizontal, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CreateTaskDialog } from "@/components/create-task-dialog"
import { useRouter } from "next/navigation"

interface Task {
  id: string
  title: string
  type: "bug" | "task" | "story" | "epic"
  priority: "highest" | "high" | "medium" | "low" | "lowest"
  status: "to do" | "in progress" | "review" | "done"
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
  created: string
  updated: string
}

export function Backlog() {
  const [createTaskOpen, setCreateTaskOpen] = useState(false)
  const router = useRouter()

  const handleRowClick = (taskId: string) => {
    router.push(`/item/${taskId}`)
  }

  const tasks: Task[] = [
    {
      id: "ORA-2345",
      title: "Setup cloud infrastructure",
      type: "task",
      priority: "high",
      status: "to do",
      created: "2023-02-10",
      updated: "2023-02-15",
    },
    {
      id: "ORA-2346",
      title: "Database migration plan",
      type: "story",
      priority: "highest",
      status: "to do",
      assignee: { name: "John Doe", initials: "JD" },
      created: "2023-02-08",
      updated: "2023-02-14",
    },
    {
      id: "ORA-2347",
      title: "Login page not responsive",
      type: "bug",
      priority: "medium",
      status: "to do",
      created: "2023-02-12",
      updated: "2023-02-12",
    },
    {
      id: "ORA-2348",
      title: "Implement SSO authentication",
      type: "task",
      priority: "high",
      status: "in progress",
      assignee: { name: "Sarah Lee", initials: "SL" },
      created: "2023-02-05",
      updated: "2023-02-16",
    },
    {
      id: "ORA-2349",
      title: "Create API documentation",
      type: "story",
      priority: "medium",
      status: "in progress",
      assignee: { name: "John Doe", initials: "JD" },
      created: "2023-02-07",
      updated: "2023-02-15",
    },
    {
      id: "ORA-2350",
      title: "Code review for security module",
      type: "task",
      priority: "highest",
      status: "review",
      created: "2023-02-01",
      updated: "2023-02-14",
    },
    {
      id: "ORA-2351",
      title: "Performance testing results",
      type: "story",
      priority: "high",
      status: "review",
      assignee: { name: "Mike Chen", initials: "MC" },
      created: "2023-01-28",
      updated: "2023-02-13",
    },
    {
      id: "ORA-2352",
      title: "Initial project setup",
      type: "task",
      priority: "medium",
      status: "done",
      assignee: { name: "John Doe", initials: "JD" },
      created: "2023-01-15",
      updated: "2023-01-20",
    },
    {
      id: "ORA-2353",
      title: "Requirements gathering",
      type: "story",
      priority: "high",
      status: "done",
      created: "2023-01-10",
      updated: "2023-01-18",
    },
  ]

  const getTypeIcon = (type: Task["type"]) => {
    switch (type) {
      case "bug":
        return <AlertCircle className="h-4 w-4 text-[#F7630C]" />
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
            className="lucide lucide-layers text-[#F7630C]"
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
        return "bg-red-100 text-[#F7630C]"
      case "high":
        return "bg-orange-100 text-[#E25A00]"
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
      case "to do":
        return "bg-gray-100 text-[#3A3A3A]"
      case "in progress":
        return "bg-orange-100 text-[#F7630C]"
      case "review":
        return "bg-gray-200 text-[#707070]"
      case "done":
        return "bg-green-100 text-green-700"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Backlog</h1>
          <p className="text-gray-500">Enterprise Cloud Migration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateTaskOpen(true)} className="bg-[#F7630C] hover:bg-[#E25A00]">
            <Plus className="h-4 w-4 mr-1" /> Create
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
          <Input placeholder="Search issues" className="pl-8" />
        </div>
        <Button variant="outline" className="border-gray-200">
          <Filter className="h-4 w-4 mr-1" /> Filter
        </Button>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[100px]">Key</TableHead>
              <TableHead className="w-[40px]">Type</TableHead>
              <TableHead>Summary</TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center">
                  Priority
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]">Status</TableHead>
              <TableHead className="w-[120px]">Assignee</TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center">
                  Created
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="w-[120px]">
                <div className="flex items-center">
                  Updated
                  <ArrowUpDown className="ml-1 h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="w-[40px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow
                key={task.id}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => (window.location.href = `/item/${task.id}`)}
              >
                <TableCell className="font-medium text-[#3A3A3A]">{task.id}</TableCell>
                <TableCell>{getTypeIcon(task.type)}</TableCell>
                <TableCell>{task.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getPriorityColor(task.priority)}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={`${getStatusColor(task.status)}`}>
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {task.assignee ? (
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        {task.assignee.avatar && <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />}
                        <AvatarFallback className="text-[10px] bg-[#3A3A3A] text-white">
                          {task.assignee.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{task.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-gray-500 text-sm">Unassigned</span>
                  )}
                </TableCell>
                <TableCell className="text-sm text-gray-500">{task.created}</TableCell>
                <TableCell className="text-sm text-gray-500">{task.updated}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation() // Prevent row click event
                      // Add your more options logic here
                    }}
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <CreateTaskDialog open={createTaskOpen} setOpen={setCreateTaskOpen} />
    </div>
  )
}

