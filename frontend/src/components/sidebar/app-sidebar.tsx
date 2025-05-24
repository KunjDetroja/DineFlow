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
import { NavMain } from "@/components/sidebar/nav-main";
import { NavUser } from "@/components/sidebar/nav-user";
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
      url: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Table Management",
      url: "/tables",
      icon: Table,
    },
    {
      title: "Menu Management",
      url: "/menu",
      icon: Menu,
    },
    {
      title: "Dishes Management",
      url: "/dishes",
      icon: Utensils,
    },
    {
      title: "Orders",
      url: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Reservations",
      url: "/reservations",
      icon: Calendar,
    },
    {
      title: "Staff",
      url: "/staff",
      icon: Users,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
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
              <Link to="/" className="!w-full flex items-center gap-3 text-primary">
                <img
                  src="https://placehold.co/30x30"
                  alt="DineFlow"
                  className="min-w-8 min-h-8 rounded-lg shrink-0"
                />
                <span className="text-base font-semibold -mt-0.5">DineFlow</span>
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
