import type React from "react"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import "./globals.css"
import { AuthProvider } from "@/components/auth/AuthContext"
//import { NavigationBar } from "./components/navigation-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Borkacle Dashboard",
  description: "A modern project management dashboard",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          {/* <NavigationBar /> Used only for testing*/}
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

