import { api } from './api';
import { Product } from '../interfaces/product';

// Types for asynchronous processing
export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface UploadJobResponse {
  jobId: string;
  status: JobStatus;
  message?: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  message?: string;
  progress?: number | {
    percentage: number;
    stage: string;
    message: string;
  };
  errors?: string[];
  details?: string;
  validationRules?: Record<string, string>;
  suggestions?: string[];
  createdAt?: string;
  result?: {
    totalProducts?: number;
    totalMaterials?: number;
    materialsMatched?: number;
    materialsUnmatched?: number;
    status?: string;
    statusMessage?: string;
  };
}

interface UploadResponse {
  success?: boolean;
  message?: string;
  errors?: string[];
  details?: string;
  validationRules?: Record<string, string>;
  suggestions?: string[];
  jobId?: string;
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

  // Alias for getById for compatibility
  async getProductById(id: string): Promise<Product> {
    return this.getById(id);
  },

  async uploadFile(file: File): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      return api.post<UploadResponse>('/products/upload', formData, {
        skipContentType: true // Don't set Content-Type, let the browser do it with the boundary
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  },

  /**
   * Checks the status of a CSV file processing job
   * @param jobId The job identifier
   * @returns The current job status
   */
  async checkJobStatus(jobId: string): Promise<JobStatusResponse> {
    try {
      return api.get<JobStatusResponse>(`/products/upload/status/${jobId}`);
    } catch (error) {
      console.error('Error checking job status:', error);
      throw error;
    }
  },

  /**
   * Polling to check job status until it's completed
   * @param jobId The job identifier
   * @param onStatusUpdate Callback called on each status update
   * @param intervalMs Interval between checks in milliseconds
   * @param maxAttempts Maximum number of attempts
   * @returns The last status response
   */
  async pollJobStatus(
    jobId: string, 
    onStatusUpdate: (status: JobStatusResponse) => void,
    intervalMs = 2000,
    maxAttempts = 60 // 2 minutes by default
  ): Promise<JobStatusResponse> {
    let attempts = 0;
    
    const poll = async (): Promise<JobStatusResponse> => {
      attempts++;
      
      try {
        const status = await this.checkJobStatus(jobId);
        
        // Call the callback with the current status
        onStatusUpdate(status);
        
        // If the job is completed or failed, stop polling
        if (status.status === 'completed' || status.status === 'failed') {
          return status;
        }
        
        // If the maximum number of attempts is reached, stop polling
        if (attempts >= maxAttempts) {
          throw new Error('Maximum polling attempts reached');
        }
        
        // Wait for the specified interval before the next check
        await new Promise(resolve => setTimeout(resolve, intervalMs));
        
        // Continue polling
        return poll();
      } catch (error) {
        console.error('Error during job status polling:', error);
        throw error;
      }
    };
    
    return poll();
  },

  async calculateProductImpact(productId: string): Promise<{ success: boolean; message: string }> {
    try {
      return api.post<{ success: boolean; message: string }>(`/impacts/${productId}/calculate-impact`, {});
    } catch (error) {
      console.error('Error calculating product impact:', error);
      throw error;
    }
  },

  // Alias for calculateProductImpact for compatibility
  async calculateProduct(productId: string): Promise<{ success: boolean; message: string }> {
    return this.calculateProductImpact(productId);
  }
};