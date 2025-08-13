import { GetProfileType } from '../_components/Profile/types';

export interface GetOrdersResultType {
  count: number;
  results: Result[];
}

export interface Result {
  id: number;
  created_at: Date;
  requirement: number;
  service: number;
  requirement_data: RequirementData;
  service_data: ServiceData;
  deal: Deal;
  submitted_by: string;
  accepted_by: null;
  role: string;
  description: string;
  status: string;
  accept_time: null;
  submit_time: null;
  steps: any[];
  customer_data: GetProfileType;
  traveler_data: GetProfileType;
}

export interface Stats {
  total_successful_orders: number;
  avg_rate: number;
}

export interface Deal {
  cost: number;
  traveler_fee: number;
  requester_fee: number;
}

export interface RequirementData {
  id: number;
  created_at: Date;
  type: string;
  cost: Cost;
  source: Destination;
  destination: Destination;
  user: number;
  properties: RequirementDataProperties;
  status: string;
  comment: string;
  image: string;
  name: string;
  role: string;
}

export interface Cost {
  wage: number;
  fee: null;
  item_price: null;
  unit: string;
}

export interface Destination {
  location: number;
  location_data: LocationData;
  since: null;
  to: Date | null;
  comment: null;
}

export interface LocationData {
  id: number;
  city: string;
  airport: string;
  longitude: number;
  latitude: number;
}

export interface RequirementDataProperties {
  type: string;
  weight: number;
  height: number;
  length: number;
  width: number;
}

export interface ServiceData {
  id: number;
  created_at: Date;
  trip: number;
  type: string;
  properties: ServiceDataProperties;
  cost: Cost;
  role: string;
  description: string;
  user: number;
  trip_data: TripData;
}

export interface ServiceDataProperties {
  type: string;
  weight: number;
}

export interface TripData {
  id: number;
  flight: Flight;
  ticket_number: string;
  image: string;
  description: string;
  status: string;
}

export interface Flight {
  id: number;
  source: Destination;
  destination: Destination;
  number: null;
  airline: string;
}
