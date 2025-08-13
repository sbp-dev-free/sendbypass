import z from 'zod'


export const CostUnitEnum = z.enum(['USD', 'EURO', 'YEN']).default('USD')

type CostUnit = z.infer<typeof CostUnitEnum>

export default CostUnit
