import { Service } from "../ServicesInfo/types";
import { FlightInfoProps, PassengerInfoProps } from "../types";

export interface TripRequestProps extends PassengerInfoProps, FlightInfoProps {
  service?: Service;
  onClose?: () => void;
  handleNext?: () => void;
  callback?: () => void;
}

export interface RequestFormProps {
  cost?: number;
  serviceId?: string;
  onClose?: () => void;
  callback?: () => void;
}
