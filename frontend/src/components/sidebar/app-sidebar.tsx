import * as React from "react";
import {
  LayoutDashboard,
  Users,
  Utensils,
  Menu,
  Table,
  // Settings,
  LogOut,
  ShoppingCart,
  Calendar,
  MessageSquare,
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
import { useSelector } from "react-redux";
import { ADMIN, CHEF, MANAGER, OWNER, WAITER } from "@/utils/constant";

const data = {
  navSecondary: [
    // {
    //   title: "Settings",
    //   url: "/settings",
    //   icon: Settings,
    // },
    {
      title: "Logout",
      url: "/logout",
      icon: LogOut,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const userData = useSelector((state: any) => state.user);
  const isAdmin = userData?.role === ADMIN;
  const isOwner = userData?.role === OWNER;
  const isManager = userData?.role === MANAGER;
  const isWaiter = userData?.role === WAITER;
  const isChef = userData?.role === CHEF;
  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutDashboard,
    },
    ...(isAdmin
      ? [
          {
            title: "Restaurants",
            url: "/restaurants",
            icon: Utensils,
          },
        ]
      : []),
    ...(isAdmin || isOwner || isManager
      ? [
          {
            title: "Staff",
            url: "/staff",
            icon: Users,
          },
        ]
      : []),
    ...(isAdmin || isOwner
      ? [
          {
            title: "Outlets",
            url: "/outlets",
            icon: Utensils,
          },
        ]
      : []),
    ...(isAdmin || isOwner || isManager || isWaiter || isChef
      ? [
          {
            title: "Tables",
            url: "/tables",
            icon: Table,
          },
        ]
      : []),
    ...(isAdmin || isOwner || isManager || isWaiter || isChef
      ? [
          {
            title: "Menu",
            url: "/menu",
            icon: Menu,
          },
        ]
      : []),
    ...(isAdmin || isOwner || isManager || isWaiter || isChef
      ? [
          {
            title: "Dishes",
            url: "/dishes",
            icon: Utensils,
          },
        ]
      : []),
    ...(isAdmin || isOwner || isManager || isWaiter || isChef
      ? [
          {
            title: "Orders",
            url: "/orders",
            icon: ShoppingCart,
          },
        ]
      : []),
    ...(isAdmin || isOwner || isManager || isWaiter
      ? [
          {
            title: "Reservations",
            url: "/reservations",
            icon: Calendar,
          },
        ]
      : []),
    // {
    //   title: "Reports",
    //   url: "/reports",
    //   icon: FileText,
    // },
    ...(isAdmin
      ? [
          {
            title: "Inquiries",
            url: "/inquiries",
            icon: MessageSquare,
          },
        ]
      : []),
  ];
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg">
              <Link
                to="/"
                className="!w-full flex items-center gap-3 text-primary"
              >
                <img
                  src="https://imgs.search.brave.com/4N4a0wN10F4CKjlVcVoTsCr1TpXVEwq-UjwsWK6jkV0/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9yZXMu/Y2xvdWRpbmFyeS5j/b20vemVuYnVzaW5l/c3MvcV9hdXRvLHdf/MzUwL3YxL3NoYXJl/ZC1hc3NldHMvc3Rr/L3Jlc3RhdXJhbnQt/bG9nby13aXRoLWZv/cmstYW5kLXNwb29u/LmpwZw"
                  alt="DineFlow"
                  className="min-w-8 min-h-8 w-8 h-8 object-cover rounded-lg shrink-0"
                />
                <span className="text-base font-semibold -mt-0.5">
                  DineFlow
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData.data} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
