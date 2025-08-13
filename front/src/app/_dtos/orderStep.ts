import z from 'zod'
import { OrderStepTypeEnumSchema } from './orderStepTypeEnum'
import { OrderStepStatusEnumSchema } from './orderStepStatusEnum'
import { OrderStepPropertiesSchema } from './orderStepProperties'
import { RoleEnumSchema } from './roles'


export const OrderStepSchema = z.object({
  id: z.number().int().positive(),
  timestamp: z.date(),
  type: OrderStepTypeEnumSchema,
  status: OrderStepStatusEnumSchema,
  end_time: z.date(),
  properties: OrderStepPropertiesSchema,
  role: RoleEnumSchema,
})

type OrderStep = z.infer<typeof OrderStepSchema>

export default OrderStep
