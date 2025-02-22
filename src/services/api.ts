const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'; // adjust based on your backend URL

import { authService } from './auth';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const token = authService.getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
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
  async get<T>(endpoint: string, config?: { params?: Record<string, string> }): Promise<T> {
    try {
      const response = await fetch(
        `${API_BASE_URL}${endpoint}${config?.params ? `?${new URLSearchParams(config.params)}` : ''}`,
        {
          headers: getHeaders(),
          credentials: 'include', // Pour gérer les cookies de session si nécessaire
        }
      );
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`GET request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async post<T>(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          ...getHeaders(),
          ...headers,
        },
        credentials: 'include',
        body: data instanceof FormData ? data : JSON.stringify(data),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`POST request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: getHeaders(),
        credentials: 'include',
        body: JSON.stringify(data),
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`PUT request failed for ${endpoint}:`, error);
      throw error;
    }
  },

  async delete<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'DELETE',
        headers: getHeaders(),
        credentials: 'include',
      });
      return handleResponse<T>(response);
    } catch (error) {
      console.error(`DELETE request failed for ${endpoint}:`, error);
      throw error;
    }
  },
}; 