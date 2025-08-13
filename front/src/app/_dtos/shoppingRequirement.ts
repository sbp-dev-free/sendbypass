import z from 'zod'
import { RequirementPostSchema } from './requirement'
import { ShoppingPropsSchema } from './shoppingProps'
import { RequirementTypeEnum } from './requirementTypes'


export const ShoppingRequirementPostSchema = RequirementPostSchema.extend({
  type: z.literal(RequirementTypeEnum.enum.SHOPPING),
  properties: ShoppingPropsSchema,
})

export type ShoppingRequirementPost = z.infer<typeof ShoppingRequirementPostSchema>

export const ShoppingRequirementSchema = ShoppingRequirementPostSchema.extend({
  id: z.number().int().nonnegative(),
  created_at: z.date(),
})

export type ShoppingRequirement = z.infer<typeof ShoppingRequirementSchema>


export default ShoppingRequirement
