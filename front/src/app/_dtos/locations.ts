import { z } from 'zod'
import { LocationSchema } from './location'
import createPaginatedSchema from './paginatedSchema'


export const PaginatedLocationsSchema = createPaginatedSchema(LocationSchema)

type PaginatedLocations = z.infer<typeof PaginatedLocationsSchema>

export default PaginatedLocations
