import * as React from "react";
import {
  Calendar,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  ShoppingCart,
  Table,
  Users,
  Utensils,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
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
import { NavMain } from "./layout/sidebar/nav-main";
import { Link } from "react-router-dom";

// This is sample data.
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
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5 h-fit"
            >
              <Link to="/admin" className="w-full flex items-center gap-3">
                <img
                  src="https://placehold.co/30x30"
                  alt="DineFlow"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-base font-semibold">DineFlow</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
