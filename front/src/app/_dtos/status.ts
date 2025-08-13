import z from 'zod'


export const StatusEnum = z.enum(['PENDING', 'SUBMITTED', 'ACCEPTED', 'RECIEVED', 'DELIVERED'])


type Status = z.infer<typeof StatusEnum>

export default Status
