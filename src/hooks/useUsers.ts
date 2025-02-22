import { useState, useCallback } from 'react';
import { usersService } from '@/services/users';
import type { User, CreateUserDto, UpdateUserDto, UsersListQueryParams } from '@/interfaces/user';
import { useToast } from '@/components/ui/use-toast';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const { toast } = useToast();

  const fetchUsers = useCallback(async (params: UsersListQueryParams = {}) => {
    try {
      setLoading(true);
      const response = await usersService.getUsers(params);
      const usersList = Array.isArray(response) ? response : [];
      setUsers(usersList);
      setTotal(usersList.length);
    } catch (error) {
      console.error('Failed to fetch users:', error);
      setUsers([]);
      setTotal(0);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load users. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createUser = async (data: CreateUserDto) => {
    try {
      setLoading(true);
      const newUser = await usersService.createUser(data);
      setUsers(prev => [...prev, newUser]);
      setTotal(prev => prev + 1);
      toast({
        title: "Success",
        description: "User created successfully",
      });
      return newUser;
    } catch (error) {
      console.error('Failed to create user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create user",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, data: UpdateUserDto) => {
    try {
      setLoading(true);
      const updatedUser = await usersService.updateUser(id, data);
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user));
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      return updatedUser;
    } catch (error) {
      console.error('Failed to update user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update user",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    try {
      setLoading(true);
      await usersService.deleteUser(id);
      setUsers(prev => prev.filter(user => user.id !== id));
      setTotal(prev => prev - 1);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Failed to delete user:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete user",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    users,
    loading,
    total,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser,
  };
} 