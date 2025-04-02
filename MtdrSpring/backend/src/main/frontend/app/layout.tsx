import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { NavigationBar } from "./components/navigation-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Oracle Cloud Tasks",
  description: "Project management tool for Oracle Cloud",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <NavigationBar />
        {children}
      </body>
    </html>
  )
}

