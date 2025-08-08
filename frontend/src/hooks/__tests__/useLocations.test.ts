import { renderHook, act, waitFor } from '@testing-library/react';
import { AxiosError } from 'axios';
import { useLocations } from '../useLocations';
import locationService from '../../services/locationService';
import type { Location, LocationListResponse, LocationFormData } from '../../types/location';

// Mock the location service
jest.mock('../../services/locationService');
const mockLocationService = locationService as jest.Mocked<typeof locationService>;

const mockLocations: Location[] = [
  {
    id: 1,
    code: 'LOC001',
    name: 'Location 1',
    image: 'https://example.com/image1.jpg',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  },
  {
    id: 2,
    code: 'LOC002',
    name: 'Location 2',
    image: 'https://example.com/image2.jpg',
    created_at: '2024-01-02T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  },
];

const mockLocationListResponse: LocationListResponse = {
  data: mockLocations,
  meta: {
    current_page: 1,
    per_page: 10,
    total: 2,
    total_pages: 1,
  },
  links: {
    first: 'http://example.com/api/locations?page=1',
    last: 'http://example.com/api/locations?page=1',
    prev: null,
    next: null,
  },
};

const mockNewLocation: Location = {
  id: 3,
  code: 'LOC003',
  name: 'New Location',
  image: 'https://example.com/image3.jpg',
  created_at: '2024-01-03T00:00:00Z',
  updated_at: '2024-01-03T00:00:00Z',
};

describe('useLocations', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useLocations());

    expect(result.current.locations).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.meta).toBe(null);
    expect(result.current.links).toBe(null);
  });

  it('fetches locations successfully', async () => {
    mockLocationService.getLocations.mockResolvedValue(mockLocationListResponse);
    
    const { result } = renderHook(() => useLocations());

    await act(async () => {
      await result.current.fetchLocations();
    });

    expect(result.current.locations).toEqual(mockLocations);
    expect(result.current.meta).toEqual(mockLocationListResponse.meta);
    expect(result.current.links).toEqual(mockLocationListResponse.links);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('handles fetch locations error', async () => {
    const errorMessage = 'Failed to fetch locations';
    const axiosError = new AxiosError('Network Error');
    axiosError.response = {
      data: { error: { message: errorMessage } },
      status: 500,
      statusText: 'Internal Server Error',
      headers: {},
      config: {} as any,
    };
    
    mockLocationService.getLocations.mockRejectedValue(axiosError);
    
    const { result } = renderHook(() => useLocations());

    await act(async () => {
      await result.current.fetchLocations();
    });

    expect(result.current.error).toBe(errorMessage);
    expect(result.current.loading).toBe(false);
    expect(result.current.locations).toEqual([]);
  });

  it('sets loading state during fetch', async () => {
    let resolvePromise: (value: LocationListResponse) => void;
    const promise = new Promise<LocationListResponse>((resolve) => {
      resolvePromise = resolve;
    });
    
    mockLocationService.getLocations.mockReturnValue(promise);
    
    const { result } = renderHook(() => useLocations());

    act(() => {
      result.current.fetchLocations();
    });

    expect(result.current.loading).toBe(true);

    await act(async () => {
      resolvePromise!(mockLocationListResponse);
      await promise;
    });

    expect(result.current.loading).toBe(false);
  });

  it('creates location successfully', async () => {
    mockLocationService.createLocation.mockResolvedValue(mockNewLocation);
    
    const { result } = renderHook(() => useLocations());
    
    const locationData: LocationFormData = {
      code: 'LOC003',
      name: 'New Location',
      image: 'https://example.com/image3.jpg',
    };

    let createResult: boolean;
    await act(async () => {
      createResult = await result.current.createLocation(locationData);
    });

    expect(createResult!).toBe(true);
    expect(mockLocationService.createLocation).toHaveBeenCalledWith(locationData);
  });

  it('handles create location error', async () => {
    const errorMessage = 'Failed to create location';
    const axiosError = new AxiosError('Validation Error');
    axiosError.response = {
      data: { error: { message: errorMessage } },
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      config: {} as any,
    };
    
    mockLocationService.createLocation.mockRejectedValue(axiosError);
    
    const { result } = renderHook(() => useLocations());
    
    const locationData: LocationFormData = {
      code: 'LOC003',
      name: 'New Location',
      image: 'https://example.com/image3.jpg',
    };

    let createResult: boolean;
    await act(async () => {
      createResult = await result.current.createLocation(locationData);
    });

    expect(createResult!).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('updates location successfully', async () => {
    const updatedLocation = { ...mockLocations[0], name: 'Updated Location' };
    mockLocationService.updateLocation.mockResolvedValue(updatedLocation);
    
    const { result } = renderHook(() => useLocations());
    
    const locationData: LocationFormData = {
      code: 'LOC001',
      name: 'Updated Location',
      image: 'https://example.com/image1.jpg',
    };

    let updateResult: boolean;
    await act(async () => {
      updateResult = await result.current.updateLocation(1, locationData);
    });

    expect(updateResult!).toBe(true);
    expect(mockLocationService.updateLocation).toHaveBeenCalledWith(1, locationData);
  });

  it('handles update location error', async () => {
    const errorMessage = 'Failed to update location';
    const axiosError = new AxiosError('Not Found');
    axiosError.response = {
      data: { error: { message: errorMessage } },
      status: 404,
      statusText: 'Not Found',
      headers: {},
      config: {} as any,
    };
    
    mockLocationService.updateLocation.mockRejectedValue(axiosError);
    
    const { result } = renderHook(() => useLocations());
    
    const locationData: LocationFormData = {
      code: 'LOC001',
      name: 'Updated Location',
      image: 'https://example.com/image1.jpg',
    };

    let updateResult: boolean;
    await act(async () => {
      updateResult = await result.current.updateLocation(1, locationData);
    });

    expect(updateResult!).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('deletes location successfully', async () => {
    mockLocationService.deleteLocation.mockResolvedValue(undefined);
    
    const { result } = renderHook(() => useLocations());

    let deleteResult: boolean;
    await act(async () => {
      deleteResult = await result.current.deleteLocation(1);
    });

    expect(deleteResult!).toBe(true);
    expect(mockLocationService.deleteLocation).toHaveBeenCalledWith(1);
  });

  it('handles delete location error', async () => {
    const errorMessage = 'Failed to delete location';
    const axiosError = new AxiosError('Forbidden');
    axiosError.response = {
      data: { error: { message: errorMessage } },
      status: 403,
      statusText: 'Forbidden',
      headers: {},
      config: {} as any,
    };
    
    mockLocationService.deleteLocation.mockRejectedValue(axiosError);
    
    const { result } = renderHook(() => useLocations());

    let deleteResult: boolean;
    await act(async () => {
      deleteResult = await result.current.deleteLocation(1);
    });

    expect(deleteResult!).toBe(false);
    expect(result.current.error).toBe(errorMessage);
  });

  it('clears error successfully', () => {
    const { result } = renderHook(() => useLocations());

    // Set an error first
    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBe(null);
  });

  it('fetches locations with filters', async () => {
    mockLocationService.getLocations.mockResolvedValue(mockLocationListResponse);
    
    const { result } = renderHook(() => useLocations());
    
    const filters = {
      page: 2,
      per_page: 5,
      name: 'test',
      code: 'LOC',
    };

    await act(async () => {
      await result.current.fetchLocations(filters);
    });

    expect(mockLocationService.getLocations).toHaveBeenCalledWith(filters);
  });

  it('automatically fetches locations on mount with initial filters', async () => {
    mockLocationService.getLocations.mockResolvedValue(mockLocationListResponse);
    
    const initialFilters = { page: 1, per_page: 10 };
    
    renderHook(() => useLocations(initialFilters));

    await waitFor(() => {
      expect(mockLocationService.getLocations).toHaveBeenCalledWith(initialFilters);
    });
  });

  it('handles validation errors correctly', async () => {
    const validationError = {
      errors: {
        code: ['The code field is required.'],
        name: ['The name field must be at least 3 characters.'],
      },
    };
    
    const axiosError = new AxiosError('Validation Error');
    axiosError.response = {
      data: validationError,
      status: 422,
      statusText: 'Unprocessable Entity',
      headers: {},
      config: {} as any,
    };
    
    mockLocationService.createLocation.mockRejectedValue(axiosError);
    
    const { result } = renderHook(() => useLocations());
    
    const locationData: LocationFormData = {
      code: '',
      name: 'Te',
      image: 'https://example.com/image.jpg',
    };

    await act(async () => {
      await result.current.createLocation(locationData);
    });

    expect(result.current.error).toContain('The code field is required');
  });

  it('handles network errors gracefully', async () => {
    const axiosError = new AxiosError('Network Error');
    // No response object to simulate network error
    
    mockLocationService.getLocations.mockRejectedValue(axiosError);
    
    const { result } = renderHook(() => useLocations());

    await act(async () => {
      await result.current.fetchLocations();
    });

    expect(result.current.error).toBe('Ha ocurrido un error inesperado');
  });
});