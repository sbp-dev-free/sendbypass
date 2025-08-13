import { z } from "zod";

export const envSchema = z.object({
  NEXT_PUBLIC_BASE_API_URL: z
    .string()
    .url()
    .nonempty("NEXT_PUBLIC_BASE_API_URL is required"),
  NEXT_PUBLIC_API_VERSION: z
    .string()
    .nonempty("NEXT_PUBLIC_API_VERSION is required"),
});
