import { z } from "zod";

import { sharedNeedFormSchema, validateNonFlexibleDimensions } from "../shared";

export const createShoppingNeedFormSchema = z
  .object({
    productPrice: z
      .string()
      .refine((v) => !Number.isNaN(Number(v)), {
        message: "Product price must be a number",
      })
      .refine((v) => !!v, { message: "Product price price is required" }),

    productLink: z.union([z.string().url(), z.literal("")]),
  })
  .merge(sharedNeedFormSchema)
  .superRefine((data, ctx) => {
    validateNonFlexibleDimensions(data, ctx);
  });

export type CreateShoppingNeedFormData = z.infer<
  typeof createShoppingNeedFormSchema
>;
