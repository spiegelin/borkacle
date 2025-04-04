"use client"

import { useState } from "react"
import { Bell, BellOff, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NotificationsPanelProps {
  setNotificationCount: (count: number | ((prev: number) => number)) => void
}

export function NotificationsPanel({ setNotificationCount }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState([
    { id: 1, type: "mention", read: false, content: "John mentioned you in ORA-2345", time: "5m ago" },
    { id: 2, type: "assigned", read: false, content: "You were assigned to ORA-2346", time: "15m ago" },
    { id: 3, type: "comment", read: false, content: "New comment on ORA-2347", time: "1h ago" },
    { id: 4, type: "status", read: false, content: "ORA-2348 moved to Done", time: "3h ago" },
    { id: 5, type: "mention", read: false, content: "Sarah mentioned you in ORA-2349", time: "5h ago" },
  ])

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
    setNotificationCount(0)
  }

  const markAsRead = (id: number) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
    setNotificationCount((prev: number) => Math.max(0, prev - 1))
  }

  const dismissNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id))
    setNotificationCount((prev: number) => Math.max(0, prev - 1))
  }

  return (
    <Card className="absolute right-0 top-12 w-80 md:w-96 z-50 shadow-lg">
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h3 className="font-semibold text-[#3A3A3A]">Notifications</h3>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={markAllAsRead}>
            <Check className="h-4 w-4 mr-1" />
            <span className="text-xs">Mark all read</span>
          </Button>
          <Button variant="ghost" size="icon">
            <BellOff className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="mentions">Mentions</TabsTrigger>
          <TabsTrigger value="assigned">Assigned</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="max-h-[400px] overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 flex items-start gap-3 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                >
                  <div className="mt-0.5">
                    {notification.type === "mention" && (
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-[#C74634]">
                        <span className="text-xs font-semibold">@</span>
                      </div>
                    )}
                    {notification.type === "assigned" && (
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
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
                          className="lucide lucide-user-plus"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" x2="19" y1="8" y2="14" />
                          <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                      </div>
                    )}
                    {notification.type === "comment" && (
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
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
                          className="lucide lucide-message-square"
                        >
                          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                        </svg>
                      </div>
                    )}
                    {notification.type === "status" && (
                      <div className="h-8 w-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
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
                          className="lucide lucide-git-branch"
                        >
                          <line x1="6" x2="6" y1="3" y2="15" />
                          <circle cx="18" cy="6" r="3" />
                          <circle cx="6" cy="18" r="3" />
                          <path d="M18 9a9 9 0 0 1-9 9" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{notification.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                  </div>
                  <div className="flex gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                      >
                        <Check className="h-3 w-3" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => dismissNotification(notification.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No notifications</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="mentions" className="max-h-[400px] overflow-y-auto">
          {notifications.filter((n) => n.type === "mention").length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications
                .filter((n) => n.type === "mention")
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 flex items-start gap-3 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center text-[#C74634]">
                        <span className="text-xs font-semibold">@</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No mention notifications</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="assigned" className="max-h-[400px] overflow-y-auto">
          {notifications.filter((n) => n.type === "assigned").length > 0 ? (
            <div className="divide-y divide-gray-100">
              {notifications
                .filter((n) => n.type === "assigned")
                .map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 flex items-start gap-3 hover:bg-gray-50 ${!notification.read ? "bg-blue-50" : ""}`}
                  >
                    <div className="mt-0.5">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
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
                          className="lucide lucide-user-plus"
                        >
                          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                          <circle cx="9" cy="7" r="4" />
                          <line x1="19" x2="19" y1="8" y2="14" />
                          <line x1="22" x2="16" y1="11" y2="11" />
                        </svg>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{notification.content}</p>
                      <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                    </div>
                    <div className="flex gap-1">
                      {!notification.read && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => markAsRead(notification.id)}
                        >
                          <Check className="h-3 w-3" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => dismissNotification(notification.id)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="p-6 text-center">
              <Bell className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No assignment notifications</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className="p-3 border-t border-gray-200">
        <Button variant="link" className="w-full text-[#C74634]">
          View all notifications
        </Button>
      </div>
    </Card>
  )
}

