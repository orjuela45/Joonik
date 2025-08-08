import apiClient from '../config/api';
import type {
  LocationResponse,
  LocationListResponse,
  LocationFormData,
  LocationFilters,
} from '../types/location';

class LocationService {
  private readonly endpoint = '/locations';

  /**
   * Get paginated list of locations with optional filters
   */
  async getLocations(filters: LocationFilters = {}): Promise<LocationListResponse> {
    const params = new URLSearchParams();

    if (filters.name) params.append('name', filters.name);
    if (filters.code) params.append('code', filters.code);
    if (filters.page) params.append('page', filters.page.toString());
    if (filters.per_page) params.append('per_page', filters.per_page.toString());

    const response = await apiClient.get<LocationListResponse>(
      `${this.endpoint}?${params.toString()}`
    );
    return response.data;
  }

  /**
   * Get a single location by ID
   */
  async getLocation(id: number): Promise<LocationResponse> {
    const response = await apiClient.get<LocationResponse>(`${this.endpoint}/${id}`);
    return response.data;
  }

  /**
   * Create a new location
   */
  async createLocation(data: LocationFormData): Promise<LocationResponse> {
    const response = await apiClient.post<LocationResponse>(this.endpoint, data);
    return response.data;
  }

  /**
   * Update an existing location
   */
  async updateLocation(id: number, data: LocationFormData): Promise<LocationResponse> {
    const response = await apiClient.put<LocationResponse>(`${this.endpoint}/${id}`, data);
    return response.data;
  }

  /**
   * Delete a location
   */
  async deleteLocation(id: number): Promise<{ success: boolean; message: string }> {
    const response = await apiClient.delete<{ success: boolean; message: string }>(
      `${this.endpoint}/${id}`
    );
    return response.data;
  }
}

export const locationService = new LocationService();
export default locationService;
