import z from 'zod';
import { DealSchema } from './deal';
import { RequirementSchema } from './requirement';
import { ServiceSchema } from './service';
import { RoleEnumSchema } from './roles';
import { RequirementTypeEnum } from './requirementTypes';
import { RequestSideSchema } from './requestSide';
import createPaginatedSchema from './paginatedSchema';

export const RequestGetSchema = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
  side: RequestSideSchema.optional(),
  type: RequirementTypeEnum.optional(),
  status: z.string().optional(),
  ordering: z.string().optional(),
});

export type RequestGet = z.infer<typeof RequestGetSchema>;

export const RequestPostSchema = z.object({
  requirement: z.number().int().positive(),
  service: z.number().int().positive(),
  deal: DealSchema.partial().required({ cost: true }),
  description: z.string().optional(),
});

export type RequestPost = z.infer<typeof RequestPostSchema>;

const phoneNumberSchema = z.object({
  zip_code: z.string(),
  area_code: z.string(),
  phone: z.string(),
  socials: z.array(
    z.object({
      type: z.string(),
      link: z.string(),
    }),
  ),
});

const statsSchema = z.object({
  avg_rate: z.number(),
  total_successful_orders: z.number(),
});

const userDataSchema = z.object({
  register_time: z.date(),
  addresses: z.array(
    z.object({
      city: z.string(),
      longitude: z.string(),
      latitude: z.string(),
      id: z.number(),
      country: z.string(),
      district: z.string(),
      area: z.string(),
      zone: z.string(),
      description: z.string(),
    }),
  ),
  socials: z.array(
    z.object({
      type: z.string(),
      link: z.string(),
    }),
  ),
  phone_number: phoneNumberSchema,
  email: z.string().email(),
  stats: statsSchema,
  first_name: z.string(),
  last_name: z.string(),
  image: z.string(),
  id: z.number(),
});

export const RequestSchema = z.object({
  id: z.number().int().positive(),
  created_at: z.date(),
  requirement: z.number().int().positive(),
  requirement_data: RequirementSchema,
  service: z.number().int().positive(),
  service_data: ServiceSchema,
  deal: DealSchema,
  submitted_by: z.string(),
  submit_time: z.string(),
  accepted_by: z.string(),
  role: RoleEnumSchema,
  description: z.string().optional(),
  customer_data: userDataSchema,
  traveler_data: userDataSchema,
  status: z.string(),
});

export type Request = z.infer<typeof RequestSchema>;

export const PaginatedRequestsSchema = createPaginatedSchema(RequestSchema);

export type PaginatedRequests = z.infer<typeof PaginatedRequestsSchema>;

export default Request;
