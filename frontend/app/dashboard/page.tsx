"use client"

import React, { useState } from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { TaskBoard } from '@/components/project/TaskBoard'
import { Sprints } from '@/components/project/Sprints'
import { Reports } from '@/components/dashboard/Reports'
import { Backlog } from '@/components/project/Backlog'
import { KpiDashboard } from '@/components/dashboard/KpiDashboard'
import { KpiPersonaDashboard } from '@/components/dashboard/KpiPersonaDashboard'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const [activeView, setActiveView] = useState("board")
  const isAdmin = user?.rol === "administrador"

  console.log("user", user)

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
        // Only admins can see team KPI dashboard
        if (!isAdmin) {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Acceso Denegado</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No tienes permisos para ver KPIs de equipos. Esta sección está restringida a administradores.</p>
              </CardContent>
            </Card>
          )
        }
        return <KpiDashboard />
      case "kpi-persona":
        // Only admins can see all user KPI dashboard
        if (!isAdmin) {
          return (
            <Card>
              <CardHeader>
                <CardTitle>Acceso Denegado</CardTitle>
              </CardHeader>
              <CardContent>
                <p>No tienes permisos para ver KPIs de todas las personas. Esta sección está restringida a administradores.</p>
              </CardContent>
            </Card>
          )
        }
        return <KpiPersonaDashboard />
      case "kpi-individual":
        // Filter for current user only
        return <KpiPersonaDashboard individualUserView={true} userId={user?.id} />
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

