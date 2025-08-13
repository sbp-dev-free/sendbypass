import { z } from "zod";

export const locationSchema = z
  .object({
    id: z.number(),
    value: z.string().optional(),
    label: z.object({
      country: z.string(),
      city: z.string().nullable(),
      airport: z.string(),
    }),
    type: z.string(),
  })
  .nullable();

export type LocationOption = z.infer<typeof locationSchema>;

const imageSchema = z.union([z.instanceof(File), z.string()]).nullable();

export const sharedNeedFormSchema = z.object({
  productName: z
    .string()
    .refine((val) => !!val, { message: "Product name is required" }),

  loadType: z
    .object({
      value: z.enum([
        "DOCUMENT",
        "CLOTH",
        "FOOD",
        "ELECTRONIC_GADGET",
        "OTHER",
      ]),
      label: z.string(),
    })
    .nullable()
    .refine((val) => !!val?.value, {
      message: "Load type is required",
    }),

  dimension: z.object({
    isFlexible: z.boolean().default(false),
    weight: z.string(),
    width: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          if (/^0\d+/.test(val)) {
            return false;
          }
          const numValue = parseFloat(val);
          if (!isNaN(numValue) && numValue > 0) {
            return true;
          }
          return false;
        },
        {
          message: "Width must be greater than zero",
        },
      ),
    length: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          if (/^0\d+/.test(val)) {
            return false;
          }
          const numValue = parseFloat(val);
          if (!isNaN(numValue) && numValue > 0) {
            return true;
          }
          return false;
        },
        {
          message: "Length must be greater than zero",
        },
      ),
    height: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          if (/^0\d+/.test(val)) {
            return false;
          }
          const numValue = parseFloat(val);
          if (!isNaN(numValue) && numValue > 0) {
            return true;
          }
          return false;
        },
        {
          message: "Height must be greater than zero",
        },
      ),
    size: z.string().nullable().optional(),
    num: z.number().optional(),
  }),

  images: z.tuple([
    imageSchema.refine((val) => !!val, {
      message: "Main image is required",
    }),
    imageSchema,
    imageSchema,
    imageSchema,
    imageSchema,
  ]),

  origin: locationSchema.refine((value) => !!value?.id, {
    message: "Origin is required",
  }),

  destination: locationSchema.refine((value) => !!value?.id, {
    message: "Destination is required",
  }),

  douDate: z.date().nullable(),

  proposedPrice: z
    .string()
    .refine((v) => !Number.isNaN(Number(v)), {
      message: "Proposed price must be a number",
    })
    .refine((v) => !!v, { message: "Proposed price is required" }),

  description: z
    .string()
    .max(200, "Description must be at most 200 characters")
    .optional(),
});

export function validateNonFlexibleDimensions(
  data: z.infer<typeof sharedNeedFormSchema>,
  ctx: z.RefinementCtx,
) {
  if (!data.dimension.isFlexible && !data.dimension.width?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Width is required when dimensions are not flexible",
      path: ["dimension", "width"],
    });
  }
  if (!data.dimension.isFlexible && !data.dimension.length?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Length is required when dimensions are not flexible",
      path: ["dimension", "length"],
    });
  }
  if (!data.dimension.isFlexible && !data.dimension.height?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Height is required when dimensions are not flexible",
      path: ["dimension", "height"],
    });
  }
  if (!data.dimension.weight || /^0\d+/.test(data.dimension.weight)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Weight is required and must not start with 0",
      path: ["dimension", "weight"],
    });
  } else {
    const numValue = parseFloat(data.dimension.weight);
    if (isNaN(numValue) || numValue <= 0) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Weight must be greater than zero",
        path: ["dimension", "weight"],
      });
    }
  }
}
