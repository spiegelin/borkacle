"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/AuthContext"
import api from "@/lib/api"

export function UserProfileSettings() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.id) {
        try {
          setLoading(true);
          const res = await api.get(`/api/users/${user.id}`);
          setProfile(res.data);
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
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6 text-[#3A3A3A]">Profile & Settings</h1>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/3">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
              <CardDescription>Manage your account information</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src="/placeholder-user.jpg" alt={profile?.nombre || "User"} />
                <AvatarFallback>
                  {profile?.nombre
                    ? profile.nombre.split(" ").map((n: string) => n[0]).join("").toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold">{loading ? "Cargando..." : profile?.nombre || user?.nombre || "-"}</h2>
              <p className="text-sm text-gray-500">{loading ? "" : profile?.email || user?.email || "-"}</p>
              <p className="text-xs text-gray-500 mt-1">Rol: <span className="text-gray-700 font-medium">{profile?.rol || user?.rol || "-"}</span></p>
              {profile?.equipoNombre && (
                <p className="text-xs text-gray-500 mt-1">Equipo: <span className="text-gray-700 font-medium">{profile.equipoNombre}</span></p>
              )}
              <Button className="mt-4 bg-[#C74634] hover:bg-[#b03d2e]">Change Avatar</Button>
            </CardContent>
          </Card>
        </div>
        <div className="w-full md:w-2/3">
        </div>
      </div>
    </div>
  )
}

