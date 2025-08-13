import z from 'zod'


export const FormStateSchema = z.enum(['READY', 'PENDING', 'ERROR', 'SUCCESS'])

type FormState = z.infer<typeof FormStateSchema>


export default FormState
