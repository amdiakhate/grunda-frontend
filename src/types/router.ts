import type { AuthContextType } from '@/contexts/AuthContext';

declare module '@tanstack/react-router' {
  interface Register {
    router: {
      context: {
        auth: AuthContextType;
      };
    };
  }

  interface HistoryState {
    from?: string;
  }
} 