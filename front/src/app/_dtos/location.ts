import z from 'zod';

export const AirportSchema = z.object({
  type: z.string(),
  iata_code: z.string(),
  website: z.string(),
  airport_code: z.string(),
  name: z.string(),
});

export const LocationPostSchema = z.object({
  area: z.string().nullable(),
  city: z.string(),
  country: z.string(),
  description: z.string().nullable(),
  district: z.string().nullable(),
  id: z.number().int().nonnegative(),
  latitude: z.number().finite(),
  longitude: z.number().finite(),
  zone: z.string().nullable(),
  country_iso2: z.string(),
  country_iso3: z.string(),
  airport: AirportSchema,
});

export type LocationPost = z.infer<typeof LocationPostSchema>;

export const LocationSchema = LocationPostSchema.extend({
  id: z.number().int().nonnegative(),
});

export type Location = z.infer<typeof LocationSchema>;

export const LocationsSchema = z.array(LocationSchema);

export type Locations = z.infer<typeof LocationsSchema>;

export default Location;
