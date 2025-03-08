const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // adjust based on your backend URL

import { authService } from './auth';

interface RequestConfig {
  params?: Record<string, string>;
  headers?: Record<string, string>;
  skipContentType?: boolean;
}

function getHeaders(config?: RequestConfig): HeadersInit {
  const headers: HeadersInit = {};

  // Add content type header unless explicitly skipped (for FormData)
  if (!config?.skipContentType) {
    headers['Content-Type'] = 'application/json';
  }

  // Add authorization header if token exists
  const token = authService.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Add any additional headers
  if (config?.headers) {
    Object.assign(headers, config.headers);
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    if (response.status === 401) {
      // Clear session on unauthorized
      authService.clearSession();
      window.location.href = '/login';
    }
    
    // Tenter de lire l'erreur comme JSON, mais ne pas échouer si ce n'est pas du JSON
    const errorText = await response.text();
    let errorObj: { message?: string } = {};
    try {
      errorObj = JSON.parse(errorText);
    } catch {
      errorObj = { message: errorText };
    }
    
    throw new Error(errorObj.message || 'An error occurred');
  }
  
  // Vérifier si la réponse est vide
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  } else {
    // Pour les réponses non-JSON ou vides
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    try {
      return JSON.parse(text);
    } catch {
      return text as unknown as T;
    }
  }
}

export const api = {
  async get<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${endpoint}${config?.params ? `?${new URLSearchParams(config.params)}` : ''}`,
        {
          headers: getHeaders(config),
          credentials: 'include', // For session cookies if needed
        }
      );
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: unknown, config?: RequestConfig): Promise<T> {
    try {
      // Pour FormData, ne pas définir Content-Type
      const isFormData = data instanceof FormData;
      const configToUse = isFormData 
        ? { ...config, skipContentType: true }
        : config;
        
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(configToUse),
        credentials: 'include',
        body: isFormData ? data : JSON.stringify(data),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: unknown, config?: RequestConfig): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(config),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async delete<T>(endpoint: string, config?: RequestConfig): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(config),
        credentials: 'include',
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  },
}; 