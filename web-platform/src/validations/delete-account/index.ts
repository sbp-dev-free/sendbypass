import { z } from "zod";
export const AgreementSchema = z.object({
  agreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to delete your account.",
  }),
  email: z
    .string()
    .nonempty("Email is required")
    .email("Invalid email address"),
});
export type AgreementTypeFormData = z.infer<typeof AgreementSchema>;
