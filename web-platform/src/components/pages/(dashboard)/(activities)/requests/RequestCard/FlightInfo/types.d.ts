import { BaseComponentProps } from "@/components/types";
import { RequestActivity, ResultActivity } from "@/services/types";

export interface AirportProps extends BaseComponentProps {
  origin?: boolean;
  name: string;
  iata_code: string;
  country: string;
  city: string;
  time: string;
  date: string;
}

export interface FlightInfoProps {
  tripData?: RequestActivity["trip_data"];
  serviceDescription?: string;
}
