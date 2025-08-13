import { ROLE, SERVICE_TYPE, TRIP_TYPE } from "@/enums/globals";
import { Flight } from "@/services/types";

export interface TripBody {
  flight: Flight;
  ticket_number: string;
  image: File | Blob;
  description: string;
  visible: boolean;
  services: ServicesType;
  source: number;
  destination: number;
}
