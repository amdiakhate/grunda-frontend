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

//   async create(products: CSVRow[]): Promise<void> {
//     return api.post<void>('/products', { products });
//   }
}; 