import { RequestActivity } from "@/services/types";

export interface YourNeedProps {
  onClose: () => void;
  activity: RequestActivity;
}

export interface AirportProps {
  origin?: boolean;
  name: string;
  iata_code: string;
  country: string;
  date: string | Date;
}
