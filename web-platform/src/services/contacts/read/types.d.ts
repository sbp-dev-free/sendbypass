export interface ContactsResponse {
  count: number;
  next: null;
  previous: null;
  results: ContactResponse[];
}

export interface ContactResponse {
  type: string;
  data: Partial<Data>;
  id: number;
}

export interface Data {
  zone_code: ZoneCode;
  phone: string;
  type: string;
  link: string;
}

export interface ZoneCode {
  country_tag: string;
  country: string;
  zip_code: number;
}
