export interface CountriesResponse {
  count: number;
  next: null;
  previous: null;
  results: CountryResponse[];
}

export interface CountryResponse {
  long_name: string;
  name: string;
  iso_2: string;
  iso_3: string;
  continent: string;
  region: string;
  zip_code: number;
  population: number;
  captial: null;
  location: number;
}
