"use client"

import React, { useState } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { DashboardLayout } from '@/components/dashboard-layout'
import { TaskBoard } from '@/components/task-board'
import { Sprints } from '@/components/sprints'
import { Reports } from '@/components/reports'
import { Backlog } from '@/components/backlog'
import { KpiDashboard } from '@/components/kpi-dashboard'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState("board")

  const renderActiveView = () => {
    switch (activeView) {
      case "board":
        return <TaskBoard />
      case "backlog":
        return <Backlog />
      case "sprints":
        return <Sprints />
      case "reports":
        return <Reports />
      case "kpi":
        return <KpiDashboard />
      default:
        return <TaskBoard />
    }
  }

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderActiveView()}
    </DashboardLayout>
  )
}

