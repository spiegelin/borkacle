"use client"

import { LogOut, Settings, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

export function UserProfilePanel() {
  return (
    <Card className="absolute right-0 top-12 w-64 z-50 shadow-lg">
      <div className="p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-[#1A4F9C] text-white">JD</AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">John Doe</p>
          <p className="text-xs text-gray-500">john.doe@oracle.com</p>
        </div>
      </div>
      <Separator />
      <div className="p-2">
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
      </div>
      <Separator />
      <div className="p-2">
        <Button
          variant="ghost"
          className="w-full justify-start text-sm text-red-500 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </Card>
  )
}

