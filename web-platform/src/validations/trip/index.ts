import { z } from "zod";
export const formSchema = z.object({
  origin: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      value: z.string().optional(),
      label: z.object({
        country: z.string().optional(),
        city: z.string().optional(),
        airport: z.string().optional(),
      }),
      type: z.string().optional(),
      displayLabel: z.string().optional(),
    })
    .nullable()
    .refine((data) => data !== null && Object.keys(data || {}).length > 0, {
      message: "Origin city is required",
    }),
  destination: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      value: z.string().optional(),
      label: z.object({
        country: z.string().optional(),
        city: z.string().optional(),
        airport: z.string().optional(),
      }),
      type: z.string().optional(),
      displayLabel: z.string().optional(),
    })
    .nullable()
    .refine((data) => data !== null && Object.keys(data || {}).length > 0, {
      message: "Destination city is required",
    }),
  originAirport: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      value: z.string().optional(),
      label: z.object({
        country: z.string().optional(),
        city: z.string().optional(),
        airport: z.string().optional(),
      }),
      type: z.string().optional(),
      displayLabel: z.string().optional(),
    })
    .nullable()
    .refine((data) => data !== null && Object.keys(data || {}).length > 0, {
      message: "Origin airport is required",
    }),
  destinationAirport: z
    .object({
      id: z.union([z.number(), z.string()]).optional(),
      value: z.string().optional(),
      label: z.object({
        country: z.string().optional(),
        city: z.string().optional(),
        airport: z.string().optional(),
      }),
      type: z.string().optional(),
      displayLabel: z.string().optional(),
    })
    .nullable()
    .refine((data) => data !== null && Object.keys(data || {}).length > 0, {
      message: "Destination airport is required",
    }),
  image: z.union([
    z
      .instanceof(File)
      .refine((file) => file !== null, {
        message: "Image is required",
      })
      .refine(
        (file) => file === null || (file && file.type.startsWith("image/")),
        {
          message: "File must be an image",
        },
      )
      .refine((file) => file === null || file.size <= 5000000, {
        message: "File size must be less than 5MB",
      }),
    z.string(),
  ]),
  airline: z.string().min(1, "Airline is required"),
  flightNumber: z.string().min(1, "Flight Number is required"),
  departureDate: z.date({
    required_error: "Departure date is required",
  }),
  departureTime: z.date({
    required_error: "Departure time is required",
  }),
  ticketNumber: z.string().min(1, "Ticket Number is required"),
  arrivalDate: z.date({
    required_error: "Arrival date is required",
  }),
  arrivalTime: z.date({
    required_error: "Arrival time is required",
  }),
  description: z
    .string()
    .max(200, "Description must be at most 200 characters")
    .optional(),
  services: z.record(z.string(), z.any()).optional(),
});
export type FormValues = z.infer<typeof formSchema>;

export const serviceSchema = z.object({
  maxWeight: z
    .union([
      z.literal("Under 1"),
      z.string().regex(/^\d+$/, "Max Weight must be a number"),
      z.number().min(0, "Max Weight must be a positive number"),
    ])
    .refine((val) => val !== "", {
      message: "Max Weight is required",
    }),
  fee: z.union([
    z
      .string()
      .nonempty("Fee is required")
      .regex(/^\d+$/, "Fee must be a number"),
    z.number().min(0, "Fee must be a positive number"),
  ]),
  description: z
    .string()
    .max(200, "Description must be at most 200 characters")
    .optional(),
});
