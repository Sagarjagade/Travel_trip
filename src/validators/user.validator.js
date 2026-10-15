import { z } from "zod";

export const UserRequestSchema = z.object({

    first_name: z
        .string()
        .min(2, "First Name is required"),

    last_name: z
        .string()
        .min(2, "Last Name is required"),

    email: z
        .email(),

    mobile: z
        .string()
        .min(10, "Mobile is required"),
    
    password: z
        .string()
        .min(2, "Password is required"),

    confirm_password: z
        .string()
        .min(2, "Confirm Password is required"),
});

export const UserLoginRequestSchema = z.object({

    mobile: z
        .string()
        .min(10, "Mobile is required"),

    password: z
        .string()
        .min(2, "Password is required"),
});