"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export function NavigationBar() {
  const pathname = usePathname()

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-[#F7630C] flex items-center justify-center text-white font-bold text-xl">
            O
          </div>
          <div className="font-semibold text-xl text-[#3A3A3A]">Oracle Cloud Tasks</div>
        </div>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className={`text-sm ${pathname === "/" ? "text-[#F7630C]" : "text-[#3A3A3A]"} hover:text-[#F7630C] transition-colors`}
          >
            Dashboard
          </Link>
          <Link
            href="/welcome"
            className={`text-sm ${pathname === "/welcome" ? "text-[#F7630C]" : "text-[#3A3A3A]"} hover:text-[#F7630C] transition-colors`}
          >
            Welcome
          </Link>
          <Link
            href="/landing"
            className={`text-sm ${pathname === "/landing" ? "text-[#F7630C]" : "text-[#3A3A3A]"} hover:text-[#F7630C] transition-colors`}
          >
            Landing
          </Link>
          <Link
            href="/profile-settings"
            className={`text-sm ${pathname === "/profile-settings" ? "text-[#F7630C]" : "text-[#3A3A3A]"} hover:text-[#F7630C] transition-colors`}
          >
            Profile
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/login" passHref>
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/signup" passHref>
            <Button size="sm" className="bg-[#F7630C] hover:bg-[#E25A00]">
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}

