import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
  } from "@/components/ui/sidebar"
import { HomeIcon, InfoIcon, PackageIcon, SettingsIcon, LogOutIcon, UserIcon, LucideIcon, UploadIcon } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthContext } from "@/contexts/AuthContext"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const defaultItems = [
  {
    name: "Dashboard",
    icon: HomeIcon,
    href: "/dashboard",
  },
  {
    name: "Products",
    icon: PackageIcon,
    href: "/products/list",
  },
  {
    name: "Upload Products",
    icon: UploadIcon,
    href: "/products/steps/upload-file",
  },
  {
    name: "About",
    icon: InfoIcon,
    href: "/about",
  },
  {
    name: "Settings",
    icon: SettingsIcon,
    href: "/settings",
  },
]

interface AppSidebarProps {
  items?: Array<{
    name: string;
    icon: LucideIcon;
    href: string;
  }>;
}

export function AppSidebar({ items = defaultItems }: AppSidebarProps) {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();

  // Fonction pour obtenir les initiales
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' });
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton asChild>
                    <Link to={item.href}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {user && (
        <SidebarFooter>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <div className="flex items-center gap-3 px-3 py-2 min-h-[48px] hover:bg-muted/50 transition-colors">
                <Avatar>
                  <AvatarFallback>
                    {getInitials(user.firstName, user.lastName)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuItem asChild>
                <Link to="/profile" className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center">
                  <SettingsIcon className="h-4 w-4 mr-2" />
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="flex items-center text-red-600">
                <LogOutIcon className="h-4 w-4 mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      )}
    </Sidebar>    
  )
}
    