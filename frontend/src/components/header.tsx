import { Bell, Moon, Search, Sun, PanelLeftClose } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "./theme-provider";
import { useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { toggleSidebar, state } = useSidebar();

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="flex transition-transform duration-200"
          onClick={toggleSidebar}
        >
          <PanelLeftClose
            className={`absolute h-5 w-5 transition-all duration-200 ${
              state === "expanded" ? "rotate-0" : "-rotate-180"
            }`}
          />
          <span className="sr-only">Toggle sidebar</span>
        </Button>
        <div className="relative w-96 md:flex hidden ml-2">
          <Search className="absolute left-2.5 top-1.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9 max-h-7"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Notifications</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>No new notifications</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className="relative h-9 w-9"
        >
          <div className="relative h-4 w-4">
            <Sun
              className={`absolute h-4 w-4 transition-all duration-300 ${
                theme === "dark"
                  ? "scale-0 rotate-[-180deg] opacity-0"
                  : "scale-100 rotate-0 opacity-100"
              }`}
            />
            <Moon
              className={`absolute h-4 w-4 transition-all duration-300 ${
                theme === "dark"
                  ? "scale-100 rotate-0 opacity-100"
                  : "scale-0 rotate-180 opacity-0"
              }`}
            />
          </div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </div>
  );
}
