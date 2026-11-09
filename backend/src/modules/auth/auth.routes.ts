import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { env } from "../../config/env.js";
import { registrationSchema } from "./registration-schema.js";
import { registerStudent } from "./registration.js";
import { loginSchema } from "./login-schema.js";
import { loginStudent, InvalidCredentialsError } from "./login.js";

const authRouter = Router();

authRouter.post(
  "/register",
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = registrationSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid registration details.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      await registerStudent(validation.data);

      res.status(202).json({
        success: true,
        message:
          "Registration accepted. Email verification delivery is not configured yet.",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid login details.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const { session } = await loginStudent(validation.data);

      res.cookie("applynow.sid", session.token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: session.expiresAt,
      });

      res.status(200).json({
        success: true,
        message: "Login successful.",
        data: null,
      });
    } catch (error) {
      if (error instanceof InvalidCredentialsError) {
        res.status(401).json({
          success: false,
          message: "Invalid email or password.",
          data: null,
        });
        return;
      }

      next(error);
    }
  },
);

export default authRouter;
