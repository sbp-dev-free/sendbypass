import z from 'zod';
import parseInt from 'lodash/parseInt';
import { FlightPostSchema } from './flight';
import createPaginatedSchema from './paginatedSchema';
import { ServiceSchema, ServiceTypeEnum } from './service';
import { RoleEnumSchema } from './roles';
import { RequirementTypeEnum } from './requirementTypes';
import { TripDataSchema } from './tripData';

export const TripGetSchema = z.object({
  from_city: z.string().optional(),
  to_city: z.string().optional(),
  weight: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().nonnegative())
    .optional(),
  offset: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().nonnegative())
    .optional(),
  limit: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().nonnegative())
    .optional(),
  role: RoleEnumSchema.optional(),
  service_types: z
    .union([ServiceTypeEnum, z.array(ServiceTypeEnum)])
    .optional(),
  type: RequirementTypeEnum.optional(),
  cost: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().nonnegative())
    .optional(),
  similar: z.boolean().optional(),
});

export type TripGet = z.infer<typeof TripGetSchema>;

const TripPostSchema = z.object({
  flight: FlightPostSchema,
  ticket_number: z.string(),
  image: z.instanceof(Blob).nullish(),
  description: z.string().nullish(),
});

export type TripPost = z.infer<typeof TripPostSchema>;

export const TripSchema = TripDataSchema.extend({
  services: z.array(ServiceSchema),
});

type Trip = z.infer<typeof TripSchema>;

const PaginatedTripsSchema = createPaginatedSchema(TripSchema);

export type PaginatedTrips = z.infer<typeof PaginatedTripsSchema>;

export default Trip;

export interface Service {
  id: number;
  created_at: Date;
  trip: number;
  type: string;
  properties: Properties;
  cost: Cost;
  role: string;
  description: string;
  user: number;
  requests: any[];
  trip_data: any;
}

export interface GetTripResultType {
  id: number;
  flight: Flight;
  ticket_number: string;
  services?: Service[];
  image: null;
  description: null;
  status: string;
}

export interface Cost {
  wage: number;
  fee: null;
  item_price: null;
  unit: string;
}

export interface Properties {
  type: string;
  weight: number;
  height?: number;
  length?: number;
  width?: number;
}

export interface Flight {
  id: number;
  source: Destination;
  destination: Destination;
  number: string;
  airline: string;
}

export interface Destination {
  location: number;
  location_data: LocationData;
  since: Date;
  to: Date;
  comment: null;
}

export interface LocationData {
  id: number;
  city: string;
  airport: string;
  longitude: number;
  latitude: number;
}
