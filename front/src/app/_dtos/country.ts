export interface CountryType {
  captial: null;
  continent: string;
  iso_2: string;
  iso_3: string;
  long_name: string;
  name: string;
  region: string;
  zip_code: number;
}

export interface CountryResult {
  count: number;
  results: CountryType[];
}
