import { api } from './api';
import type {
  MaterialListQueryParams,
  MaterialsListResponse,
  MaterialDetails,
} from '../interfaces/admin';
import type {
  MaterialMappingSearchParams,
  PaginatedMaterialMappings,
  MaterialMapping,
} from '../interfaces/materialMapping';

export const adminService = {
  async getMaterials(params: MaterialListQueryParams = {}): Promise<MaterialsListResponse> {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.pageSize) queryParams.append('pageSize', params.pageSize.toString());
      if (params.status) queryParams.append('status', params.status);

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
      const url = `/admin/materials/mappings${query ? `?${query}` : ''}`;

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
}; 