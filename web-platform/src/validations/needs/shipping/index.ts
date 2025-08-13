import { z } from "zod";

import { sharedNeedFormSchema, validateNonFlexibleDimensions } from "../shared";

export const createShippingNeedFormSchema = sharedNeedFormSchema.superRefine(
  (data, ctx) => {
    if (data.loadType?.value === "DOCUMENT") {
      if (data.dimension.weight !== "0") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Weight must be 0 for DOCUMENT type",
          path: ["dimension", "weight"],
        });
      }
      if (!data.dimension?.size) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Document type is required when load type is DOCUMENT",
          path: ["dimension", "size"],
        });
      } else if (data.dimension.size === "custom") {
        if (!data.dimension.width) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Width is required for custom size",
            path: ["dimension", "width"],
          });
        }
        if (!data.dimension.length) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Length is required for custom size",
            path: ["dimension", "length"],
          });
        }

        const numberRegex = /^\d+(\.\d+)?$/;
        if (data.dimension.width && !numberRegex.test(data.dimension.width)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Width must be a positive number",
            path: ["dimension", "width"],
          });
        }
        if (data.dimension.length && !numberRegex.test(data.dimension.length)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Length must be a positive number",
            path: ["dimension", "length"],
          });
        }
      }

      if (!data.dimension?.num) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Number of pages is required when load type is DOCUMENT",
          path: ["dimension", "num"],
        });
      }
    } else {
      validateNonFlexibleDimensions(data, ctx);
    }
  },
);

export type CreateShippingNeedFormData = z.infer<
  typeof createShippingNeedFormSchema
>;
