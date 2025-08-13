export interface AirportResultType {
  count: number;
  next: null;
  previous: null;
  results: Airport[];
}
export interface LocationResultType {
  count: number;
  next: null;
  previous: null;
  results: Location[];
}
export interface Airport {
  id: number;
  location?: any;
  name: string;
  type?: Type;
  iata_code?: string;
  website?: string;
  airport_code?: string;
  label: JSX.Element;
  value: string;
  displayLabel: string;
}
export interface Location {
  value: string;
  city: string;
  displayLabel: string;
  id: number | string;
  country: string;
  label: JSX.Element;
}
export interface ServicePropsType {
  type?: string;
  max_weight?: string;
  fee?: string;
  description?: string;
  services?: Record<string, ServiceType>;
  setService: (service: Record<string, ServiceType>) => void;
}

export interface ServiceType {
  id?: number;
  type: string | undefined;
  properties: {
    type: string | undefined;
    weight: string;
  };
  cost: {
    wage: string;
  };
  description: string;
}
export interface Label {
  airport: string;
  city: string;
  country: string;
}
export interface PreviewData {
  image?: File | null | string;
  origin?: {
    id: number;
    label: Label;
  };
  destination?: {
    id: number;
    label: Label;
  };
  airline?: string;
  flightNumber?: string;
  ticketNumber?: string;
  description?: string;
  services?: {
    [key: string]: {
      properties: { weight: number };

      cost: { wage: number };

      description: string;
    };
  };
  originAirport: {
    id: number;
    label: Label;
  };
  destinationAirport: {
    id: number;
    label: Label;
  };
  departureDate: string;
  departureTime: string;
  arrivalDate: string;
  arrivalTime: string;
}

export interface PreviewProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (isPublic: boolean) => void;
  data: PreviewData;
  loading: boolean;
}
export interface TripFormProps {
  mode: "create" | "edit";
  tripId?: string;
}
