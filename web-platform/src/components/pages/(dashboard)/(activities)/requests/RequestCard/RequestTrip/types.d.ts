import { ResultActivity, ResultRequest } from "@/services/types";

export interface RequestTripProps {
  request: ResultRequest;
  activity: ResultActivity;
  isService: boolean;
  inbox: boolean;
}

export interface StatusProps {
  status: StatusValue;
}
