import z from 'zod'
import { PackagePropsSchema } from './packageProps'


export const ShippingPropsSchema = PackagePropsSchema

type ShippingProps = z.infer<typeof ShippingPropsSchema>

export default ShippingProps
