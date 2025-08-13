import { z } from 'zod';
import { FlightSchema } from './flight';

const PhoneNumberSchema = z.object({
  zip_code: z.object({
    country: z.string(),
    zip_code: z.string(),
  }),
  area_code: z.string(),
  phone: z.string(),
  socials: z.array(z.string()),
});

const StatsSchema = z.object({
  total_successful_orders: z.number(),
  avg_rate: z.number(),
});

const SocialsTypeSchema = z.object({
  type: z.string(),
  link: z.string(),
});

const GetProfileTypeSchema = z.object({
  register_time: z.date(),
  socials: z.array(SocialsTypeSchema),
  addresses: z.array(z.any()),
  current_location: z.number(),
  phone_number: PhoneNumberSchema,
  email: z.string().email(),
  stats: StatsSchema,
  first_name: z.string(),
  last_name: z.string(),
  image: z.string(),
  background: z.string(),
  website: z.string().url().optional(),
  bio: z.string(),
  speak_languages: z.array(z.string()),
  status: z.string(),
});

export const TripDataSchema = z.object({
  id: z.number().int().positive(),
  flight: FlightSchema,
  image: z.string(),
  description: z.string().nullish(),
  status: z.string(),
  user_data: GetProfileTypeSchema,
  ticket_number: z.string(),
  visible: z.boolean(),
});

type TripData = z.infer<typeof TripDataSchema>;

export default TripData;
