import { Outlet } from "react-router-dom"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { CommonLayout } from "./CommonLayout"

export function AdminLayout() {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <CommonLayout>
          <Outlet />
        </CommonLayout>
      </SidebarInset>
    </SidebarProvider>
  )
} 