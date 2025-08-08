import { useState, useEffect, useCallback } from 'react';
import { AxiosError } from 'axios';
import locationService from '../services/locationService';
import type {
  Location,
  LocationListResponse,
  LocationFilters,
  LocationFormData,
  ApiError,
  ValidationError,
} from '../types/location';

interface UseLocationsState {
  locations: Location[];
  loading: boolean;
  error: string | null;
  meta: LocationListResponse['meta'] | null;
  links: LocationListResponse['links'] | null;
}

interface UseLocationsReturn extends UseLocationsState {
  fetchLocations: (filters?: LocationFilters) => Promise<void>;
  createLocation: (data: LocationFormData) => Promise<boolean>;
  updateLocation: (id: number, data: LocationFormData) => Promise<boolean>;
  deleteLocation: (id: number) => Promise<boolean>;
  clearError: () => void;
}

export const useLocations = (initialFilters: LocationFilters = {}): UseLocationsReturn => {
  const [state, setState] = useState<UseLocationsState>({
    locations: [],
    loading: false,
    error: null,
    meta: null,
    links: null,
  });

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const handleError = useCallback((error: AxiosError) => {
    let errorMessage = 'Ha ocurrido un error inesperado';

    if (error.response?.data) {
      const errorData = error.response.data as ApiError | ValidationError;

      if ('error' in errorData) {
        errorMessage = errorData.error.message;

        // Handle validation errors
        if ('details' in errorData.error && errorData.error.details) {
          const validationMessages = Object.values(errorData.error.details).flat().join(', ');
          errorMessage = `${errorMessage}: ${validationMessages}`;
        }
      }
    } else if (error.request) {
      errorMessage = 'Error de conexión. Verifica tu conexión a internet.';
    }

    setState(prev => ({ ...prev, error: errorMessage, loading: false }));
  }, []);

  const fetchLocations = useCallback(
    async (filters: LocationFilters = {}) => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const response = await locationService.getLocations({ ...initialFilters, ...filters });
        setState(prev => ({
          ...prev,
          locations: response.data,
          meta: response.meta,
          links: response.links,
          loading: false,
        }));
      } catch (error) {
        handleError(error as AxiosError);
      }
    },
    [initialFilters, handleError]
  );

  const createLocation = useCallback(
    async (data: LocationFormData): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        await locationService.createLocation(data);
        setState(prev => ({ ...prev, loading: false }));
        return true;
      } catch (error) {
        handleError(error as AxiosError);
        return false;
      }
    },
    [handleError]
  );

  const updateLocation = useCallback(
    async (id: number, data: LocationFormData): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        await locationService.updateLocation(id, data);
        setState(prev => ({ ...prev, loading: false }));
        return true;
      } catch (error) {
        handleError(error as AxiosError);
        return false;
      }
    },
    [handleError]
  );

  const deleteLocation = useCallback(
    async (id: number): Promise<boolean> => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        await locationService.deleteLocation(id);
        setState(prev => ({ ...prev, loading: false }));
        return true;
      } catch (error) {
        handleError(error as AxiosError);
        return false;
      }
    },
    [handleError]
  );

  // Load initial data
  useEffect(() => {
    fetchLocations();
  }, [fetchLocations]);

  return {
    ...state,
    fetchLocations,
    createLocation,
    updateLocation,
    deleteLocation,
    clearError,
  };
};

export default useLocations;
