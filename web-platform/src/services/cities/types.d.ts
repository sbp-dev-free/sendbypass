export interface CitiesResponse {
  count: number;
  next: string;
  previous: string;
  results: CityResponse[];
}

export interface CityResponse {
  name: string;
  name_ascii: string;
  iso: string;
  area_code: number;
  longitude: number;
  latitude: number;
  type: string;
  province: string;
  province_ascii: string;
  population: number;
  country: number;
  location: number;
}

export interface CityParams {
  country: string;
  limit: number;
  offset: number;
  ordering: string;
  query: string;
}
