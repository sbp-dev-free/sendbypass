import z from 'zod'
import RequirementPayloadTypeEnum from './requirementPayloadTypes'


export const PackagePropsSchema = z.object({
  type: RequirementPayloadTypeEnum,
  weight: z.number().positive(),
  height: z.number().positive(),
  length: z.number().positive(),
  width: z.number().positive(),
})

type PackageProps = z.infer<typeof PackagePropsSchema>

export default PackageProps
