import { Flight, TripResponse, UserData } from "@/services/types";

import { ServiceUnion } from "./ServicesInfo/types";

export interface PassengerCardProps {
  trip: TripResponse;
}

export interface PassengerInfoProps {
  id: number;
  name: string;
  rate: number;
  image: string;
  isVerified: boolean;
  user: UserData;
}

export interface FlightInfoProps {
  flight: Flight;
  description: string;
  className?: string;
}

export interface ActionBarProps {
  selectedServiceInfo: {
    type: string;
    description: string;
  };
  onOpenReviewModal: () => void;
}
