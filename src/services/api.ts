const API_BASE_URL = 'http://localhost:3000'; // adjust based on your backend URL

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new APIError(response.status, await response.text());
  }
  return response.json();
}

export const api = {
  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
    });
    return handleResponse<T>(response);
  },

  async post<T>(endpoint: string, data: unknown, headers: Record<string, string> = {}): Promise<T> {
    const isFormData = data instanceof FormData;
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: isFormData ? {
        'Access-Control-Allow-Origin': '*',
        ...headers
      } : {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        ...headers
      },
      body: isFormData ? data : JSON.stringify(data),
    });
    return handleResponse<T>(response);
  }, 


  async put<T>(endpoint: string, data: unknown): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify(data),
    });
    return handleResponse<T>(response);
  }

}; 