import { ROLE, SERVICE_TYPE, TRIP_TYPE } from "@/enums/globals";
import { RequirementResponse } from "@/services/types";

export interface RequirementsParams {
  cost: string;
  from_city: string;
  from_location: string;
  item_types: string;
  limit: number;
  offset: number;
  ordering: string;
  role: ROLE;
  service: string;
  service_types: SERVICE_TYPE[];
  to_city: string;
  to_location: string;
  types: TRIP_TYPE[];
  weight: string;
  similar: boolean;
  active: string;
  biz_id: string;
}

export interface RequirementsResponse {
  count: number;
  next: string;
  previous: string;
  results: RequirementResponse[];
}
