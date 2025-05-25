"use client"

import * as React from "react"
import { Link, useLocation } from "react-router-dom"
import { LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { LogoutButton } from "./logout-button"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: LucideIcon
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            item.title === "Logout" ? (
              <LogoutButton key={item.title} />
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton 
                  asChild
                  isActive={location.pathname === item.url}
                  tooltip={item.title}
                >
                  <Link to={item.url}>
                    <item.icon />
                    <span className="ml-1 -mt-0.5">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
} 