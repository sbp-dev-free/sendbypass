import z from 'zod'


export const OrderStepStatusEnumSchema = z.enum([
  'WAITING',
  'PENDING',
  'FAILED',
  'DONE',
])

type OrderStepStatusEnum = z.infer<typeof OrderStepStatusEnumSchema>

export default OrderStepStatusEnum
