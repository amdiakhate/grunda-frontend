import { api } from './api';
import {
  MaterialMapping,
  CreateMaterialMappingDto,
  UpdateMaterialMappingDto,
  MaterialMappingListDto,
  MaterialMappingSearchParams,
  PaginatedMaterialMappings,
} from '../interfaces/materialMapping';

interface Activity {
  name: string;
  location: string;
  comment: string;
  referenceProduct: string;
  uuid: string;
  unit: string;
}

interface SearchActivitiesResponse {
  numberOfActivities: number;
  activities: Activity[];
}

interface SearchActivitiesParams {
  activityName: string;
  activityLocation?: string;
}

export const materialMappingsService = {
  async getAll(params?: MaterialMappingSearchParams): Promise<PaginatedMaterialMappings> {
    return api.get<PaginatedMaterialMappings>('/admin/material-mappings', {
      params: params as Record<string, string>,
    });
  },

  async getById(id: string): Promise<MaterialMappingListDto> {
    return api.get<MaterialMappingListDto>(`/admin/material-mappings/${id}`);
  },

  async create(data: CreateMaterialMappingDto): Promise<MaterialMappingListDto> {
    return api.post<MaterialMappingListDto>('/admin/material-mappings', data);
  },

  async update(id: string, data: UpdateMaterialMappingDto): Promise<MaterialMappingListDto> {
    return api.put<MaterialMappingListDto>(`/admin/material-mappings/${id}`, data);
  },

  async delete(id: string): Promise<{ success: boolean }> {
    return api.delete<{ success: boolean }>(`/admin/material-mappings/${id}`);
  },

  async searchActivities(params: SearchActivitiesParams): Promise<SearchActivitiesResponse> {
    return api.post<SearchActivitiesResponse>('/admin/material-mappings/search-activities', params);
  },
}; 