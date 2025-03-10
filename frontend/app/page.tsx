"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { TaskBoard } from "@/components/task-board"
import { Backlog } from "@/components/backlog"
import { Sprints } from "@/components/sprints"
import { Reports } from "@/components/reports"
import { Settings } from "@/components/settings"

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

