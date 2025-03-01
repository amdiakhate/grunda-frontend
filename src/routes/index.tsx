import { createFileRoute, redirect } from '@tanstack/react-router';
import type { AuthContextType } from '@/contexts/AuthContext';

export const Route = createFileRoute('/')({
  beforeLoad: ({ context: { auth } }: { context: { auth: AuthContextType } }) => {
    if (!auth.isAuthenticated) {
      throw redirect({
        to: '/login',
      });
    }

    // Redirect to admin dashboard if user is admin, otherwise to user dashboard
    throw redirect({
      to: auth.isAdmin ? '/admin/dashboard' : '/dashboard',
    });
  },
}); 