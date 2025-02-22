import { useState, useEffect, useCallback } from 'react';
import { authService } from '@/services/auth';
import { usersService } from '@/services/users';
import type { User, LoginDto } from '@/interfaces/user';
import { useToast } from '@/components/ui/use-toast';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const { toast } = useToast();

  const fetchCurrentUser = useCallback(async () => {
    try {
      setLoading(true);
      if (authService.getToken()) {
        const userData = await usersService.getCurrentUser();
        setUser(userData);
        // Update stored user data
        authService.setSession({
          token: authService.getToken()!,
          user: userData,
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
      authService.logout();
      setUser(null);
    } finally {
      setLoading(false);
      setInitialized(true);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  const login = async (credentials: LoginDto) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      toast({
        title: "Success",
        description: "Successfully logged in",
      });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Login failed",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setLoading(true);
    try {
      authService.logout();
      setUser(null);
      toast({
        title: "Success",
        description: "Successfully logged out",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    initialized,
    login,
    logout,
    isAuthenticated: !!user && !!authService.getToken(),
    isAdmin: !!user?.role && user.role === 'ADMIN',
    refetchUser: fetchCurrentUser,
  };
} 