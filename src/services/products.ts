import { api } from './api';
import { UploadResponse, MaterialSuggestion, MaterialRequiringReview } from '../interfaces/csvUpload';
import { EcoinventActivity } from '../interfaces/ecoinvent';

export const productsService = {
  async getAll(): Promise<any> {
    const result = await api.get('/products');
    return result;
  },

  async getById(id: string): Promise<any> {
    const result = await api.get(`/products/${id}`);
    return result;
  },

  async uploadFile(file: File): Promise<any> {
    if (!file) {
      throw new Error('No file provided');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await api.post('/products/upload-csv', formData);
      return result;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  uploadCsv: async (file: File): Promise<UploadResponse> => {
    if (!file) {
      throw new Error('No file provided');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const result = await api.post('/products/upload-csv', formData);
      return result as UploadResponse;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async getImports(): Promise<any> {
    try {
      const result = await api.get('/products/imports');
      return result;
    } catch (error) {
      console.error('Error getting imports:', error);
      throw error;
    }   
  },

  async calculateProductImpact(id: string): Promise<any> {
    try {
      const result = await api.post(`/impacts/${id}/calculate-impact`, {});
      return result;
    } catch (error) {
      console.error('Error reloading product impacts:', error);
      throw error;
    }
  },

  confirmMaterialMappings: async (params: {
    mappings: Record<string, MaterialSuggestion>;
  }): Promise<void> => {
    try {
      await api.post('/products/materials/confirm-mapping', params);
    } catch (error) {
      console.error('Error confirming mappings:', error);
      throw error;
    }
  },

  refreshSuggestions: async (materialId: string): Promise<MaterialRequiringReview> => {
    try {
      const result = await api.post(`/products/materials/${materialId}/refresh-suggestions`);
      return result;
    } catch (error) {
      console.error('Error refreshing suggestions:', error);
      throw error;
    }
  },

  getAlternativeSuggestions: async (materialName: string): Promise<EcoinventActivity[]> => {
    try {
      const result = await api.post('/products/materials/suggest-alternatives', {
        materialName
      });
      return result.alternatives;
    } catch (error) {
      console.error('Error getting alternative suggestions:', error);
      throw error;
    }
  },
}; 