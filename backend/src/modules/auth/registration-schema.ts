import { z } from "zod";

export const registrationSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(15, "Password must not exceed 15 characters.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[^A-Za-z0-9\s]/,
      "Password must contain at least one special character.",
    ),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
