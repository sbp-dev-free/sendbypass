import { z } from 'zod'
import createPaginatedSchema from './paginatedSchema'
import { RequirementSchema } from './requirement'


export const PaginatedRequirementSchema = createPaginatedSchema(RequirementSchema)

type PaginatedRequirements = z.infer<typeof PaginatedRequirementSchema>

export default PaginatedRequirements
