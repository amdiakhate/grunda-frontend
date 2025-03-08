import {
  MaterialsListResponse,
  MaterialListItem,
  MaterialListQueryParams,
} from '../interfaces/admin';
import type {
  MaterialMappingSearchParams,
  PaginatedMaterialMappings,
} from '../interfaces/materialMapping';
import type {
  Product,
  PaginatedProductsResponse,
  ProductsListQueryParams,
  ReviewProductDto,
  ReviewStats,
} from '../interfaces/product';
import { api } from './api';

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

// Raw Materials
interface RawMaterial {
  id: string;
  name: string;
  description?: string;
  product_affected: number;
  isMapped: boolean;
  mappingId?: string;
  mappingInfo?: {
    materialPattern: string;
    activityName: string;
    finalProduct: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

interface RawMaterialsListResponse {
  items: RawMaterial[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface RawMaterialListQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  mappingStatus?: 'mapped' | 'unmapped' | 'all';
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
      const url = `/admin/product-materials${query ? `?${query}` : ''}`;

      return api.get<MaterialsListResponse>(url);
    } catch (error) {
      console.error('Error fetching materials:', error);
      throw error;
    }
  },

  async getMaterialById(id: string): Promise<MaterialListItem> {
    try {
      return api.get<MaterialListItem>(`/admin/product-materials/${id}`);
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
      if (params.search) queryParams.append('search', params.search);
      if (params.sortBy) queryParams.append('sortBy', params.sortBy);
      if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);

      const query = queryParams.toString();
      const url = `/admin/material-mappings${query ? `?${query}` : ''}`;

      return api.get<PaginatedMaterialMappings>(url);
    } catch (error) {
      console.error('Error fetching material mappings:', error);
      throw error;
    }
  },

  async matchMaterial(productMaterialId: string, mappingId: string): Promise<{
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
      return api.post(`/admin/product-materials/${productMaterialId}/match`, { mappingId });
    } catch (error) {
      console.error('Error matching material:', error);
      throw error;
    }
  },

  async updateMaterialMapping(productMaterialId: string, activityUuid: string) {
    try {
      return api.put<{ success: boolean }>(
        `/admin/product-materials/${productMaterialId}/mapping`,
        { activityUuid }
      );
    } catch (error) {
      console.error('Error updating material mapping:', error);
      throw error;
    }
  },

  async removeMaterialMapping(productMaterialId: string) {
    try {
      return api.delete(`/admin/product-materials/${productMaterialId}/mapping`);
    } catch (error) {
      console.error('Error removing material mapping:', error);
      throw error;
    }
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

  // Raw Materials
  async getRawMaterials(params?: RawMaterialListQueryParams): Promise<RawMaterialsListResponse> {
    return api.get<RawMaterialsListResponse>('/admin/raw-materials', { 
      params: params as Record<string, string> 
    });
  },

  async getRawMaterialById(id: string): Promise<RawMaterial> {
    return api.get<RawMaterial>(`/admin/raw-materials/${id}`);
  },

  async matchMaterialGlobal(materialId: string, mappingId: string): Promise<{ success: boolean }> {
    return api.post<{ success: boolean }>(`/admin/raw-materials/${materialId}/match`, { mappingId });
  },

  async removeMaterialGlobalMapping(materialId: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/admin/raw-materials/${materialId}/match`);
  },
}; 