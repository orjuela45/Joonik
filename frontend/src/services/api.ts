import axios from 'axios';
import type {
  Location,
  CreateLocationRequest,
  UpdateLocationRequest,
  LocationsResponse,
  LocationResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';
const API_KEY = import.meta.env.VITE_API_KEY || 'joonik-secret-api-key-2024';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-API-Key': API_KEY,
  },
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const locationService = {
  // Get all locations
  getAll: async (): Promise<Location[]> => {
    const response = await apiClient.get<LocationsResponse>('/locations');
    return response.data.data;
  },

  // Get location by ID
  getById: async (id: number): Promise<Location> => {
    const response = await apiClient.get<LocationResponse>(`/locations/${id}`);
    return response.data.data;
  },

  // Create new location
  create: async (location: CreateLocationRequest): Promise<Location> => {
    const response = await apiClient.post<LocationResponse>('/locations', location);
    return response.data.data;
  },

  // Update location
  update: async (id: number, location: UpdateLocationRequest): Promise<Location> => {
    const response = await apiClient.put<LocationResponse>(`/locations/${id}`, location);
    return response.data.data;
  },

  // Delete location
  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/locations/${id}`);
  },

  // Test authentication
  testAuth: async (): Promise<boolean> => {
    try {
      await apiClient.post('/auth');
      return true;
    } catch {
      return false;
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      await apiClient.get('/health');
      return true;
    } catch {
      return false;
    }
  },
};

export default apiClient;
