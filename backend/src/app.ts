import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { env } from "./config/env.js";
import authRouter from "./modules/auth/auth.routes.js";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(
  rateLimit({
    windowMs: env.RATE_LIMIT_WINDOW_MS,
    limit: env.RATE_LIMIT_MAX_REQUESTS,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later.",
      errors: null,
    },
  }),
);

app.use(express.json({ limit: "1mb" }));
app.use("/api/v1/auth", authRouter);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ApplyNow API is running.",
    data: {
      status: "ok",
    },
  });
});

export default app;
