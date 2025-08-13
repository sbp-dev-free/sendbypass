import { SERVICE_TYPE } from "@/enums/globals";
import { ServiceResponse } from "@/services/types";

export interface ServicesParams {
  limit: number;
  offset: number;
  ordering: string;
  requirement: number;
}

export interface ServicesResponse {
  count: number;
  next: string;
  previous: string;
  results: ServiceResponse[];
}
