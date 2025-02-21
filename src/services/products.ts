import { api } from './api';
import { Product } from '../interfaces/product';

interface UploadResponse {
  success: boolean;
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
      return api.post<UploadResponse>('/products/upload', formData);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};