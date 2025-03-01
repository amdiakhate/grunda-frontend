import { api } from './api';
import type { LoginDto, LoginResponse, User, ImpersonateDto } from '@/interfaces/user';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';
const ORIGINAL_USER_KEY = 'original_user';

interface StoredSession {
  token: string;
  user: User;
}

export const authService = {
  async login(credentials: LoginDto): Promise<LoginResponse> {
    console.log('🔑 Login attempt with:', credentials.email);
    try {
      const response = await api.post<LoginResponse>('/auth/login', credentials);
      console.log('📥 Login response:', { success: !!response.access_token, hasUser: !!response.user });
      
      if (!response.access_token || !response.user) {
        console.error('❌ Invalid response:', { hasToken: !!response.access_token, hasUser: !!response.user });
        throw new Error('Invalid response from server: missing token or user data');
      }

      // Store the token and user data
      this.setSession({
        token: response.access_token,
        user: response.user,
      });
      console.log('✅ Session stored successfully');
      
      return response;
    } catch (error) {
      this.clearSession(); // Clear any existing invalid session
      console.error('❌ Login failed:', error);
      throw error;
    }
  },

  async impersonate(data: ImpersonateDto): Promise<LoginResponse> {
    console.log('👥 Impersonation attempt for user:', data.userId);
    try {
      const response = await api.post<LoginResponse>('/auth/impersonate', data);
      console.log('📥 Impersonation response:', { success: !!response.access_token, hasUser: !!response.user });

      if (!response.access_token || !response.user) {
        console.error('❌ Invalid response:', { hasToken: !!response.access_token, hasUser: !!response.user });
        throw new Error('Invalid response from server: missing token or user data');
      }

      // Store the original user before impersonation
      const currentUser = this.getStoredUser();
      if (currentUser) {
        localStorage.setItem(ORIGINAL_USER_KEY, JSON.stringify(currentUser));
      }

      // Store the impersonated session
      this.setSession({
        token: response.access_token,
        user: response.user,
      });
      console.log('✅ Impersonation session stored successfully');

      return response;
    } catch (error) {
      console.error('❌ Impersonation failed:', error);
      throw error;
    }
  },

  async stopImpersonating(): Promise<void> {
    console.log('🔄 Stopping impersonation');
    try {
      const originalUser = localStorage.getItem(ORIGINAL_USER_KEY);
      if (!originalUser) {
        console.error('❌ No original user found');
        throw new Error('No original user found');
      }

      const user = JSON.parse(originalUser);
      // Restore the original session
      await this.login({ email: user.email, password: '' }); // The backend should handle this special case
      localStorage.removeItem(ORIGINAL_USER_KEY);
      console.log('✅ Original session restored successfully');
    } catch (error) {
      console.error('❌ Failed to stop impersonation:', error);
      throw error;
    }
  },

  logout() {
    console.log('🚪 Logout initiated');
    // First clear the session locally
    this.clearSession();
    
    // Then notify the server
    api.post('/auth/logout', {})
      .then(() => console.log('✅ Server logout successful'))
      .catch(error => {
        console.error('⚠️ Server logout failed:', error);
        // Even if the server request fails, we keep the session cleared locally
      });
  },

  setSession(session: StoredSession) {
    console.log('💾 Storing session:', { userId: session.user.id, hasToken: !!session.token });
    try {
      localStorage.setItem(TOKEN_KEY, session.token);
      localStorage.setItem(USER_KEY, JSON.stringify(session.user));
    } catch (error) {
      console.error('❌ Failed to save session:', error);
      this.clearSession();
      throw new Error('Failed to save session');
    }
  },

  clearSession() {
    console.log('🗑️ Clearing session');
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(ORIGINAL_USER_KEY);
  },

  getToken(): string | null {
    const token = localStorage.getItem(TOKEN_KEY);
    console.log('🎫 Get token:', { exists: !!token });
    return token;
  },

  getStoredUser(): User | null {
    console.log('👤 Getting stored user');
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) {
        console.log('ℹ️ No user found in storage');
        return null;
      }
      
      const user = JSON.parse(userStr);
      // Basic validation of user object
      if (!user || typeof user !== 'object' || !user.id || !user.role) {
        console.error('❌ Invalid user data in storage');
        throw new Error('Invalid user data in storage');
      }
      
      console.log('✅ User retrieved:', { id: user.id, role: user.role });
      return user;
    } catch (error) {
      console.error('❌ Error getting stored user:', error);
      this.clearSession(); // Clear invalid session data
      return null;
    }
  },

  isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getStoredUser();
    const isAuth = !!(token && user);
    console.log('🔒 Auth check:', { hasToken: !!token, hasUser: !!user, isAuthenticated: isAuth });
    return isAuth;
  },

  hasAdminAccess(): boolean {
    try {
      const user = this.getStoredUser();
      const isAdmin = user?.role === 'ADMIN';
      console.log('👑 Admin check:', { hasUser: !!user, role: user?.role, isAdmin });
      return isAdmin;
    } catch {
      return false;
    }
  },

  isImpersonating(): boolean {
    return !!localStorage.getItem(ORIGINAL_USER_KEY);
  }
}; 