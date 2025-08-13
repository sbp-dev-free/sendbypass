import z from 'zod'


export const TekenSetSchema = z.object({
  access: z.string(),
  refresh: z.string(),
})


type TokenSet = z.infer<typeof TekenSetSchema>

export default TokenSet
