"use client"

import { type LucideIcon } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

interface NavSubItem {
  title: string
  url: string
  icon?: LucideIcon
}

interface NavItem {
  title: string
  url?: string
  icon?: LucideIcon
  isActive?: boolean
  items?: NavSubItem[]
}

export function NavMain({
  items,
}: {
  items: NavItem[]
}) {
  const location = useLocation()

  return (
    <SidebarMenu className="space-y-1">
      {items.map((item) => {
        if (item.items) {
          return item.items.map((subItem) => (
            <SidebarMenuItem key={subItem.title}>
              <SidebarMenuButton 
                tooltip={subItem.title}
                asChild
                className={cn(
                  "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  location.pathname === subItem.url ? "bg-sidebar-primary hover:bg-sidebar-primary text-sidebar-primary-foreground hover:text-sidebar-primary-foreground" : "text-sidebar-foreground"
                )}
              >
                <Link to={subItem.url} className="w-full flex items-center gap-3">
                  {subItem.icon && <subItem.icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="truncate">{subItem.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))
        }
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton 
              tooltip={item.title}
              asChild
              className={cn(
                "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                location.pathname === item.url ? "bg-sidebar-primary hover:bg-sidebar-primary text-sidebar-primary-foreground hover:text-sidebar-primary-foreground" : "text-sidebar-foreground"
              )}
            >
              {item.url ? (
                <Link to={item.url} className="w-full flex items-center gap-3">
                  {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="truncate">{item.title}</span>
                </Link>
              ) : (
                <div className="w-full flex items-center gap-3">
                  {item.icon && <item.icon className="h-4 w-4 flex-shrink-0" />}
                  <span className="truncate">{item.title}</span>
                </div>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        )
      })}
    </SidebarMenu>
  )
} 