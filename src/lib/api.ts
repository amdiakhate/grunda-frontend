const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authorization header if token exists
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'An error occurred');
  }
  return response.json();
}

export const api = {
  async get<T>(endpoint: string, config?: { params?: Record<string, string> }): Promise<T> {
    const response = await fetch(
      `${API_BASE_URL}${endpoint}${config?.params ? `?${new URLSearchParams(config.params)}` : ''}`,
      {
        headers: getHeaders(),
      }
    );
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data: unknown, headers?: Record<string, string>): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        ...headers,
      },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  },

  async delete<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse<T>(response);
  },
}; 