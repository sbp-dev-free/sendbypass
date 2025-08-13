import z from 'zod'


export const DealSchema = z.object({
  cost: z.number().positive(),
  traveler_fee: z.number().positive().optional(),
  requester_fee: z.number().positive().optional(),
})


type Deal = z.infer<typeof DealSchema>


export default Deal
