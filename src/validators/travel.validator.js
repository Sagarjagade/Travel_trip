import { z } from "zod";

export const travelRequestSchema = z.object({

    from: z
        .string()
        .min(2, "From city is required"),

    to: z
        .string()
        .min(2, "Destination city is required"),

    days: z
        .number()
        .int()
        .min(1)
        .max(30),

    budget: z
        .number()
        .positive(),

    transport: z
        .enum([
            "train",
            "flight"
        ])
        .optional(),

    hotel: z
        .string()
        .optional(),

    interests: z
        .array(z.string())
        .optional(),

    startDate: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be YYYY-MM-DD"
        ),
    
    endDate: z
        .string()
        .regex(
            /^\d{4}-\d{2}-\d{2}$/,
            "Date must be YYYY-MM-DD"
        )
});