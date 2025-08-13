import z from 'zod'


export const TravelerPaymentPropertiesSchema = z.object({
  description: z.string().optional(),
})
export type TravelerPaymentProperties = z.infer<typeof TravelerPaymentPropertiesSchema>

export const CustomerPaymentPropertiesSchema = z.object({
  description: z.string().optional(),
  link: z.string().url(),
})
export type CustomerPaymentProperties = z.infer<typeof CustomerPaymentPropertiesSchema>

export const CustomerDeliverPropertiesSchema = z.object({
  description: z.string().optional(),
  code: z.string(),
})
export type CustomerDeliverProperties = z.infer<typeof CustomerDeliverPropertiesSchema>

export const TravelerReceivePropertiesSchema = z.object({
  description: z.string().optional(),
  code: z.string(),
})
export type TravelerReceiveProperties = z.infer<typeof TravelerReceivePropertiesSchema>

export const CustomerReceivePropertiesSchema = z.object({
  description: z.string().optional(),
  code: z.string(),
})
export type CustomerReceiveProperties = z.infer<typeof CustomerReceivePropertiesSchema>

export const TravelerDeliverPropertiesSchema = z.object({
  description: z.string().optional(),
  code: z.string(),
})
export type TravelerDeliverProperties = z.infer<typeof TravelerDeliverPropertiesSchema>


export const OrderStepPropertiesSchema = z.union([
  TravelerPaymentPropertiesSchema,
  CustomerPaymentPropertiesSchema,
  CustomerDeliverPropertiesSchema,
  TravelerReceivePropertiesSchema,
  CustomerReceivePropertiesSchema,
  TravelerDeliverPropertiesSchema,
])

type OrderStepProperties = z.infer<typeof OrderStepPropertiesSchema>

export default OrderStepProperties
