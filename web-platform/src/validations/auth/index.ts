import { z } from "zod";

export const EmailFormSchema = z.object({
  email: z
    .string({ message: "Email is required" })
    .email("Format is not correct"),
  referred: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 3, {
      message: "Referral code must be at least 3 characters if provided",
    }),
});

export const PasswordSchema = z.object({
  password: z
    .string({ message: "Password is required" })
    .min(8, { message: "Password must be at least 8 characters long" }),
});

export const PasswordFormSchema = z
  .object({
    password: z
      .string({ message: "Password is required" })
      .min(8, { message: "Password must be at least 8 characters long" }),
    confirm_password: z.string({ message: "Confirm password is required" }),
  })

  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
        path: ["confirm_password"],
      });
    }
  });

export type EmailFormData = z.infer<typeof EmailFormSchema>;
export type PasswordFormData = z.infer<typeof PasswordFormSchema>;
