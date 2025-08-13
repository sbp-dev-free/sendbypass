import { ServiceType } from '../_components/trips/types';

export interface TripResultType {
  count: number;
  results: TripType[];
}

export interface TripType {
  id: number;
  flight: Flight;
  ticket_number: string;
  image: string;
  services: Record<string, ServiceType>;
  description: string;
  status: string;
  publish_status: string;
  user_data: UserData;
  visible: boolean;
}

export interface Flight {
  source: Destination;
  destination: Destination;
  number: string;
  airline: string;
}

export interface Destination {
  location: number;
  location_data: LocationData;
  since: null;
  to: Date;
  comment: null;
}

export interface LocationData {
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
  airport: Airport;
}

export interface Airport {
  type: string;
  iata_code: string;
  website: string;
  airport_code: string;
  name: string;
}

export interface UserData {
  register_time: Date;
  addresses: any[];
  socials: any[];
  phone_number: null;
  email: string;
  stats: Stats;
  first_name: string;
  last_name: string;
  image: null;
  id: number;
  bio: null;
  background: null;
  website: null;
  current_location: null;
  speak_languages: any[];
  status: string;
  type: string;
  business_name: string;
}

export interface Stats {
  total_successful_orders: number;
  avg_rate: number;
}
