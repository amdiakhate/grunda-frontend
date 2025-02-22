export type UserRole = 'ADMIN' | 'CUSTOMER';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  customerId?: string;
  lastLoginAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDto {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  customerId?: string;
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  password?: string;
  email?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

export interface UsersListResponse {
  items: User[];
  total: number;
}

export interface UsersListQueryParams {
  page?: number;
  pageSize?: number;
  role?: UserRole;
  search?: string;
} 