import * as z from "zod";

export const contactUsSchema = z.object({
  name: z.string().nonempty("Name is required"),
  topic: z.string({ message: "Topic is required" }),
  email: z.string().email("Invalid email address"),
  phone_number: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(20, "Phone number must be at most 20 digits"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  consent: z
    .boolean()
    .refine((val) => val === true, "You must agree to the terms"),
  subscribe: z.boolean(),
});

export type ContactUsTypeFormData = z.infer<typeof contactUsSchema>;
