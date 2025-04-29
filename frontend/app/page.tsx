"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/DashboardLayout"
import { TaskBoard } from "@/components/project/TaskBoard"
import { Backlog } from "@/components/project/Backlog"
import { Sprints } from "@/components/project/Sprints"
import { Reports } from "@/components/dashboard/Reports"
import { Settings } from "@/components/ui/Settings"

export default function Dashboard() {
  const [activeView, setActiveView] = useState("board")

  const renderView = () => {
    switch (activeView) {
      case "board":
        return <TaskBoard />
      case "backlog":
        return <Backlog />
      case "sprints":
        return <Sprints />
      case "reports":
        return <Reports />
      case "settings":
        return <Settings />
      default:
        return <TaskBoard />
    }
  }

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderView()}
    </DashboardLayout>
  )
}

