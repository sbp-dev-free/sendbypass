import { RequestResponse } from "@/services/types";

export interface RequestHeaderProps {
  inbox: boolean;
  isService: boolean;
  count: number;
  activity: RequestResponse["activity"];
}

export interface RequestCardProps {
  requests: RequestResponse;
}
