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

export interface TripFormDataType {
  flight: any;
  description: any;
  image: any;
  services?: Record<string, ServiceType>;
  onClose: () => void;
}
