import z from 'zod'


export const SelectOptionSchema = z.object({
  label: z.string(),
  value: z.string().or(z.number().int()),
})

export const SelectOptionsSchema = z.array(SelectOptionSchema).default([])

type SelectOptions = z.infer<typeof SelectOptionsSchema>


export default SelectOptions
