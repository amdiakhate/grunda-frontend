import { useState, useCallback } from 'react';
import { adminService } from '@/services/admin';
import { useToast } from '@/hooks/use-toast';

export interface Customer {
  id: string;
  fullName: string;
  email: string;
}

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const stats = await adminService.getDashboardStats();
      
      // Transformer les statistiques des clients en liste de clients
      const customersList = stats.users.customerStats.map(customer => ({
        id: customer.id,
        fullName: customer.name,
        email: '' // L'email n'est pas disponible dans les statistiques
      }));
      
      setCustomers(customersList);
    } catch (error) {
      console.error('Failed to fetch customers:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load customers. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    customers,
    loading,
    fetchCustomers,
  };
} 