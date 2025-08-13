import z from 'zod'


export const OrderStatusSchema = z.enum([
  'SUBMITTED',
  'ACCEPTED',
  'PENDING',
  'PROCESSING',
  'DELIVERED',
  'REJECTED',
  'CANCELED',
  'FINISHED',
])

type OrderStatus = z.infer<typeof OrderStatusSchema>

export default OrderStatus
