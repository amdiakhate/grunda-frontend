import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { HomeIcon, InfoIcon, PackageIcon, SettingsIcon, LucideIcon } from "lucide-react"
import { Link } from "@tanstack/react-router"

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
    </Sidebar>    
  )
}
    