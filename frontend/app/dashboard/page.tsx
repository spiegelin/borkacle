"use client"

import React from 'react'
import { useAuth } from '@/components/auth/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { LogOut, User } from 'lucide-react'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col p-4 md:p-8">
      <header className="bg-white rounded-lg shadow mb-8 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="h-10 w-10 rounded-md bg-[#F7630C] flex items-center justify-center text-white font-bold text-lg">
            O
          </div>
          <h1 className="text-xl font-bold">Borkacle Dashboard</h1>
        </div>
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={logout}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </Button>
      </header>

      <main className="flex-1">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Welcome{user ? `, ${user.nombre}` : ''}!</CardTitle>
              <CardDescription>
                This is your project dashboard. You can manage your tasks and projects here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {user && (
                <div className="bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Your Account Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <p className="text-sm font-medium">{user.nombre}</p>
                    </div>
                    <p className="text-sm"><span className="font-medium">Email:</span> {user.email}</p>
                    <p className="text-sm"><span className="font-medium">Role:</span> {user.rol}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>My Tasks</CardTitle>
                <CardDescription>View and manage your assigned tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/tasks">
                  <Button className="w-full">View Tasks</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Projects</CardTitle>
                <CardDescription>Access your projects and teamspaces</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/projects">
                  <Button className="w-full">View Projects</Button>
                </Link>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Members</CardTitle>
                <CardDescription>View and manage your team</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/team">
                  <Button className="w-full">View Team</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

