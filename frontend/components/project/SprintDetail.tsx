"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, Users, Edit2, Save, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import api from "@/lib/api"

interface SprintDetailProps {
  sprintId: string
  onBack: () => void
}

interface SprintData {
  id: string
  nombre: string
  fechaInicio: string
  fechaFin: string
  estado: string
  tasks: Task[]
}

interface Task {
  id: string
  title: string
  type: "bug" | "task" | "story" | "epic"
  priority: "highest" | "high" | "medium" | "low" | "lowest"
  status: "todo" | "inProgress" | "review" | "done"
  description?: string
  assignee?: {
    name: string
    avatar?: string
    initials: string
  }
  created: string
  updated: string
}

export function SprintDetail({ sprintId, onBack }: SprintDetailProps) {
  const [sprint, setSprint] = useState<SprintData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedSprint, setEditedSprint] = useState<Partial<SprintData>>({})

  useEffect(() => {
    fetchSprintDetails()
  }, [sprintId])

  const fetchSprintDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(`/api/sprints/${sprintId}`)
      setSprint(response.data)
      setEditedSprint(response.data)
    } catch (err) {
      console.error("Error fetching sprint details:", err)
      setError("Failed to load sprint details. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const response = await api.put(`/api/sprints/${sprintId}`, editedSprint)
      setSprint(response.data)
      setIsEditing(false)
    } catch (err) {
      console.error("Error updating sprint:", err)
      setError("Failed to update sprint. Please try again.")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700"
      case "planned":
        return "bg-gray-100 text-[#3A3A3A]"
      case "completed":
        return "bg-gray-200 text-[#707070]"
      default:
        return "bg-gray-100 text-[#3A3A3A]"
    }
  }

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "highest":
        return "bg-red-100 text-[#C74634]"
      case "high":
        return "bg-orange-100 text-[#b03d2e]"
      case "medium":
        return "bg-yellow-100 text-[#D9A600]"
      case "low":
        return "bg-gray-100 text-[#707070]"
      case "lowest":
        return "bg-gray-100 text-[#3A3A3A]"
    }
  }

  const getTaskStatusColor = (status: Task["status"]) => {
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

  if (loading) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sprint List
        </Button>
        <div className="text-center py-8">
          <p className="text-gray-500">Loading sprint details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sprint List
        </Button>
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  if (!sprint) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={onBack} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sprint List
        </Button>
        <div className="text-center py-8">
          <p className="text-gray-500">Sprint not found</p>
        </div>
      </div>
    )
  }

  const completedTasks = sprint.tasks.filter(task => task.status === "done").length
  const progress = sprint.tasks.length > 0 ? (completedTasks / sprint.tasks.length) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sprint List
        </Button>
        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>
            <Edit2 className="h-4 w-4 mr-2" />
            Edit Sprint
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {isEditing ? (
              <Input
                value={editedSprint.nombre || ""}
                onChange={(e) => setEditedSprint({ ...editedSprint, nombre: e.target.value })}
                className="text-2xl font-bold"
              />
            ) : (
              sprint.nombre
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Date Range</p>
                {isEditing ? (
                  <div className="flex gap-2">
                    <Input
                      type="date"
                      value={editedSprint.fechaInicio?.split('T')[0] || ""}
                      onChange={(e) => setEditedSprint({ ...editedSprint, fechaInicio: e.target.value })}
                    />
                    <Input
                      type="date"
                      value={editedSprint.fechaFin?.split('T')[0] || ""}
                      onChange={(e) => setEditedSprint({ ...editedSprint, fechaFin: e.target.value })}
                    />
                  </div>
                ) : (
                  <p className="font-medium">
                    {new Date(sprint.fechaInicio).toLocaleDateString()} - {new Date(sprint.fechaFin).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                {isEditing ? (
                  <select
                    value={editedSprint.estado || ""}
                    onChange={(e) => setEditedSprint({ ...editedSprint, estado: e.target.value })}
                    className="w-full p-2 border rounded"
                  >
                    <option value="ACTIVE">Active</option>
                    <option value="PLANNED">Planned</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                ) : (
                  <Badge className={getStatusColor(sprint.estado)}>
                    {sprint.estado}
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-500">Tasks</p>
                <p className="font-medium">
                  {completedTasks} of {sprint.tasks.length} completed
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sprint.tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.id}</TableCell>
                  <TableCell>{task.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getTaskStatusColor(task.status)}>
                      {task.status === "inProgress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {task.assignee ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          {task.assignee.avatar && (
                            <AvatarImage src={task.assignee.avatar} alt={task.assignee.name} />
                          )}
                          <AvatarFallback className="text-[10px] bg-[#3A3A3A] text-white">
                            {task.assignee.initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{task.created}</TableCell>
                  <TableCell className="text-sm text-gray-500">{task.updated}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 