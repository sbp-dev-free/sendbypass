import z from 'zod'
import { PackagePropsSchema } from './packageProps'


export const ShoppingPropsSchema = PackagePropsSchema.extend({
  link: z.string().url(),
})

type ShoppingProps = z.infer<typeof ShoppingPropsSchema>

export default ShoppingProps
