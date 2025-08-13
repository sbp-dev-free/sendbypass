import z from 'zod'


export const RequestSideSchema = z.enum(['SENT', 'RECEIVED'])

type RequestSide = z.infer<typeof RequestSideSchema>

export default RequestSide
