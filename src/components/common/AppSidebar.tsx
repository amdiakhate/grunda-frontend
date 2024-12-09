import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
  } from "@/components/ui/sidebar"
import { HomeIcon, InfoIcon, PackageIcon, SettingsIcon } from "lucide-react"
  

  const items = [
    {
      title: "Dashboard",
      icon: <HomeIcon />,
      url: "/dashboard",
    },
    {
      title: "Products",
      icon: <PackageIcon />,
      url: "/products/list",
    },
    {
      title: "About",
      icon: <InfoIcon />,
      url: "/about",
    },
    {
      title: "Settings",
      icon: <SettingsIcon />,
      url: "/settings",
    },
  ]

  export function AppSidebar() {
    return (
      <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </a>
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
    