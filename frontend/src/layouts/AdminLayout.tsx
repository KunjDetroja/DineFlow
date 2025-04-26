import { Outlet } from "react-router-dom"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  )
} 