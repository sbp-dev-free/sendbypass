export interface AddressesResponse {
  count: number;
  next: string;
  previous: string;
  results: AddressResponse[];
}

export interface AddressResponse {
  city: string;
  longitude: number;
  latitude: number;
  id: number;
  country_iso2: string;
  country_iso3: string;
  country: string;
  description: string;
  current: boolean;
}
