import {
  Cost,
  Destination,
  Flight,
  Properties,
  UserData,
} from "@/services/types";

export type ServiceType = "SHOPPING" | "SHIPPING";

export interface ServiceBody {
  trip: number;
  type: ServiceType;
  cost: Cost;
  properties: Properties;
  description: string;
}
