import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { env } from "../../config/env.js";
import { registrationSchema } from "./registration-schema.js";
import { registerStudent } from "./registration.js";
import { loginSchema } from "./login-schema.js";
import { loginStudent, InvalidCredentialsError } from "./login.js";
import { requireAuthentication } from "./auth.middleware.js";
import { revokeSession } from "./session.js";
import { z } from "zod";
import { rateLimit } from "express-rate-limit";
import { prisma } from "../../lib/prisma.js";
import { sendVerificationEmail } from "./verification-email.js";
import {
  issueEmailVerificationToken,
  verifyEmailVerificationToken,
} from "./email-verification.js";

const authRouter = Router();

const emailVerificationLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    data: null,
  },
});

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
      const result = await registerStudent(validation.data);

      if (result.verificationToken) {
        try {
          await sendVerificationEmail(
            validation.data.email,
            result.verificationToken,
          );
        } catch {
          console.error("ApplyNow verification email delivery failed.");
        }
      }

      res.status(202).json({
        success: true,
        message:
          "If the address is eligible, verification instructions will be sent shortly.",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

authRouter.post(
  "/verify-email",
  emailVerificationLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = z
      .object({
        token: z.string().regex(/^[a-f0-9]{64}$/i),
      })
      .safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid or expired verification link.",
        data: null,
      });
      return;
    }

    try {
      const verified = await verifyEmailVerificationToken(
        validation.data.token,
      );

      if (!verified) {
        res.status(400).json({
          success: false,
          message: "Invalid or expired verification link.",
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Email address verified successfully.",
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
);

const verificationResendLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
    data: null,
  },
});

const resendVerificationSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
});

authRouter.post(
  "/verification/resend",
  verificationResendLimiter,
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = resendVerificationSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid email address.",
        data: null,
      });
      return;
    }

    try {
      const user = await prisma.user.findUnique({
        where: { emailNormalized: validation.data.email },
        select: {
          id: true,
          email: true,
          emailVerifiedAt: true,
        },
      });

      if (user && !user.emailVerifiedAt) {
        const verification = await issueEmailVerificationToken(user.id);

        try {
          await sendVerificationEmail(user.email, verification.token);
        } catch {
          console.error("ApplyNow verification email delivery failed.");
        }
      }

      res.status(202).json({
        success: true,
        message:
          "If the address is eligible, verification instructions will be sent shortly.",
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
        sameSite: env.NODE_ENV === "production" ? "none" : "lax",
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

authRouter.get("/me", requireAuthentication, (req, res) => {
  const user = req.authenticatedUser;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
      data: null,
    });
    return;
  }

  res.status(200).json({
    success: true,
    message: "Authenticated user retrieved.",
    data: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  });
});

authRouter.post("/logout", requireAuthentication, async (req, res, next) => {
  const user = req.authenticatedUser;

  if (!user) {
    res.status(401).json({
      success: false,
      message: "Authentication required.",
      data: null,
    });
    return;
  }

  try {
    await revokeSession(user.sessionId);

    res.clearCookie("applynow.sid", {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logout successful.",
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

export default authRouter;
