import z from 'zod'


export const ProfileSchema = z.object({
  email: z.string().email(),
  register_time: z.date(),
})


type Profile = z.infer<typeof ProfileSchema>

export default Profile
