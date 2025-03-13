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
    const response = await api.post<ActivitySearchResponse>('/admin/material-mappings/search-activities', {
      activityName: params.search || '',
      activityLocation: params.location || 'GLO'
    });
    
    return response.activities || [];
  }
}

interface SearchActivityParams {
  search?: string;
  location?: string;
  limit?: number;
}

interface ActivitySearchResponse {
  numberOfActivities: number;
  activities: ActivitySearchResult[];
}

interface ActivitySearchResult {
  name: string;
  location: string;
  comment: string;
  referenceProduct: string;
  uuid: string;
  unit: string;
}

export const materialMappingsService = new MaterialMappingsService(); 