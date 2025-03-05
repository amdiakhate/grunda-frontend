import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar";
import { adminNavItems } from "@/components/common/AdminNav";
import { useAuthContext } from "@/contexts/AuthContext";
import { ImpersonationBanner } from "@/components/common/ImpersonationBanner";
import type { AuthContextType } from "@/contexts/AuthContext";

export const Route = createRootRoute({
    component: Layout,
    beforeLoad: ({ context: { auth } }: { context: { auth: AuthContextType } }) => {
        const isLoginPage = window.location.pathname === '/login';
        if (!auth.isAuthenticated && !isLoginPage) {
            throw redirect({
                to: '/login',
                state: { from: window.location.pathname },
            });
        }
    },
});

function Layout() {
    const { isAdmin, isAuthenticated } = useAuthContext();
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const isLoginPage = window.location.pathname === '/login';

    // Don't show sidebar on login page or when not authenticated
    if (isLoginPage || !isAuthenticated) {
        return <Outlet />;
    }

    return (
        <div className="flex flex-col min-h-screen">
            <ImpersonationBanner />
            <SidebarProvider className="flex flex-1">
                <AppSidebar items={isAdmin ? adminNavItems : undefined} />
                <SidebarTrigger />

                <main className={`flex flex-col items-center w-full overflow-auto ${isAdminRoute ? 'bg-gray-50' : ''}`}>
                    <div className={`container ${isAdminRoute ? 'py-8 px-4' : 'p-10'} w-full max-w-7xl`}>
                        <Outlet />
                    </div>
                </main>
            </SidebarProvider>
        </div>
    );
}