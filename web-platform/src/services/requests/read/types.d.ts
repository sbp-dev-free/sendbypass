import { Request, RequestSide, RequestStatus } from "@/enums/requests";
import {
  Cost,
  Deal,
  Destination,
  RequestResponse,
  UserData,
} from "@/services/types";

export interface RequestParams {
  limit: number;
  offset: number;
  ordering: string;
  side: keyof typeof RequestSide;
  activity: keyof typeof Request;
  status: keyof typeof RequestStatus;
}

export interface RequestsResponse {
  count: number;
  next: null;
  previous: null;
  results: RequestResponse[];
}
