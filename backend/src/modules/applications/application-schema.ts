import { z } from "zod";

const requiredText = (max = 200) =>
  z.string().trim().min(1, "This field is required.").max(max);

const phoneSchema = z
  .string()
  .trim()
  .regex(/^[0-9+()\-\s]{7,20}$/, "Enter a valid phone number.");

const dateOfBirthSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date of birth.")
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);

    return (
      !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
    );
  }, "Enter a valid date of birth.")
  .refine((value) => {
    const today = new Date().toISOString().slice(0, 10);
    return value <= today;
  }, "Date of birth cannot be in the future.");

const gpaSchema = z
  .string()
  .trim()
  .min(1, "GPA is required.")
  .regex(/^(?:\d+(?:\.\d*)?|\.\d+)$/, "Enter a valid GPA.")
  .transform(Number)
  .pipe(z.number().finite().min(0).max(5));

export const personalSchema = z.object({
  firstName: requiredText(100),
  lastName: requiredText(100),
  dateOfBirth: dateOfBirthSchema,
  gender: z.enum(["Female", "Male", "Prefer not to say"]),
  email: z.string().trim().email().max(254),
  phone: phoneSchema,
  address: requiredText(500),
});

export const academicSchema = z.object({
  previousSchool: requiredText(200),
  qualification: z.enum([
    "WAEC / SSCE",
    "NECO",
    "IB Diploma",
    "A-Levels",
    "Other",
  ]),
  graduationYear: z.coerce.number().int().min(1980).max(2035),
  gpa: gpaSchema,
  programme: z.enum([
    "Computer Science",
    "Software Engineering",
    "Information Technology",
    "Business Administration",
    "Mass Communication",
  ]),
});

export const guardianSchema = z.object({
  guardianName: requiredText(200),
  relationship: z.enum(["Parent", "Sibling", "Legal Guardian", "Other"]),
  guardianPhone: phoneSchema,
  guardianEmail: z
    .union([z.string().trim().email().max(254), z.literal("")])
    .optional(),
  guardianAddress: requiredText(500),
});

export const createApplicationSchema = z.object({
  personal: personalSchema,
  academic: academicSchema,
  guardian: guardianSchema,
});

export const reviewApplicationSchema = z.object({
  status: z.enum(["Approved", "Rejected"]),
});

export type CreateApplicationInput = z.infer<typeof createApplicationSchema>;

export type ReviewApplicationInput = z.infer<typeof reviewApplicationSchema>;
