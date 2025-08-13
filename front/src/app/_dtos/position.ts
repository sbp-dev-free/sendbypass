import z from 'zod'
import { LocationSchema } from './location'


export const PositionPostSchema = z.object({
  location: z.string(),
  since: z.string().optional(),
  to: z.string(),
  comment: z.string().optional(),
})


export const PositionSchema = PositionPostSchema.extend({
  location_data: LocationSchema,
})

export type PositionPost = z.infer<typeof PositionPostSchema>

type Position = z.infer<typeof PositionSchema>

export default Position
