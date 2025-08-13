import z from 'zod'
import { RequirementPostSchema } from './requirement'
import { ShippingPropsSchema } from './shippingProps'
import { RequirementTypeEnum } from './requirementTypes'


export const ShippingRequirementPostSchema = RequirementPostSchema.extend({
  type: z.literal(RequirementTypeEnum.enum.SHIPPING),
  properties: ShippingPropsSchema,
})

type ShippingRequirement = z.infer<typeof ShippingRequirementPostSchema>

export const ShippingSchema = ShippingRequirementPostSchema.extend({
  id: z.number().int().nonnegative(),
  created_at: z.date(),
})

export type ShippingRequirementPost = z.infer<typeof ShippingRequirementPostSchema>


export default ShippingRequirement
