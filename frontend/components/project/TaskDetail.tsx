"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import api from "@/lib/api"
import type { Task, TaskPriority, TaskStatus } from "@/types/task"

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
  const [editedTask, setEditedTask] = useState<Task>({
    ...task,
    description: task.descripcion || task.description || '',
    descripcion: task.descripcion || task.description || '',
    title: task.titulo || task.title || '',
    created: task.fechaCreacion || task.created,
    updated: task.fechaActualizacion || task.updated
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    console.log('Task updated:', task) // Debug log
    setEditedTask({
      ...task,
      description: task.descripcion || task.description || '',
      descripcion: task.descripcion || task.description || '',
      title: task.titulo || task.title || '',
      created: task.fechaCreacion || task.created,
      updated: task.fechaActualizacion || task.updated
    })
  }, [task])

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
      
      const selectedUser = users.find(u => u.nombre === editedTask.assignee?.name)
      
      const taskData = {
        titulo: editedTask.title,
        descripcion: editedTask.description,
        prioridadId: getPriorityId(editedTask.priority),
        estadoId: getStatusId(editedTask.status),
        tipo: editedTask.type,
        tiempoEstimado: null,
        proyectoId: null,
        sprintId: null,
        tiempoReal: null,
        userId: selectedUser?.id || null
      }
      console.log('Task data being sent:', taskData)
      const response = await api.put(`/api/tasks/${taskId}`, taskData)
      console.log('API Response:', response.data)
      
      const updatedTask = {
        ...editedTask,
        title: response.data.titulo,
        description: response.data.descripcion,
        descripcion: response.data.descripcion,
        type: response.data.tipo?.toLowerCase() || 'task',
        priority: editedTask.priority,
        status: editedTask.status,
        assignee: response.data.asignadoA ? {
          name: response.data.asignadoA,
          initials: getInitials(response.data.asignadoA)
        } : undefined,
        updated: response.data.fechaActualizacion || new Date().toISOString(),
        created: response.data.fechaCreacion || task.created
      }
      setEditedTask(updatedTask)
      setIsEditing(false)
      onBack()
    } catch (err: any) {
      console.error('Error updating task:', err)
      if (err.response) {
        console.error('Error response:', err.response.data)
      }
      setError("Error al actualizar la tarea. Por favor, intente nuevamente.")
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

  const getPriorityColor = (priority: TaskPriority) => {
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

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "bg-gray-100 text-[#3A3A3A]"
      case "inProgress":
        return "bg-orange-100 text-[#C74634]"
      case "review":
        return "bg-gray-200 text-[#707070]"
      case "done":
        return "bg-green-100 text-green-700"
      case "blocked":
        return "bg-red-100 text-red-700"
      case "cancelled":
        return "bg-gray-300 text-gray-700"
    }
  }

  const getPriorityId = (priority: TaskPriority): number => {
    switch (priority) {
      case "highest": return 1
      case "high": return 2
      case "medium": return 3
      case "low": return 4
      case "lowest": return 5
      default: return 3
    }
  }

  const getStatusId = (status: TaskStatus): number => {
    switch (status) {
      case 'todo': return 3
      case 'inProgress': return 1
      case 'review': return 4
      case 'done': return 6
      case 'blocked': return 5
      case 'cancelled': return 7
      default: return 3
    }
  }

  const getPriorityText = (priority: TaskPriority): string => {
    switch (priority) {
      case "highest": return "Máxima"
      case "high": return "Alta"
      case "medium": return "Media"
      case "low": return "Baja"
      case "lowest": return "Mínima"
      default: return priority
    }
  }

  const getStatusText = (status: TaskStatus): string => {
    switch (status) {
      case "todo": return "Pendiente"
      case "inProgress": return "En progreso"
      case "review": return "En revisión"
      case "done": return "Completado"
      case "blocked": return "Bloqueado"
      case "cancelled": return "Cancelado"
      default: return status
    }
  }

  const getTypeText = (type: Task["type"]): string => {
    switch (type) {
      case "bug": return "Error"
      case "task": return "Tarea"
      case "story": return "Historia"
      case "epic": return "Épica"
      default: return type
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Button variant="outline" onClick={onBack} className="flex items-center gap-2 mb-6">
        <ArrowLeft className="h-4 w-4" />
        Volver
      </Button>

      <Card>
        <CardContent className="pt-8 pb-6 px-6">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">Título</p>
            {isEditing ? (
              <input
                className="font-medium text-[#3A3A3A] bg-gray-50 border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition"
                value={editedTask.title}
                onChange={e => setEditedTask({ ...editedTask, title: e.target.value })}
                maxLength={100}
                autoFocus
              />
            ) : (
              <p className="font-medium text-[#3A3A3A] bg-gray-50 border border-gray-200 rounded px-3 py-2 w-full">{editedTask.title}</p>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">ID</p>
              <p className="font-medium">{task.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Tipo</p>
              {isEditing ? (
                <select
                  className="border rounded px-2 py-1"
                  value={editedTask.type}
                  onChange={e => setEditedTask({ ...editedTask, type: e.target.value as Task["type"] })}
                >
                  <option value="task">Tarea</option>
                  <option value="bug">Error</option>
                  <option value="story">Historia</option>
                  <option value="epic">Épica</option>
                </select>
              ) : (
                <Badge variant="outline">{getTypeText(task.type)}</Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Prioridad</p>
              {isEditing ? (
                <select
                  className="border rounded px-2 py-1"
                  value={editedTask.priority}
                  onChange={e => setEditedTask({ ...editedTask, priority: e.target.value as TaskPriority })}
                >
                  <option value="highest">Máxima</option>
                  <option value="high">Alta</option>
                  <option value="medium">Media</option>
                  <option value="low">Baja</option>
                  <option value="lowest">Mínima</option>
                </select>
              ) : (
                <Badge className={getPriorityColor(task.priority)}>
                  {getPriorityText(task.priority)}
                </Badge>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estado</p>
              {isEditing ? (
                <select
                  className="border rounded px-2 py-1"
                  value={editedTask.status}
                  onChange={e => setEditedTask({ ...editedTask, status: e.target.value as TaskStatus })}
                >
                  <option value="todo">Pendiente</option>
                  <option value="inProgress">En progreso</option>
                  <option value="review">En revisión</option>
                  <option value="done">Completado</option>
                  <option value="blocked">Bloqueado</option>
                  <option value="cancelled">Cancelado</option>
                </select>
              ) : (
                <Badge className={getStatusColor(task.status)}>
                  {getStatusText(task.status)}
                </Badge>
              )}
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-gray-500 mb-1">Descripción</p>
              {isEditing ? (
                <textarea
                  className="font-medium text-[#3A3A3A] bg-gray-50 border border-gray-200 rounded px-3 py-2 w-full focus:outline-none focus:border-blue-400 transition min-h-[100px]"
                  value={editedTask.description}
                  onChange={e => setEditedTask({ ...editedTask, description: e.target.value, descripcion: e.target.value })}
                />
              ) : (
                <div className="font-medium text-[#3A3A3A] bg-gray-50 border border-gray-200 rounded px-3 py-2 w-full min-h-[100px] whitespace-pre-wrap">
                  {editedTask.description || <span className="text-gray-400">Sin descripción</span>}
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Asignado a</p>
              {isEditing ? (
                <div>
                  {loadingUsers ? (
                    <p className="text-sm text-gray-500">Cargando usuarios...</p>
                  ) : (
                    <select
                      className="border rounded px-2 py-1 w-full"
                      value={editedTask.assignee?.name || ''}
                      onChange={(e) => handleUserSelect(e.target.value)}
                      disabled={saving}
                    >
                      <option value="">Seleccionar usuario</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.nombre}>
                          {user.nombre}
                        </option>
                      ))}
                    </select>
                  )}
                  {users.length === 0 && !loadingUsers && (
                    <p className="text-sm text-red-500 mt-1">No hay usuarios disponibles</p>
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
                <span className="text-sm text-gray-500">Sin asignar</span>
                )
              )}
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Creado</p>
              <p className="text-sm text-gray-500">{task.fechaCreacion || task.created}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Actualizado</p>
              <p className="text-sm text-gray-500">{task.fechaActualizacion || task.updated}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>
                  Cancelar
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
              </>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Editar tarea</Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 