import z from 'zod'
import { CostUnitEnum } from './costUnit'


export const CostSchema = z.object({
  wage: z.number().nonnegative(),
  fee: z.number().nonnegative(),
  item_price: z.number().nonnegative(),
  unit: CostUnitEnum.optional(),
})

type Cost = z.infer<typeof CostSchema>


export default Cost
