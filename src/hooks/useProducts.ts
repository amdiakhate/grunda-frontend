import { useState, useCallback } from 'react';
import { adminService } from '@/services/admin';
import type {
  Product,
  ReviewProductDto,
  ProductsListQueryParams,
  ReviewStats,
} from '@/interfaces/product';
import { useToast } from '@/components/ui/use-toast';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const { toast } = useToast();

  const fetchStats = useCallback(async () => {
    try {
      const stats = await adminService.getProductStats();
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch product stats:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product statistics",
      });
    }
  }, [toast]);

  const fetchProducts = useCallback(async (params: ProductsListQueryParams = {}) => {
    try {
      setLoading(true);
      const response = await adminService.getProducts({
        page: 1,
        pageSize: 10,
        ...params
      });
      setProducts(response.items);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load products. Please try again.",
      });
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchPendingProducts = useCallback(async (customerId: string) => {
    try {
      setLoading(true);
      const products = await adminService.getPendingProductsByCustomer(customerId);
      setProducts(products);
      setTotal(products.length);
    } catch (error) {
      console.error('Failed to fetch pending products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load pending products. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const reviewProduct = useCallback(async (productId: string, reviewData: ReviewProductDto, refreshList: boolean = true) => {
    try {
      setLoading(true);
      const result = await adminService.reviewProduct(productId, reviewData);
      
      if (result.success) {
        // Only refresh the products list if requested
        if (refreshList) {
          await fetchProducts();
        }
        
        toast({
          title: "Success",
          description: result.message || 'Product reviewed successfully',
        });
      }

      return result;
    } catch (error) {
      console.error('Failed to review product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to review product",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchProducts]);

  const getProductById = useCallback(async (id: string): Promise<Product | null> => {
    try {
      return await adminService.getProductById(id);
    } catch (error) {
      // Check if it's a 404 error
      if (error instanceof Error && error.message.includes('404')) {
        console.log('Product not found:', id);
        return null;
      }
      console.error('Failed to fetch product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product details",
      });
      throw error;
    }
  }, [toast]);

  return {
    products,
    loading,
    total,
    stats,
    fetchProducts,
    fetchPendingProducts,
    reviewProduct,
    fetchStats,
    getProductById,
  };
} 