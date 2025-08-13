import z from 'zod';
import parseInt from 'lodash/parseInt';
import { CostSchema } from './cost';
import { PositionPostSchema, PositionSchema } from './position';
import { RequirementTypeEnum } from './requirementTypes';
import { ShippingPropsSchema } from './shippingProps';
import { ShoppingPropsSchema } from './shoppingProps';
import { StatusEnum } from './status';
import { RoleEnumSchema } from './roles';
import { ServiceTypeEnum } from './service';

export const RequirementGetSchema = z.object({
  from_city: z.string().optional(),
  to_city: z.string().optional(),
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
  types: RequirementTypeEnum.optional(),
  weight: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().nonnegative())
    .optional(),
  cost: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(z.number().int().nonnegative())
    .optional(),
  service: z.number().int().positive().optional(),
  similar: z.boolean().optional(),
});

export type RequirementGet = z.infer<typeof RequirementGetSchema>;

export const RequirementPostSchema = z.object({
  cost: CostSchema,
  source: PositionPostSchema,
  destination: PositionPostSchema,
  type: RequirementTypeEnum,
  properties: z.union([ShippingPropsSchema, ShoppingPropsSchema]),
  status: StatusEnum.optional(),
  comment: z.string().optional(),
  image: z.string(),
  name: z.string(),
  visible: z.boolean(),
});

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
  website: z.string().url(),
  bio: z.string(),
  speak_languages: z.array(z.string()),
  status: z.string(),
  type: z.string(),
  business_name: z.string(),
});

export type RequirementPost = z.infer<typeof RequirementPostSchema>;

export const RequirementSchema = RequirementPostSchema.extend({
  id: z.number().int().positive(),
  created_at: z.date(),
  source: PositionSchema,
  destination: PositionSchema,
  user_data: GetProfileTypeSchema,
});

type Requirement = z.infer<typeof RequirementSchema>;

export default Requirement;
