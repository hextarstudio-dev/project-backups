/**
 * Centralized API Client
 * Provides consistent HTTP methods with error handling
 * Built on top of authFetch for automatic cookie-based authentication
 */

import { authFetch } from './authFetch';

/**
 * API Error with status code and message
 */
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Centralized API Client for all HTTP requests
 */
class ApiClient {
  /**
   * GET request
   * @param endpoint - API endpoint (e.g., '/projects')
   * @returns Parsed JSON response
   * @throws ApiError if request fails
   */
  async get<T = unknown>(endpoint: string): Promise<T> {
    const response = await authFetch(endpoint);

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new ApiError(response.status, error.message, error.data);
    }

    return response.json();
  }

  /**
   * POST request
   * @param endpoint - API endpoint
   * @param body - Request body (will be JSON stringified)
   * @returns Parsed JSON response
   * @throws ApiError if request fails
   */
  async post<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    const response = await authFetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new ApiError(response.status, error.message, error.data);
    }

    return response.json();
  }

  /**
   * PUT request
   * @param endpoint - API endpoint
   * @param body - Request body (will be JSON stringified)
   * @returns Parsed JSON response
   * @throws ApiError if request fails
   */
  async put<T = unknown>(endpoint: string, body?: unknown): Promise<T> {
    const response = await authFetch(endpoint, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new ApiError(response.status, error.message, error.data);
    }

    return response.json();
  }

  /**
   * DELETE request
   * @param endpoint - API endpoint
   * @returns Parsed JSON response
   * @throws ApiError if request fails
   */
  async delete<T = unknown>(endpoint: string): Promise<T> {
    const response = await authFetch(endpoint, {
      method: 'DELETE',
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new ApiError(response.status, error.message, error.data);
    }

    return response.json();
  }

  /**
   * Upload file with FormData
   * @param endpoint - Upload endpoint
   * @param formData - FormData with file
   * @returns Parsed JSON response
   * @throws ApiError if request fails
   */
  async upload<T = unknown>(endpoint: string, formData: FormData): Promise<T> {
    const response = await authFetch(endpoint, {
      method: 'POST',
      body: formData,
      // Don't set Content-Type header - browser will set it with boundary
    });

    if (!response.ok) {
      const error = await this.parseError(response);
      throw new ApiError(response.status, error.message, error.data);
    }

    return response.json();
  }

  /**
   * Parse error response
   */
  private async parseError(response: Response): Promise<{ message: string; data?: unknown }> {
    try {
      const data = await response.json();
      return {
        message: data.error || data.message || `Request failed with status ${response.status}`,
        data,
      };
    } catch {
      return {
        message: `Request failed with status ${response.status}`,
      };
    }
  }
}

/**
 * Singleton API client instance
 * Use this for all API requests in the application
 *
 * @example
 * // GET request
 * const projects = await apiClient.get<Project[]>('/projects');
 *
 * @example
 * // POST request
 * const newProject = await apiClient.post('/projects', { title: 'New Project' });
 *
 * @example
 * // Error handling
 * try {
 *   await apiClient.delete('/projects/123');
 * } catch (error) {
 *   if (error instanceof ApiError) {
 *     console.error('API Error:', error.status, error.message);
 *   }
 * }
 */
export const apiClient = new ApiClient();
