import { z } from "zod";

export const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
  agree: z.boolean().refine((val) => val === true, {
    message: "You must agree to receive marketing emails",
  }),
});

export type SubscribeFormData = z.infer<typeof subscribeSchema>;
