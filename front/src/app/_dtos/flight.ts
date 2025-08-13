import z from 'zod'
import { PositionPostSchema, PositionSchema } from './position'


export const FlightPostSchema = z.object({
  source: PositionPostSchema,
  destination: PositionPostSchema,
  airline: z.string(),
  number: z.string().nullish(),
})


export type FlightPost = z.infer<typeof FlightPostSchema>


export const FlightSchema = z.object({
  id: z.number().int().nonnegative(),
  source: PositionSchema,
  destination: PositionSchema,
  airline: z.string(),
  number: z.string().nullish(),
})


type Flight = z.infer<typeof FlightSchema>


export default Flight
