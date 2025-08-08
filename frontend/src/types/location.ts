// Location entity types
export interface Location {
  id: number;
  code: string;
  name: string;
  image: string;
  created_at: string;
  updated_at: string;
}

// API Response types
export interface LocationResponse {
  success: boolean;
  message: string;
  data: Location;
}

export interface LocationListResponse {
  success: boolean;
  message: string;
  data: Location[];
  meta: {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

// Form types
export interface LocationFormData {
  code: string;
  name: string;
  image: string;
}

// Filter types
export interface LocationFilters {
  name?: string;
  code?: string;
  page?: number;
  per_page?: number;
}

// Error types
export interface ApiError {
  error: {
    message: string;
    code: string;
  };
}

export interface ValidationError {
  error: {
    message: string;
    code: string;
    details: Record<string, string[]>;
  };
}
