export interface AirportResultType {
  count: number;
  next: null;
  previous: null;
  results: Result[];
}

export interface Result {
  id: number;
  location: Location;
  name: string;
  type: Type;
  iata_code: string;
  website: string;
  airport_code: string;
}

export interface Location {
  city: string;
  longitude: number;
  latitude: number;
  id: number;
  country_iso2: string;
  country_iso3: string;
  country: string;
  district: null;
  area: null;
  zone: null;
  description: null;
}

export enum Type {
  Large = 'LARGE',
}
