import z from 'zod'
import { TekenSetSchema } from './tokenSet'


export const UserSchema = z.object({
  id: z.number().int().nonnegative(),
  email: z.string().email(),
  register_time: z.date(),
  token: TekenSetSchema,
})

type User = z.infer<typeof UserSchema>


export default User
