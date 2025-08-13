export type ServiceUnion = "DOCUMENT" | "CARGO" | "SHOPPING";
export interface Service {
  id: string;
  type: ServiceUnion;
  wage: number;
  weight: number;
  description: string;
}
export interface ServiceServiceProps extends Partial<Omit<Service, "id">> {
  isSelected?: boolean;
  onClick?: () => void;
}

export interface ServicesInfoProps {
  services: Service[];
  serviceId: string;
  setServiceId: (id: string) => void;
}
