import { useEffect } from 'react';
import { useNavigate, useRouter } from '@tanstack/react-router';
import { useAuthContext } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isAuthenticated, isAdmin, loading, initialized, user } = useAuthContext();
  const navigate = useNavigate();
  const router = useRouter();
  const currentPath = router.state.location.pathname;

  useEffect(() => {
    if (!initialized) return;

    if (currentPath === '/login') {
      if (isAuthenticated && user) {
        navigate({ to: user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard' });
      }
      return;
    }

    if (!isAuthenticated) {
      navigate({ to: '/login', state: { from: currentPath } });
      return;
    }

    if (requireAdmin && !isAdmin) {
      navigate({ to: '/dashboard' });
    }
  }, [initialized, isAuthenticated, isAdmin, currentPath, navigate, user, requireAdmin]);

  // Afficher le loader par défaut sauf si toutes les conditions sont remplies
  if (!initialized || loading || !isAuthenticated || (requireAdmin && !isAdmin)) {
    return <LoadingScreen />;
  }

  // Pour la page de login, on affiche le contenu uniquement si on n'est pas authentifié
  if (currentPath === '/login') {
    return isAuthenticated ? <LoadingScreen /> : <>{children}</>;
  }

  // On affiche le contenu uniquement si toutes les conditions sont remplies
  return <>{children}</>;
} 