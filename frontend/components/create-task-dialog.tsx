"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Ajusta la interfaz si la tienes en otro archivo
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
}

interface CreateTaskDialogProps {
  open: boolean
  setOpen: (open: boolean) => void
  onCreateTask: (task: Task) => void
}

export function CreateTaskDialog({ open, setOpen, onCreateTask }: CreateTaskDialogProps) {
  const [taskType, setTaskType] = useState<Task["type"]>("task")
  const [priority, setPriority] = useState<Task["priority"]>("medium")
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [assignee, setAssignee] = useState("unassigned")

  const assignees: Record<
    string,
    {
      name: string
      initials: string
      avatar?: string
    } | undefined
  > = {
    john: { name: "John Doe", initials: "JD" },
    sarah: { name: "Sarah Lee", initials: "SL" },
    mike: { name: "Mike Chen", initials: "MC" },
    unassigned: undefined,
  }

  function handleCreate() {
    const newTask: Task = {
      id: "ORA-" + Date.now().toString(),
      title: taskTitle,
      type: taskType,
      priority,
      status: "todo", // por defecto se crea en la columna "To Do"
      description: taskDescription,
      assignee: assignees[assignee],
    }

    onCreateTask(newTask)
    setOpen(false)

    // Resetea los campos si quieres reutilizar el mismo diálogo:
    setTaskTitle("")
    setTaskDescription("")
    setTaskType("task")
    setPriority("medium")
    setAssignee("unassigned")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#3A3A3A]">Create task</DialogTitle>
          <DialogDescription>Add a new task. Click "Create" when you're done.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="task-type" className="text-right">
              Type
            </Label>
            <Select value={taskType} onValueChange={(val) => setTaskType(val as Task["type"])}>
              <SelectTrigger id="task-type" className="col-span-3">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="task">Task</SelectItem>
                <SelectItem value="bug">Bug</SelectItem>
                <SelectItem value="story">Story</SelectItem>
                <SelectItem value="epic">Epic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              className="col-span-3"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              className="col-span-3"
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="priority" className="text-right">
              Priority
            </Label>
            <Select value={priority} onValueChange={(val) => setPriority(val as Task["priority"])}>
              <SelectTrigger id="priority" className="col-span-3">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="highest">Highest</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="lowest">Lowest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="assignee" className="text-right">
              Assignee
            </Label>
            <Select value={assignee} onValueChange={(val) => setAssignee(val)}>
              <SelectTrigger id="assignee" className="col-span-3">
                <SelectValue placeholder="Unassigned" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">Unassigned</SelectItem>
                <SelectItem value="john">John Doe</SelectItem>
                <SelectItem value="sarah">Sarah Lee</SelectItem>
                <SelectItem value="mike">Mike Chen</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} className="bg-[#C74634] hover:bg-[#b03d2e]">
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
