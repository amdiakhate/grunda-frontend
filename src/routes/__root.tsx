import { createRootRoute, redirect } from "@tanstack/react-router";
import { SidebarTrigger } from "../components/ui/sidebar";
import { SidebarProvider } from "../components/ui/sidebar";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Outlet } from "@tanstack/react-router";
import { AppSidebar } from "../components/common/AppSidebar";
import { adminNavItems } from "../components/common/AdminNav";

export const Route = createRootRoute({
    component: Layout,
    beforeLoad: () => {
        // Redirect root path to dashboard
        if (window.location.pathname === '/') {
            throw redirect({
                to: '/dashboard'
            })
        }
    }
})

function Layout() {
    // Check if we're in the admin section
    const isAdmin = window.location.pathname.startsWith('/admin');

    return (
        <SidebarProvider>
            <AppSidebar items={isAdmin ? adminNavItems : undefined} />
            <SidebarTrigger />

            <main className={`flex flex-col items-center w-full ${isAdmin ? 'bg-gray-50' : ''}`}>
                <div className={`container ${isAdmin ? 'py-8 px-4' : 'p-10'} w-full max-w-7xl`}>
                    <Outlet />
                </div>
            </main>
            <TanStackRouterDevtools />
        </SidebarProvider>
    )
}