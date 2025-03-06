import { api } from './api';
import type {
  MaterialListQueryParams,
  MaterialsListResponse,
  MaterialDetails,
} from '../interfaces/admin';
import type {
  Product,
  PaginatedProductsResponse,
  ReviewProductDto,
  ReviewStats,
  ProductsListQueryParams,
} from '../interfaces/product';
import type {
  MaterialMappingSearchParams,
  PaginatedMaterialMappings,
} from '../interfaces/materialMapping';

export interface DashboardStats {
  products: {
    total: number;
    pending: number;
    reviewed: number;
    rejected: number;
    completionRate: number;
  };
  materials: {
    total: number;
    mapped: number;
    unmapped: number;
    mappingRate: number;
  };
  mappings: {
    total: number;
    mostUsed: Array<{
      materialPattern: string;
      count: number;
    }>;
  };
  users: {
    total: number;
    admins: number;
    customers: number;
    activeCustomers: number;
    customerStats: Array<{
      id: string;
      name: string;
      productsCount: number;
      pendingReviews: number;
      lastActivity: string;
    }>;
  };
  recentActivity: Array<{
    type: string;
    action: string;
    itemId: string;
    itemName: string;
    date: string;
  }>;
}

export const adminService = {
  async getMaterials(params: MaterialListQueryParams = {}): Promise<MaterialsListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.showMapped !== undefined) queryParams.append('showMapped', params.showMapped.toString());

      const query = queryParams.toString();
      const url = `/admin/materials${query ? `?${query}` : ''}`;

      return api.get<MaterialsListResponse>(url);
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },

  async getMaterialById(id: string): Promise<MaterialDetails> {
    try {
      return api.get<MaterialDetails>(`/admin/materials/${id}`);
    } catch (error) {
      console.error('Error fetching material details:', error);
      throw error;
    }
  },

  async getMaterialMappings(params: MaterialMappingSearchParams = {}): Promise<PaginatedMaterialMappings> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.query) queryParams.append('search', params.query);

      const query = queryParams.toString();
      const url = `/admin/material-mappings${query ? `?${query}` : ''}`;

      return api.get<PaginatedMaterialMappings>(url);
    } catch (error) {
      console.error('Error fetching material mappings:', error);
      throw error;
    }
  },

  async matchMaterial(materialId: string, mappingId: string): Promise<{
    success: boolean;
    message: string;
    material: {
      id: string;
      name: string;
      quantity: number;
      unit: string;
    };
    mapping: {
      id: string;
      materialPattern: string;
      alternateNames: string[];
      finalProduct: boolean;
    };
    activity: {
      uuid: string;
      name: string;
      unit: string;
      location: string;
      referenceProduct: string;
    };
    transformation?: {
      uuid: string;
      name: string;
      unit: string;
      location: string;
      referenceProduct: string;
    };
  }> {
    try {
      return api.post(`/admin/materials/${materialId}/match`, {
        mappingId,
      });
    } catch (error) {
      console.error('Error matching material:', error);
      throw error;
    }
  },

  async updateMaterialMapping(materialId: string, activityUuid: string) {
    const response = await api.put<{ success: boolean }>(
      `/admin/materials/${materialId}/mapping`,
      { activityUuid }
    );
    return response;
  },

  async removeMaterialMapping(materialId: string) {
    const response = await api.delete<{ success: boolean }>(
      `/admin/materials/${materialId}/mapping`
    );
    return response;
  },

  async getProducts(params: ProductsListQueryParams = {}): Promise<PaginatedProductsResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.status) queryParams.append('status', params.status);
      if (params.customerId) queryParams.append('customerId', params.customerId);

      const query = queryParams.toString();
      const url = `/admin/products${query ? `?${query}` : ''}`;

      return api.get<PaginatedProductsResponse>(url);
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getPendingProductsByCustomer(customerId: string): Promise<Product[]> {
    try {
      return api.get<Product[]>(`/admin/products/pending/${customerId}`);
    } catch (error) {
      console.error('Error fetching pending products:', error);
      throw error;
    }
  },

  async reviewProduct(productId: string, reviewData: ReviewProductDto): Promise<{
    success: boolean;
    message: string;
    productId: string;
    review_status: string;
  }> {
    try {
      return api.post(`/admin/products/${productId}/review`, reviewData);
    } catch (error) {
      console.error('Error reviewing product:', error);
      throw error;
    }
  },

  async getProductStats(): Promise<ReviewStats> {
    try {
      return api.get<ReviewStats>('/admin/products/stats');
    } catch (error) {
      console.error('Error fetching product stats:', error);
      throw error;
    }
  },

  async getProductById(id: string): Promise<Product> {
    try {
      return api.get<Product>(`/admin/products/${id}`);
    } catch (error) {
      console.error('Error fetching product details:', error);
      throw error;
    }
  },

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      return api.get<DashboardStats>('/admin/dashboard');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },
}; 