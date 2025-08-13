import { ROLE, SERVICE_TYPE, TRIP_TYPE } from "@/enums/globals";

export interface TripParams {
  active: boolean;
  cost: string;
  from_city: string;
  from_location: string;
  limit: number;
  offset: number;
  ordering: string;
  role: ROLE;
  service_types: keyof (typeof SERVICE_TYPE)[];
  to_city: string;
  to_location: string;
  type: TRIP_TYPE;
  weight: string;
  similar: boolean;
  active: string;
}
