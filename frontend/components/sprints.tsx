"use client"

import type React from "react"

import { useState } from "react"
import { Plus, ChevronDown, ChevronRight, Calendar, Clock, CheckCircle, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { CreateSprintDialog } from "@/components/create-sprint-dialog"
import { SprintBoard } from "@/components/sprint-board"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Sprint {
  id: string
  name: string
  status: "active" | "planned" | "completed"
  dateRange: string
  progress: number
  tasks: {
    total: number
    completed: number
    inProgress: number
    todo: number
  }
}

export function Sprints() {
  const [createSprintOpen, setCreateSprintOpen] = useState(false)
  const [openSprints, setOpenSprints] = useState<string[]>(["sprint-3"])
  const [selectedSprint, setSelectedSprint] = useState<Sprint | null>(null)

  const sprints: Sprint[] = [
    {
      id: "sprint-3",
      name: "Sprint 3",
      status: "active",
      dateRange: "Feb 15 - Mar 1",
      progress: 35,
      tasks: {
        total: 12,
        completed: 4,
        inProgress: 3,
        todo: 5,
      },
    },
    {
      id: "sprint-2",
      name: "Sprint 2",
      status: "completed",
      dateRange: "Feb 1 - Feb 14",
      progress: 100,
      tasks: {
        total: 10,
        completed: 10,
        inProgress: 0,
        todo: 0,
      },
    },
    {
      id: "sprint-1",
      name: "Sprint 1",
      status: "completed",
      dateRange: "Jan 15 - Jan 31",
      progress: 100,
      tasks: {
        total: 8,
        completed: 8,
        inProgress: 0,
        todo: 0,
      },
    },
    {
      id: "sprint-4",
      name: "Sprint 4",
      status: "planned",
      dateRange: "Mar 2 - Mar 15",
      progress: 0,
      tasks: {
        total: 14,
        completed: 0,
        inProgress: 0,
        todo: 14,
      },
    },
  ]

  const toggleSprint = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent other click handlers
    setOpenSprints((prev) => (prev.includes(id) ? prev.filter((sprintId) => sprintId !== id) : [...prev, id]))
  }

  const getStatusColor = (status: Sprint["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700"
      case "planned":
        return "bg-gray-100 text-[#3A3A3A]"
      case "completed":
        return "bg-gray-200 text-[#707070]"
    }
  }

  const getStatusIcon = (status: Sprint["status"]) => {
    switch (status) {
      case "active":
        return <Clock className="h-4 w-4 text-green-700" />
      case "planned":
        return <Calendar className="h-4 w-4 text-[#1A4F9C]" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-gray-700" />
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#3A3A3A]">Sprints</h1>
          <p className="text-gray-500">Enterprise Cloud Migration</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setCreateSprintOpen(true)} className="bg-[#C74634] hover:bg-[#b03d2e]">
            <Plus className="h-4 w-4 mr-1" /> Create Sprint
          </Button>
        </div>
      </div>

      {selectedSprint ? (
        <div>
          <Button variant="outline" onClick={() => setSelectedSprint(null)} className="mb-4">
            Back to Sprint List
          </Button>
          <SprintBoard
            sprintId={selectedSprint.id}
            sprintName={selectedSprint.name}
            sprintDateRange={selectedSprint.dateRange}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {sprints
            .sort((a, b) => {
              if (a.status === "active") return -1
              if (b.status === "active") return 1
              if (a.status === "planned" && b.status === "completed") return -1
              if (a.status === "completed" && b.status === "planned") return 1
              return 0
            })
            .map((sprint) => (
              <Card key={sprint.id}>
                <Collapsible open={openSprints.includes(sprint.id)}>
                  <CardHeader
                    className="p-4 flex flex-row items-center justify-between space-y-0 cursor-pointer"
                    onClick={(e) => toggleSprint(sprint.id, e)}
                  >
                    <div className="flex items-center gap-2">
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => toggleSprint(sprint.id, e)}
                        >
                          {openSprints.includes(sprint.id) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                      <div>
                        <CardTitle className="text-lg">{sprint.name}</CardTitle>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{sprint.dateRange}</span>
                          <div
                            className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(sprint.status)} flex items-center gap-1`}
                          >
                            {getStatusIcon(sprint.status)}
                            <span>{sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-sm font-medium">{sprint.progress}% complete</div>
                        <div className="text-xs text-gray-500">
                          {sprint.tasks.completed} of {sprint.tasks.total} tasks completed
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => setSelectedSprint(sprint)}>
                            View Sprint Board
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Sprint</DropdownMenuItem>
                          {sprint.status === "planned" && <DropdownMenuItem>Start Sprint</DropdownMenuItem>}
                          {sprint.status === "active" && <DropdownMenuItem>Complete Sprint</DropdownMenuItem>}
                          <DropdownMenuItem className="text-red-500">Delete Sprint</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="p-4 pt-0">
                      <div className="mb-4">
                        <Progress value={sprint.progress} className="h-2" />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">To Do</div>
                          <div className="text-2xl font-bold text-[#3A3A3A]">{sprint.tasks.todo}</div>
                        </div>
                        <div className="bg-blue-50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">In Progress</div>
                          <div className="text-2xl font-bold text-[#C74634]">{sprint.tasks.inProgress}</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                          <div className="text-sm font-medium text-gray-500 mb-1">Completed</div>
                          <div className="text-2xl font-bold text-green-700">{sprint.tasks.completed}</div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" className="text-sm" onClick={() => setSelectedSprint(sprint)}>
                          View Sprint Board
                        </Button>
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Collapsible>
              </Card>
            ))}
        </div>
      )}

      <CreateSprintDialog open={createSprintOpen} setOpen={setCreateSprintOpen} />
    </div>
  )
}

