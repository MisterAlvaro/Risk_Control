import axios, { AxiosInstance, AxiosResponse, AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 10000,
    });

    if (process.env.NODE_ENV === 'development') {
      this.client.interceptors.request.use(
        (config) => {
          console.log(`${config.method?.toUpperCase()} ${config.url}`, config.params);
          return config;
        },
        (error) => {
          console.error('Request Error:', error);
          return Promise.reject(error);
        }
      );

      this.client.interceptors.response.use(
        (response) => {
          console.log(`${response.status} ${response.config.url}`);
          return response;
        },
        (error) => {
          console.error('Response Error:', error.response?.status, error.response?.data);
          return Promise.reject(error);
        }
      );
    }
  }

  async get<T>(url: string, params?: Record<string, any>): Promise<T> {
    const response: AxiosResponse<T> = await this.client.get(url, { params });
    return response.data;
  }

  async post<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.put(url, data);
    return response.data;
  }

  async patch<T>(url: string, data?: any): Promise<T> {
    const response: AxiosResponse<T> = await this.client.patch(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.client.delete(url);
    return response.data;
  }
  static handleError(error: any): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string;
        errors?: Record<string, string[]>;
      }>;
      
      const errorData = axiosError.response?.data;
      const status = axiosError.response?.status;
      
      throw {
        status,
        message: errorData?.message || 'An error occurred',
        errors: errorData?.errors,
        originalError: error,
      };
    }
    
    throw error;
  }
}

export const apiClient = new ApiClient();
