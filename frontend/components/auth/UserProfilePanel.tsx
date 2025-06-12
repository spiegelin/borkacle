"use client"

import { LogOut, Settings, User } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useAuth } from "@/components/auth/AuthContext"
import { useEffect, useState } from "react"
import api from "@/lib/api"

export function UserProfilePanel() {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const res = await api.get(`/api/users/${user.id}`);
          setProfile(res.data);
          console.log(res.data);
        } catch (e) {
          setProfile(null);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <Card className="absolute right-0 top-12 w-64 z-50 shadow-lg">
      <div className="p-4 flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="/placeholder-user.jpg" alt="User" />
          <AvatarFallback className="bg-[#1A4F9C] text-white">
            {profile?.nombre ? profile.nombre.split(' ').map((p: string) => p[0]).join('').toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">
            {loading ? "Cargando..." : profile?.nombre || user?.nombre || "-"}
          </p>
          <p className="text-xs text-gray-500">
            {loading ? "" : profile?.email || user?.email || "-"}
          </p>
        </div>
      </div>
      <Separator />
      <div className="px-4 py-2">
        <p className="text-xs text-gray-500 mb-1">Rol: <span className="text-gray-700 font-medium">{profile?.rol || user?.rol || "-"}</span></p>
        {profile?.equipoNombre && (
          <p className="text-xs text-gray-500 mb-1">Equipo: <span className="text-gray-700 font-medium">{profile.equipoNombre}</span></p>
        )}
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
          onClick={logout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign out
        </Button>
      </div>
    </Card>
  )
}

