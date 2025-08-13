import z from 'zod'


export const OrderStepTypeEnumSchema = z.enum([
  'PAYMENT',
  'DELIVER',
  'RECEIVE',
  'DONE',
])


type OrderStepTypeEnum = z.infer<typeof OrderStepTypeEnumSchema>

export default OrderStepTypeEnum
