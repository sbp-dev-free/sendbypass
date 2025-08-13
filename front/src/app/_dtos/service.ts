import z from 'zod';
import { RequirementTypeEnum } from './requirementTypes';
import { PackagePropsSchema } from './packageProps';
import { CostSchema } from './cost';
import { RoleEnumSchema } from './roles';
import createPaginatedSchema from './paginatedSchema';
import { TripDataSchema } from './tripData';

export const ServiceTypeEnum = z.enum(['VISIBLE_LOAD', 'DOCUMENT']);
export type ServiceType = z.infer<typeof ServiceTypeEnum>;

export const ServiceGetSchema = z.object({
  limit: z.number().int().positive().optional(),
  offset: z.number().int().nonnegative().optional(),
  requirement: z.number().int().positive().optional(),
});

export type ServiceGet = z.infer<typeof ServiceGetSchema>;

export const ShoppingVisibleLoadPropertiesSchema = z.object({
  type: z
    .literal(ServiceTypeEnum.Values.VISIBLE_LOAD)
    .default(ServiceTypeEnum.Values.VISIBLE_LOAD),
  weight: z.number().positive(),
});

export const ShippingDocumentPropertiesSchema = z.object({
  type: z
    .literal(ServiceTypeEnum.Values.DOCUMENT)
    .default(ServiceTypeEnum.Values.DOCUMENT),
  weight: z.number().positive(),
});

export const ShippingVisibleLoadPropertiesSchema = PackagePropsSchema.extend({
  type: z
    .literal(ServiceTypeEnum.Values.VISIBLE_LOAD)
    .default(ServiceTypeEnum.Values.VISIBLE_LOAD),
});

export const ServicePropertiesSchema = z.union([
  ShippingVisibleLoadPropertiesSchema,
  ShoppingVisibleLoadPropertiesSchema,
  ShippingDocumentPropertiesSchema,
]);

export type ServiceProperties = z.infer<typeof ServicePropertiesSchema>;

export const ServicePostSchema = z.object({
  trip: z.number().nonnegative(),
  type: RequirementTypeEnum,
  properties: ServicePropertiesSchema,
  cost: CostSchema.extend({
    fee: z.number().nullish(),
    item_price: z.number().nullish(),
  }),
  description: z.string().optional(),
});

export const ServicePatchSchema = z.object({
  type: RequirementTypeEnum,
  properties: ServicePropertiesSchema,
  cost: CostSchema.extend({
    fee: z.number().nullish(),
    item_price: z.number().nullish(),
  }),
  description: z.string().optional(),
});

export type ServicePost = z.infer<typeof ServicePostSchema>;
export type ServicePatch = z.infer<typeof ServicePatchSchema>;

export const ServiceSchema = ServicePostSchema.extend({
  id: z.number().int().positive(),
  created_at: z.date(),
  role: RoleEnumSchema,
  trip_data: TripDataSchema,
  requests: z.array(z.any()),
  user: z.number().int().positive(),
});

type Service = z.infer<typeof ServiceSchema>;

export const PaginatedServicesSchema = createPaginatedSchema(ServiceSchema);

export type PaginatedServices = z.infer<typeof PaginatedServicesSchema>;

export default Service;
