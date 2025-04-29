"use client"

import { useParams } from "next/navigation"
import { useState, useEffect } from "react"
import { TaskView } from "@/components/tasks/TaskView"
import { StoryView } from "@/components/tasks/StoryView"
import { BugView } from "@/components/tasks/BugView"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import type { ItemType as Item, TaskItem, StoryItem, BugItem, Priority, Status } from '@/types/item'

// Re-added MockItems type definition
type MockItems = {
  [key: string]: Item
}

// Mock data for demonstration purposes
const mockItems: MockItems = {
  "ORA-2345": {
    id: "ORA-2345",
    type: "task",
    title: "Setup cloud infrastructure",
    priority: "high",
    status: "to do",
    assignee: { name: "John Doe", initials: "JD" },
  },
  "ORA-2346": {
    id: "ORA-2346",
    type: "story",
    title: "Database migration plan",
    priority: "highest",
    status: "to do",
    assignee: { name: "Jane Smith", initials: "JS" },
  },
  "ORA-2347": {
    id: "ORA-2347",
    type: "bug",
    title: "Login page not responsive",
    priority: "medium",
    status: "in progress",
    assignee: { name: "Mike Johnson", initials: "MJ" },
  },
}

export default function ItemPage() {
  const params = useParams()
  const id = params.id as string
  const [item, setItem] = useState<Item | null>(null)

  useEffect(() => {
    if (id) {
      // In a real application, you would fetch the item data from an API
      // For this example, we're using mock data
      setItem(mockItems[id])
    }
  }, [id])

  if (!item) {
    return (
      <div className="container mx-auto py-6">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <div>Loading...</div>
      </div>
    )
  }

  const handleStatusChange = (newStatus: string) => {
    setItem({ ...item, status: newStatus as Status })
    // In a real application, you would also update the server with the new status
  }

  const renderItemView = () => {
    switch (item.type) {
      case "task":
        return <TaskView item={item} onStatusChange={handleStatusChange} />
      case "story":
        return <StoryView item={item} onStatusChange={handleStatusChange} />
      case "bug":
        return <BugView item={item} onStatusChange={handleStatusChange} />
      default:
        return <div>Invalid item type</div>
    }
  }

  return (
    <div className="space-y-4">
      <div className="container mx-auto py-6">
        <Link href="/" passHref>
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        {renderItemView()}
      </div>
    </div>
  )
}

