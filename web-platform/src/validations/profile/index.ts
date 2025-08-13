import { z } from "zod";

export const profileSchema = z.object({
  first_name: z.string().nonempty("First name is required"),
  last_name: z.string().nonempty("Last name is required"),
  email: z.string(),
  bio: z.string().max(200, "Bio must be at most 200 characters").nullable(),
  speak_languages: z.array(z.string()).optional(),
  image: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  background: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  type: z.enum(["PERSONAL", "BUSINESS"]).optional(),
});

export const businessProfileSchema = z.object({
  name: z.string().nonempty("Business name is required"),
  email: z.string(),
  tagline: z
    .string()
    .max(200, "Tagline must be at most 200 characters")
    .nullable(),
  overview: z
    .string()
    .max(400, "Overview must be at most 400 characters")
    .nullable(),
  speak_languages: z.array(z.string()).optional(),
  image: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  background: z
    .union([z.string(), z.instanceof(File)])
    .optional()
    .nullable(),
  type: z.enum(["PERSONAL", "BUSINESS"]).optional(),
  website: z
    .any()
    // .nonempty("Website is required")
    // .url("Please enter a valid URL (example: https://www.example.com)")
    .nullable(),

  biz_category: z.string().nonempty("Industry is required"),
  founded_at: z.string().nonempty("Year founded is required"),
  biz_id: z.string().nonempty("Business ID is required"),
  main_link: z.object({
    type: z.string().nonempty("Online store type is required"),
    link: z.string().nonempty("Link/ID is required"),
  }),
});

export const contactSchema = z.object({
  mobiles: z.array(
    z.object({
      id: z.string(),
      phone: z
        .string()
        .min(8, "Phone number must be at least 8 digits")
        .max(20, "Phone number must be at most 20 digits"),
      countryTag: z.string().optional(),
      zone_code: z.string().nonempty("Zone code is required"),
    }),
  ),
  socials: z.array(
    z.object({
      id: z.string(),
      type: z.string().min(1, "Required"),
      link: z.string().min(3, "Invalid link"),
    }),
  ),
});

export const addressSchema = z.object({
  addresses: z.array(
    z.object({
      id: z.string(),
      country: z.string().min(1, "Country is required"),
      city: z.string().min(1, "City is required"),
      description: z.string().nonempty("Is required"),
    }),
  ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
export type BusinessProfileFormValues = z.infer<typeof businessProfileSchema>;
export type ContactFormValues = z.infer<typeof contactSchema>;
export type AddressFormValues = z.infer<typeof addressSchema>;
