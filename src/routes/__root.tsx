import { createRootRoute,   } from "@tanstack/react-router";
import { SidebarTrigger } from "../components/ui/sidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "../components/common/AppSidebar";



export const Route = createRootRoute({
    component: Layout,
})

function Layout ( ) {

    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarTrigger />

            <main className="flex flex-col items-center w-full">
                <div className="container p-10 w-full max-w-7xl">
                    <Outlet />
                </div>
            </main>
            <TanStackRouterDevtools />
        </SidebarProvider>
        
    )
}