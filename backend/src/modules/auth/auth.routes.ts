import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { registrationSchema } from "./registration-schema.js";
import { registerStudent } from "./registration.js";

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

export default authRouter;
