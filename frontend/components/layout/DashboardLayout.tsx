"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { ChevronDown, SettingsIcon, User, Settings, LogOut } from "lucide-react"
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserProfileSettings } from "@/components/auth/UserProfileSettings"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthContext"

interface DashboardLayoutProps {
  children: React.ReactNode
  activeView: string
  setActiveView: (view: string) => void
}

export function DashboardLayout({ children, activeView, setActiveView }: DashboardLayoutProps) {
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [notificationCount, setNotificationCount] = useState(5)
  const { user, logout } = useAuth()
  const isAdmin = user?.rol === "administrador"

  // Close panels when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (notificationsOpen) setNotificationsOpen(false)
      if (profileOpen) setProfileOpen(false)
    }

    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [notificationsOpen, profileOpen])

  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-gray-50">
        <Sidebar className="border-r border-[#312c2b]">
          <SidebarHeader className="border-b border-[#312c2b] p-4 bg-[#312c2b]">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-[#C74634] flex items-center justify-center text-white font-bold">
                O
              </div>
              <div className="font-semibold text-white">Oracle Cloud Tasks</div>
            </div>
          </SidebarHeader>
          <SidebarContent  className=" bg-[#312c2b]">
            <SidebarGroup>
              <SidebarGroupLabel className="font-semibold text-white">Planning</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="font-semibold text-white">
                    <SidebarMenuButton isActive={activeView === "board"} onClick={() => setActiveView("board")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-layout-dashboard"
                      >
                        <rect width="7" height="9" x="3" y="3" rx="1" />
                        <rect width="7" height="5" x="14" y="3" rx="1" />
                        <rect width="7" height="9" x="14" y="12" rx="1" />
                        <rect width="7" height="5" x="3" y="16" rx="1" />
                      </svg>
                      <span>Board</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="font-semibold text-white">
                    <SidebarMenuButton isActive={activeView === "backlog"} onClick={() => setActiveView("backlog")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-list-todo"
                      >
                        <rect x="3" y="5" width="6" height="6" rx="1" />
                        <path d="m3 17 2 2 4-4" />
                        <path d="M13 6h8" />
                        <path d="M13 12h8" />
                        <path d="M13 18h8" />
                      </svg>
                      <span>Backlog</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem className="font-semibold text-white">
                    <SidebarMenuButton isActive={activeView === "sprints"} onClick={() => setActiveView("sprints")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-timer"
                      >
                        <path d="M10 2h4" />
                        <path d="M12 14v-4" />
                        <path d="M4 13a8 8 0 0 1 8-7 8 8 0 1 1-5.3 14L4 17.6" />
                        <path d="M9 17H4v5" />
                      </svg>
                      <span>Sprints</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel className="font-semibold text-white">Insights</SidebarGroupLabel>
              <SidebarGroupContent className="font-semibold text-white">
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeView === "reports"} onClick={() => setActiveView("reports")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-bar-chart-3"
                      >
                        <path d="M3 3v18h18" />
                        <path d="M18 17V9" />
                        <path d="M13 17V5" />
                        <path d="M8 17v-3" />
                      </svg>
                      <span>Reports</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive={activeView === "kpi-individual"} onClick={() => setActiveView("kpi-individual")}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-user"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>KPI Individual</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {isAdmin && (
                    <>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeView === "kpi"} onClick={() => setActiveView("kpi")}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-pie-chart"
                          >
                            <path d="M21.21 15.89A10 10 0 1 1 8 2.83" />
                            <path d="M22 12A10 10 0 0 0 12 2v10z" />
                          </svg>
                          <span>KPI's por Equipo</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarMenuItem>
                        <SidebarMenuButton isActive={activeView === "kpi-persona"} onClick={() => setActiveView("kpi-persona")}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-user-cog"
                          >
                            <circle cx="12" cy="8" r="4" />
                            <path d="M14.5 19.5a2.5 2.5 0 0 0-5 0" />
                            <rect width="20" height="14" x="2" y="6" rx="2" />
                            <path d="M6 6v.5" />
                            <path d="M10 6v.5" />
                            <path d="M14 6v.5" />
                            <path d="M18 6v.5" />
                            <path d="M6 15.5v.5" />
                            <path d="M10 15.5v.5" />
                            <path d="M14 15.5v.5" />
                            <path d="M18 15.5v.5" />
                            <path d="M6 10v.5" />
                            <path d="M18 10v.5" />
                            <path d="M12 10v.5" />
                          </svg>
                          <span>KPI's por Persona</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t border-[#312c2b] p-4 bg-[#312c2b]">
            <SidebarMenu className="font-semibold text-white">
              <SidebarMenuItem>
                <Link href="/profile-settings" passHref>
                  <SidebarMenuButton>
                    <SettingsIcon className="h-4 w-4" />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 lg:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-4">
              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                  onClick={() => {
                    setProfileOpen(!profileOpen)
                    setNotificationsOpen(false)
                  }}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback className="bg-[#3A3A3A] text-white">
                      {user?.nombre ? user.nombre.charAt(0) : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-block">{user?.nombre || 'Usuario'}</span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {profileOpen && (
                  <div className="absolute top-12 right-0 w-64 rounded-md border border-gray-200 bg-white shadow-md z-10">
                    <div className="flex flex-col gap-1 p-4">
                      <Link href="/profile-settings" passHref>
                        <Button variant="ghost" className="w-full justify-start text-sm">
                          <User className="h-4 w-4 mr-2" />
                          Your profile
                        </Button>
                      </Link>
                      <Link href="/profile-settings" passHref>
                        <Button variant="ghost" className="w-full justify-start text-sm">
                          <Settings className="h-4 w-4 mr-2" />
                          Personal settings
                        </Button>
                      </Link>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start text-sm text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={logout}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-4 lg:p-6">
            {activeView === "profile-settings" ? <UserProfileSettings /> : children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

