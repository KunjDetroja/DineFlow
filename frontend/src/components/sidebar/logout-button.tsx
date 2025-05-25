import * as React from "react"
import { LogOut } from "lucide-react"
import { useNavigate } from "react-router-dom"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function LogoutButton() {
  const navigate = useNavigate()
  const [showLogoutDialog, setShowLogoutDialog] = React.useState(false)

  const handleLogout = () => {
    // Add your logout logic here
    navigate("/login")
  }

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton
          asChild
          tooltip="Logout"
          onClick={() => setShowLogoutDialog(true)}
        >
          <div className="flex items-center gap-2">
            <LogOut />
            <span className="ml-1 -mt-0.5">
              Logout
            </span>
          </div>
        </SidebarMenuButton>
      </SidebarMenuItem>

      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You will need to login again to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button
              size={"sm"}
              variant="outline" 
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button
              size={"sm"}
              variant="destructive" 
              onClick={handleLogout}
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
} 