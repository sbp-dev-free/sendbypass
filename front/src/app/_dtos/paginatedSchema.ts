import z from 'zod'


const PaginatedSchemaFields = {
  count: z.number().int().nonnegative(),
  next: z.string().url(),
  previous: z.string().url(),
  results: z.array(z.any()).default([]),
}

const createPaginatedSchema = <T extends z.ZodTypeAny>(schema: T) => (
  z.object({
    ...PaginatedSchemaFields,
    results: z.array(schema).default([]),
  })
)

export default createPaginatedSchema
