import { ROLE, SERVICE_TYPE, TRIP_TYPE } from "@/enums/globals";
import {
  Cost,
  Destination,
  Flight,
  Properties,
  UserData,
} from "@/services/types";

export type RequirementType = "SHOPPING" | "SHIPPING";

export interface RequirementBody {
  type: RequirementType;
  cost: Cost;
  source: Destination;
  destination: Destination;
  properties: Properties;
  comment: string;
  image: File;
  name: string;
  visible: boolean;
}
