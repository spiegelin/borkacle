"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"

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

interface User {
  id: number;
  nombre: string;
}

interface TaskDetailProps {
  task: Task
  onBack: () => void
}

export function TaskDetail({ task, onBack }: TaskDetailProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedTask, setEditedTask] = useState<Task>(task)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true)
      const response = await api.get('/api/users')
      console.log('Users response:', response.data)
      // Ensure we're getting an array of users
      if (Array.isArray(response.data)) {
        setUsers(response.data)
      } else if (response.data && Array.isArray(response.data.content)) {
        // If the response is paginated
        setUsers(response.data.content)
      } else {
        console.error('Unexpected users data format:', response.data)
        setUsers([])
      }
    } catch (err) {
      console.error('Error fetching users:', err)
      setUsers([])
    } finally {
      setLoadingUsers(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError(null)
    try {
      let taskId = editedTask.id
      if (typeof taskId === 'string' && taskId.startsWith('ORA-')) {
        taskId = taskId.replace('ORA-', '')
      }
      console.log('Saving task with numeric ID:', taskId)
      
      // Get the selected user ID if a user is selected
      const selectedUser = users.find(u => u.nombre === editedTask.assignee?.name)
      
      const taskData = {
        titulo: editedTask.title,
        descripcion: editedTask.description || '',
        prioridadId: getPriorityId(editedTask.priority),
        estadoId: getStatusId(editedTask.status),
        tipo: editedTask.type,
        tiempoEstimado: null,
        proyectoId: null,
        sprintId: null,
        tiempoReal: null,
        userId: selectedUser?.id || null // Include the user ID in the main update
      }
      console.log('Task data being sent:', taskData)
      const response = await api.put(`/api/tasks/${taskId}`, taskData)
      console.log('API Response:', response.data)
      
      // Update the task with the response data
      const updatedTask = {
        ...editedTask,
        title: response.data.titulo,
        description: response.data.descripcion,
        type: response.data.tipo?.toLowerCase() || 'task',
        priority: editedTask.priority, // Keep the frontend priority mapping
        status: editedTask.status, // Keep the frontend status mapping
        assignee: response.data.asignadoA ? {
          name: response.data.asignadoA,
          initials: getInitials(response.data.asignadoA)
        } : undefined,
        updated: new Date().toISOString()
      }
      setEditedTask(updatedTask)
      setIsEditing(false)
      onBack()
    } catch (err: any) {
      console.error('Error updating task:', err)
      if (err.response) {
        console.error('Error response:', err.response.data)
      }
      setError("Error updating task. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const handleUserSelect = (userName: string) => {
    setEditedTask(prev => ({
      ...prev,
      assignee: {
        name: userName,
        initials: getInitials(userName)
      }
    }))
  }

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
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

  const getStatusColor = (status: Task["status"]) => {
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

  const getPriorityId = (priority: Task["priority"]): number => {
    switch (priority) {
      case "highest": return 1
      case "high": return 2
      case "medium": return 3
      case "low": return 4
      case "lowest": return 5
      default: return 3
    }
  }

  const getStatusId = (status: string): number => {
    switch (status) {
      case 'todo': return 3
      case 'inProgress': return 1
      case 'review': return 4
      case 'done': return 6
      default: return 3
    }
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Backlog
      </Button>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">
            {isEditing ? (
              <input
                className="border rounded px-2 py-1 w-full"
                value={editedTask.title}
                onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
              />
            ) : (
              task.title
            )}
          </CardTitle>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="secondary">
              Editar
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">ID</p>
              <p className="font-medium">{task.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Type</p>
              {isEditing ? (
                <select
                  className="border rounded px-2 py-1"
                  value={editedTask.type}
                  onChange={e => setEditedTask({ ...editedTask, type: e.target.value as Task["type"] })}
                >
                  <option value="task">Task</option>
                  <option value="bug">Bug</option>
                  <option value="story">Story</option>
                  <option value="epic">Epic</option>
                </select>
              ) : (
                <Badge variant="outline">{task.type.charAt(0).toUpperCase() + task.type.slice(1)}</Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Priority</p>
              {isEditing ? (
                <select
                  className="border rounded px-2 py-1"
                  value={editedTask.priority}
                  onChange={e => setEditedTask({ ...editedTask, priority: e.target.value as Task["priority"] })}
                >
                  <option value="highest">Highest</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="lowest">Lowest</option>
                </select>
              ) : (
                <Badge className={getPriorityColor(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Status</p>
              {isEditing ? (
                <select
                  className="border rounded px-2 py-1"
                  value={editedTask.status}
                  onChange={e => setEditedTask({ ...editedTask, status: e.target.value as Task["status"] })}
                >
                  <option value="todo">To Do</option>
                  <option value="inProgress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              ) : (
                <Badge className={getStatusColor(task.status)}>
                  {task.status === "inProgress" ? "In Progress" : task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                </Badge>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Description</p>
              {isEditing ? (
                <textarea
                  className="border rounded px-2 py-1 w-full"
                  value={editedTask.description}
                  onChange={e => setEditedTask({ ...editedTask, description: e.target.value })}
                />
              ) : (
                <p className="font-medium">{task.description || <span className="text-gray-400">No description</span>}</p>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Assignee</p>
              {isEditing ? (
                <div>
                  {loadingUsers ? (
                    <p className="text-sm text-gray-500">Loading users...</p>
                  ) : (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={editedTask.assignee?.name || ''}
                      onChange={(e) => handleUserSelect(e.target.value)}
                      disabled={saving}
                    >
                      <option value="">Select a user</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.nombre}>
                          {user.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                  {users.length === 0 && !loadingUsers && (
                    <p className="text-sm text-red-500 mt-1">No users available</p>
                  )}
                </div>
              ) : (
                editedTask.assignee ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      {editedTask.assignee.avatar && (
                        <AvatarImage src={editedTask.assignee.avatar} alt={editedTask.assignee.name} />
                      )}
                      <AvatarFallback className="text-[10px] bg-[#3A3A3A] text-white">
                        {editedTask.assignee.initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm">{editedTask.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">Unassigned</span>
                )
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Created</p>
              <p className="text-sm text-gray-500">{task.created}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Updated</p>
              <p className="text-sm text-gray-500">{task.updated}</p>
            </div>
          </div>
          {isEditing && (
            <div className="flex gap-2 mt-4">
              <Button onClick={handleSave} disabled={saving} className="bg-[#C74634] hover:bg-[#b03d2e]">
                {saving ? "Guardando..." : "Guardar"}
              </Button>
              <Button variant="outline" onClick={() => { setIsEditing(false); setEditedTask(task); }}>
                Cancelar
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 