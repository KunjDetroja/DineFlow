import * as React from "react"
import { Header } from "@/components/layout/header"

interface CommonLayoutProps {
  children: React.ReactNode
}

export function CommonLayout({ children }: CommonLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="h-16 shrink-0 items-center gap-2 bg-background p-2">
        <Header />
      </div>
      <main className="flex-1 p-4 sm:p-6">
        {children}
      </main>
    </div>
  )
} 