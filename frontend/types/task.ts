export type TaskType = "bug" | "task" | "story" | "epic"
export type TaskPriority = "highest" | "high" | "medium" | "low" | "lowest"
export type TaskStatus = "todo" | "inProgress" | "review" | "done" | "blocked" | "cancelled"

export interface TaskAssignee {
  name: string
  avatar?: string
  initials: string
}

export interface Task {
  id: string
  title: string
  titulo?: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  description?: string
  descripcion?: string
  assignee?: TaskAssignee
  created: string
  updated: string
  fechaCreacion?: string
  fechaActualizacion?: string
  tiempoEstimado?: number
  tiempoReal?: number
  proyectoId?: number
  sprintId?: number
  sprint?: string
} 