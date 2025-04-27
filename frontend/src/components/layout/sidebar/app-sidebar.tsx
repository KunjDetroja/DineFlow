import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Utensils,
  Menu,
  Table,
  Settings,
  LogOut,
  ShoppingCart,
  Calendar,
  FileText,
} from "lucide-react";

import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavUser } from "@/components/layout/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavSecondary } from "./nav-secondary";
import { Link } from "react-router-dom";

const data = {
  user: {
    name: "Admin",
    email: "admin@restaurant.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Table Management",
      url: "/admin/tables",
      icon: Table,
    },
    {
      title: "Menu Management",
      url: "/admin/menu",
      icon: Menu,
    },
    {
      title: "Dishes Management",
      url: "/admin/dishes",
      icon: Utensils,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      title: "Reservations",
      url: "/admin/reservations",
      icon: Calendar,
    },
    {
      title: "Staff",
      url: "/admin/staff",
      icon: Users,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Link to="/admin" className="!w-full flex items-center gap-3">
                <img
                  src="https://placehold.co/30x30"
                  alt="DineFlow"
                  className="min-w-8 min-h-8 rounded-lg shrink-0"
                />
                <span className="text-base font-semibold">DineFlow</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
