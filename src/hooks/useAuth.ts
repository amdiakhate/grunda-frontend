import { useState, useEffect, useCallback, useRef } from 'react';
import { authService } from '@/services/auth';
import { usersService } from '@/services/users';
import type { User, LoginDto, ImpersonateDto } from '@/interfaces/user';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => authService.getStoredUser());
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);
  const initializationInProgress = useRef(false);

  const fetchCurrentUser = useCallback(async () => {
    if (initializationInProgress.current) return;
    
    try {
      initializationInProgress.current = true;
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
      initializationInProgress.current = false;
    }
  }, []);

  useEffect(() => {
    if (!initialized && !initializationInProgress.current) {
      fetchCurrentUser();
    }
  }, [fetchCurrentUser, initialized]);

  const login = async (credentials: LoginDto) => {
    try {
      setLoading(true);
      const response = await authService.login(credentials);
      setUser(response.user);
      setInitialized(true);
      // toast({
      //   title: "Success",
      //   description: "Successfully logged in",
      // });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Login failed",
      // });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const impersonate = async (data: ImpersonateDto) => {
    try {
      setLoading(true);
      const response = await authService.impersonate(data);
      setUser(response.user);
      // toast({
      //   title: "Success",
      //   description: `Successfully impersonating ${response.user.firstName} ${response.user.lastName}`,
      // });
      return response;
    } catch (error) {
      console.error('Impersonation failed:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Impersonation failed",
      // });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const stopImpersonating = async () => {
    try {
      setLoading(true);
      await authService.stopImpersonating();
      await fetchCurrentUser();
      // toast({
      //   title: "Success",
      //   description: "Successfully stopped impersonating",
      // });
    } catch (error) {
      console.error('Failed to stop impersonating:', error);
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: error instanceof Error ? error.message : "Failed to stop impersonating",
      // });
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
      // toast({
      //   title: "Success",
      //   description: "Successfully logged out",
      // });
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
    impersonate,
    stopImpersonating,
    isAuthenticated: !!user && !!authService.getToken(),
    isAdmin: !!user?.role && user.role === 'ADMIN',
    isImpersonating: authService.isImpersonating(),
    refetchUser: fetchCurrentUser,
  };
} 