import { api } from './api';

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


  async getImports(): Promise<any> {
    try {
      const result = await api.get('/products/imports');
      return result;
    } catch (error) {
      console.error('Error getting imports:', error);
      throw error;
    }   
  },


  async reloadProductImpacts(id: string): Promise<any> {
    try {
      const result = await api.get(`/products/${id}/impact-results`);
      return result;
    } catch (error) {
      console.error('Error reloading product impacts:', error);
      throw error;
    }
  },

  async getCalculationStatus(id: string): Promise<{
    completed: boolean;
    progress: number;
    hasErrors: boolean;
    stalled: boolean;
  }> {
    const response = await api.get(`/products/${id}/calculation-status`);
    return response.data;
  }

}; 