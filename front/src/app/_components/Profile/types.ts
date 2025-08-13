export interface GetProfileType {
  register_time: Date;
  socials: SocialsType[];
  addresses: any[];
  current_location: number | null;
  phone_number: PhoneNumber | null;
  email: string;
  stats: Stats;
  first_name: string;
  last_name: string;
  image: string | null;
  background: string | null;
  website: string | null;
  bio: string | null;
  speak_languages: string[];
  status: string;
  type: string;
  business_name: string;
}

export interface LanguageType {
  name: string;
  iso: string;
}
export interface LanguageResultType {
  count: number;
  results: LanguageType[];
}

interface PhoneNumber {
  zip_code: {
    country: string;
    zip_code: string;
  };
  area_code: string;
  phone: string;
  socials?: string[];
}

export interface Stats {
  total_successful_orders: number;
  avg_rate: number;
}

export interface SocialsType {
  type: string;
  link: string;
}

export interface AddressType {
  city: string;
  longitude: number;
  latitude: number;
  country: string;
  district: string;
  area: string;
  zone: string;
  description: string;
}

export interface SocialsResultType {
  count: number;
  results: Result[];
}

export interface Result extends SocialsType {
  id: number;
}

export interface UserLocationsResultType {
  count: number;
  next: null;
  previous: null;
  results: UserLocationResult[];
}

export interface UserLocationResult {
  city: string;
  longitude: string;
  latitude: string;
  id: number;
  country: string;
  district: string;
  area: string;
  zone: string;
  description: string;
}

export interface User {
  user: GetProfileType;
}
