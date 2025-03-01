import { api } from './api';
import { Product } from '../interfaces/product';

interface UploadResponse {
  success: boolean;
  message: string;
}

interface CalculateImpactResponse {
  message: string;
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    return api.get<Product[]>('/products');
  },

  async getById(id: string): Promise<Product> {
    return api.get<Product>(`/products/${id}`);
  },

  async uploadFile(file: File): Promise<UploadResponse> {
    if (!file) {
      throw new Error('No file provided');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Don't set Content-Type header - let the browser set it with the boundary
      return api.post<UploadResponse>('/products/upload', formData, {
        skipContentType: true, // This will prevent api.ts from setting the default Content-Type
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async calculateProductImpact(productId: string): Promise<CalculateImpactResponse> {
    return api.post<CalculateImpactResponse>(`/impacts/${productId}/calculate-impact`, {});
  }
};