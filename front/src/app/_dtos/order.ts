import z from 'zod';
import { RequirementSchema } from './requirement';
import { ServiceSchema } from './service';
import { DealSchema } from './deal';
import { RoleEnumSchema } from './roles';
import { OrderStatusSchema } from './orderStatus';
import { OrderStepSchema } from './orderStep';
import createPaginatedSchema from './paginatedSchema';

export const OrderSchema = z.object({
  id: z.number().int().positive(),
  created_at: z.date(),
  requirement: z.number().int().positive(),
  service: z.number().int().positive(),
  requirement_data: RequirementSchema,
  service_data: ServiceSchema,
  deal: DealSchema,
  submitted_by: RoleEnumSchema,
  accepted_by: RoleEnumSchema,
  role: RoleEnumSchema,
  description: z.string().optional(),
  status: OrderStatusSchema,
  accept_time: z.date(),
  submit_time: z.date(),
  steps: z.array(OrderStepSchema),
});

export type Order = z.infer<typeof OrderSchema>;

export const PaginatedOrdersSchema = createPaginatedSchema(OrderSchema);

export type PaginatedOrders = z.infer<typeof PaginatedOrdersSchema>;

export default Order;
