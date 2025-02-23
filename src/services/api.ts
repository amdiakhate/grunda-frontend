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
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
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
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: getHeaders(config),
        credentials: 'include',
        body: data instanceof FormData ? data : JSON.stringify(data),
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