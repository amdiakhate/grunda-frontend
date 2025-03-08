import { api } from './api';
import type {
  MaterialMapping,
  MaterialMappingSearchParams,
  PaginatedMaterialMappings,
  CreateMaterialMappingDto,
  UpdateMaterialMappingDto
} from '@/interfaces/materialMapping';

class MaterialMappingsService {
  async getAll(params?: MaterialMappingSearchParams): Promise<PaginatedMaterialMappings> {
    return api.get<PaginatedMaterialMappings>('/admin/material-mappings', { 
      params: params as Record<string, string> 
    });
  }

  async getById(id: string): Promise<MaterialMapping> {
    return api.get<MaterialMapping>(`/admin/material-mappings/${id}`);
  }

  async create(data: CreateMaterialMappingDto): Promise<MaterialMapping> {
    return api.post<MaterialMapping>('/admin/material-mappings', data);
  }

  async update(id: string, data: UpdateMaterialMappingDto): Promise<MaterialMapping> {
    return api.put<MaterialMapping>(`/admin/material-mappings/${id}`, data);
  }

  async delete(id: string): Promise<void> {
    return api.delete(`/admin/material-mappings/${id}`);
  }

  async searchActivities(params: SearchActivityParams): Promise<ActivitySearchResult[]> {
    return api.get<ActivitySearchResult[]>('/admin/material-mappings/activities/search', { 
      params: params as Record<string, string> 
    });
  }
}

interface SearchActivityParams {
  search?: string;
  limit?: number;
}

interface ActivitySearchResult {
  id: string;
  name: string;
  origin?: string;
  unit?: string;
}

export const materialMappingsService = new MaterialMappingsService(); 