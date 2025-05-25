import { Home, Settings, Users, FileText, Calendar } from "lucide-react"
import { type BreadcrumbConfig } from "@/hooks/use-breadcrumb"

export const breadcrumbConfig: BreadcrumbConfig = {
  dashboard: {
    label: "Dashboard",
    icon: Home,
  },
  tables: {
    label: "Tables",
    children: {
      add: {
        label: "Add",
      },
      edit: {
        label: "Edit",
      },
    },
  },
  menu: {
    label: "Menu",
    icon: FileText,
  },
  dishes: {
    label: "Dishes",
    icon: FileText,
  },
  orders: {
    label: "Orders",
    icon: FileText,
  },
  reservations: {
    label: "Reservations",
    icon: Calendar,
  },
  staff: {
    label: "Staff",
    icon: Users,
  },
  reports: {
    label: "Reports",
    icon: FileText,
  },
  settings: {
    label: "Settings",
    icon: Settings,
  },
} 