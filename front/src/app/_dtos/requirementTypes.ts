import z from 'zod';

export const RequirementTypeEnum = z.enum(['SHOPPING', 'SHIPPING']);

type RequirementType = z.infer<typeof RequirementTypeEnum>;

export default RequirementType;

export interface GetRequirementResultType {
  id: number;
  created_at: Date;
  type: string;
  cost: Cost;
  source: Destination;
  destination: Destination;
  properties: Properties;
  status: string;
  comment: string;
  image: string;
  name: string;
  role: string;
  requests: any[];
}

export interface Cost {
  wage: number;
  fee: null;
  item_price: null;
  unit: string;
}

export interface Destination {
  location: number;
  location_data: LocationData;
  since: null;
  to: Date | null;
  comment: null;
}

export interface LocationData {
  id: number;
  city: string;
  airport: string;
  longitude: number;
  latitude: number;
}

export interface Properties {
  type: string;
  weight: number;
  height: number;
  length: number;
  width: number;
}
