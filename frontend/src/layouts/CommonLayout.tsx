import * as React from "react"
import { Header } from "@/components/header"

interface CommonLayoutProps {
  children: React.ReactNode
}

export function CommonLayout({ children }: CommonLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="shrink-0 items-center gap-2 p-2">
        <Header />
      </div>
      <div className="flex-1 p-2">
        {children}
      </div>
    </div>
  )
} 