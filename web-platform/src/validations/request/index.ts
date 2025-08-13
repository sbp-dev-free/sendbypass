import { z } from "zod";

export const tripRequestSchema = z.object({
  requirement: z.number(),
  reward: z
    .number({ invalid_type_error: "Reward must be a number" })
    .positive("Reward must be greater than zero"),
  description: z.string().max(200, "Description cannot exceed 200 characters"),
});

export type TripRequestFormValues = z.infer<typeof tripRequestSchema>;

export const requirementRequestSchema = z.object({
  service: z.string(),
  reward: z
    .number({ invalid_type_error: "Reward must be a number" })
    .positive("Reward must be greater than zero"),
  description: z.string().max(200, "Description cannot exceed 200 characters"),
});

export type RequirementRequestFormValues = z.infer<
  typeof requirementRequestSchema
>;
