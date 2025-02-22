import { api } from './api';
import type {
  User,
  CreateUserDto,
  UpdateUserDto,
  UsersListResponse,
  UsersListQueryParams,
} from '@/interfaces/user';

export const usersService = {
  async getUsers(params: UsersListQueryParams = {}): Promise<UsersListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.role) queryParams.append('role', params.role);
      if (params.search) queryParams.append('search', params.search);

      const query = queryParams.toString();
      const url = `/users${query ? `?${query}` : ''}`;

      return api.get<UsersListResponse>(url);
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  async getCurrentUser(): Promise<User> {
    try {
      return api.get<User>('/users/me');
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  },

  async getUserById(id: string): Promise<User> {
    try {
      return api.get<User>(`/users/${id}`);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async createUser(data: CreateUserDto): Promise<User> {
    try {
      return api.post<User>('/users', data);
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      return api.put<User>(`/users/${id}`, data);
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  async deleteUser(id: string): Promise<void> {
    try {
      await api.delete<void>(`/users/${id}`);
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }
}; 