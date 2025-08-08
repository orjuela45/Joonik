export interface Location {
  id: number;
  code: string;
  name: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateLocationRequest {
  code: string;
  name: string;
  image?: string;
}

export interface UpdateLocationRequest {
  code?: string;
  name?: string;
  image?: string;
}

export interface LocationsResponse {
  data: Location[];
  message?: string;
}

export interface LocationResponse {
  data: Location;
  message?: string;
}
