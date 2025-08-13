import { z } from 'zod'


export const RoleEnumSchema = z.enum(['TRAVELER', 'CUSTOMER'])

type Role = z.infer<typeof RoleEnumSchema>

export default Role
