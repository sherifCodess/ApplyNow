import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  CORS_ORIGIN: z.string().url().default("http://localhost:5173"),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(100),

  DATABASE_URL: z.string().url(),

  EMAIL_PROVIDER: z.enum(["sendbyte", "gmail"]).default("sendbyte"),

  SENDBYTE_API_KEY: z.string().optional(),

  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),

  EMAIL_FROM: z.string().optional(),
  APP_BASE_URL: z.string().url().default("http://localhost:5173"),
}).superRefine((config, ctx) => {
  if (config.EMAIL_PROVIDER === "gmail") {
    if (
      !config.GMAIL_USER ||
      !z.email().safeParse(config.GMAIL_USER).success
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["GMAIL_USER"],
        message: "A valid Gmail address is required when Gmail is selected.",
      });
    }

    if (!config.GMAIL_APP_PASSWORD?.trim()) {
      ctx.addIssue({
        code: "custom",
        path: ["GMAIL_APP_PASSWORD"],
        message: "A Gmail App Password is required when Gmail is selected.",
      });
    }
  }
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("Invalid environment configuration:");
  console.error(z.treeifyError(result.error));
  process.exit(1);
}

export const env = result.data;
