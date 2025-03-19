import { createRootRoute, Outlet, redirect } from "@tanstack/react-router";
import { SidebarTrigger, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/common/AppSidebar";
import { adminNavItems } from "@/components/common/AdminNav";
import { useAuthContext } from "@/contexts/AuthContext";
import { ImpersonationBanner } from "@/components/common/ImpersonationBanner";
import type { AuthContextType } from "@/contexts/AuthContext";
import { useEffect } from "react";

export const Route = createRootRoute({
    component: Layout,
    beforeLoad: ({ context: { auth } }: { context: { auth: AuthContextType } }) => {
        console.log('[Root] beforeLoad called', { path: window.location.pathname });
        // Ne pas rediriger si l'authentification n'est pas encore initialisée
        if (!auth.initialized) {
            return;
        }
        
        const isLoginPage = window.location.pathname === '/login';
        
        // Si l'utilisateur n'est pas authentifié et n'est pas sur la page de connexion, rediriger vers la page de connexion
        if (!auth.isAuthenticated && !isLoginPage) {
            console.log('[Root] Redirecting to login');
            throw redirect({
                to: '/login',
                state: { from: window.location.pathname },
            });
        }
        
        // Si l'utilisateur est authentifié et est sur la page de connexion, rediriger vers le tableau de bord approprié
        if (auth.isAuthenticated && isLoginPage) {
            console.log('[Root] Redirecting to dashboard');
            throw redirect({
                to: auth.isAdmin ? '/admin/dashboard' : '/dashboard',
            });
        }
    },
});

function Layout() {
    const { isAdmin, isAuthenticated, loading, initialized } = useAuthContext();
    const isAdminRoute = window.location.pathname.startsWith('/admin');
    const isLoginPage = window.location.pathname === '/login';

    useEffect(() => {
        console.log('[Root] Layout mounted/updated', {
            path: window.location.pathname,
            isAuthenticated,
            isAdmin,
            loading,
            initialized
        });
    });

    // Afficher un indicateur de chargement pendant l'initialisation
    if (!initialized || loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <>
            {/* Don't show sidebar on login page or when not authenticated */}
            {isLoginPage || !isAuthenticated ? (
                <Outlet />
            ) : (
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
            )}
        </>
    );
}