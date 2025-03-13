import { api } from './api';
import { Product } from '../interfaces/product';

interface UploadResponse {
  success?: boolean;
  message?: string;
  errors?: string[];
  details?: string;
  validationRules?: Record<string, string>;
  suggestions?: string[];
}

export const productsService = {
  async getAll(): Promise<Product[]> {
    try {
      return api.get<Product[]>('/products');
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  async getById(id: string): Promise<Product> {
    try {
      return api.get<Product>(`/products/${id}`);
    } catch (error) {
      console.error('Error fetching product:', error);
      throw error;
    }
  },

  // Alias pour getById pour la compatibilité
  async getProductById(id: string): Promise<Product> {
    return this.getById(id);
  },

  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      return api.post<UploadResponse>('/products/upload', formData, {
        skipContentType: true // Ne pas définir Content-Type, laisser le navigateur le faire avec la boundary
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  async calculateProductImpact(productId: string): Promise<{ success: boolean; message: string }> {
    try {
      return api.post<{ success: boolean; message: string }>(`/impacts/${productId}/calculate-impact`, {});
    } catch (error) {
      console.error('Error calculating product impact:', error);
      throw error;
    }
  },

  // Alias pour calculateProductImpact pour la compatibilité
  async calculateProduct(productId: string): Promise<{ success: boolean; message: string }> {
    return this.calculateProductImpact(productId);
  }
};