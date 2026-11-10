import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { requireAuthentication } from "../auth/auth.middleware.js";
import { requireRole } from "../auth/require-role.js";
import {
  createApplicationSchema,
  reviewApplicationSchema,
} from "./application-schema.js";
import {
  createApplication,
  getLatestStudentApplication,
  listApplications,
  getApplicationById,
  reviewApplication,
  PendingApplicationExistsError,
  ApplicationNotFoundError,
  ApplicationAlreadyReviewedError,
} from "./application.service.js";

const applicationRouter = Router();

const idSchema = z.string().uuid();

const sendError = (error: unknown, res: Response, next: NextFunction): void => {
  if (error instanceof PendingApplicationExistsError) {
    res.status(409).json({
      success: false,
      message: error.message,
      data: null,
    });
    return;
  }

  if (error instanceof ApplicationNotFoundError) {
    res.status(404).json({
      success: false,
      message: error.message,
      data: null,
    });
    return;
  }

  if (error instanceof ApplicationAlreadyReviewedError) {
    res.status(409).json({
      success: false,
      message: error.message,
      data: null,
    });
    return;
  }

  next(error);
};

const studentAccess = [requireAuthentication, requireRole("STUDENT")];

const adminAccess = [
  requireAuthentication,
  requireRole("ADMISSIONS_ADMIN", "SUPER_ADMIN"),
];

// Student: submit an application.
applicationRouter.post(
  "/",
  ...studentAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = createApplicationSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid application details.",
        errors: validation.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const user = req.authenticatedUser;

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Authentication required.",
          data: null,
        });
        return;
      }

      const application = await createApplication(user.id, validation.data);

      res.status(201).json({
        success: true,
        message: "Application submitted successfully.",
        data: application,
      });
    } catch (error) {
      sendError(error, res, next);
    }
  },
);

// Student: retrieve their own latest application.
applicationRouter.get(
  "/mine",
  ...studentAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req.authenticatedUser;

      if (!user) {
        res.status(401).json({
          success: false,
          message: "Authentication required.",
          data: null,
        });
        return;
      }

      const application = await getLatestStudentApplication(user.id);

      res.status(200).json({
        success: true,
        message: application
          ? "Application retrieved successfully."
          : "No application found.",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Admin: list all applications, optionally filtered by status.
applicationRouter.get(
  "/",
  ...adminAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    const statusSchema = z.enum(["Pending", "Approved", "Rejected"]);

    const rawStatus = req.query.status;

    let status: "Pending" | "Approved" | "Rejected" | undefined;

    if (rawStatus !== undefined && rawStatus !== "All") {
      const validation = statusSchema.safeParse(rawStatus);

      if (!validation.success) {
        res.status(400).json({
          success: false,
          message: "Invalid application status filter.",
          data: null,
        });
        return;
      }

      status = validation.data;
    }

    try {
      const applications = await listApplications(status);

      res.status(200).json({
        success: true,
        message: "Applications retrieved successfully.",
        data: applications,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Admin: retrieve one application.
applicationRouter.get(
  "/:id",
  ...adminAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    const validation = idSchema.safeParse(req.params.id);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID.",
        data: null,
      });
      return;
    }

    try {
      const application = await getApplicationById(validation.data);

      if (!application) {
        res.status(404).json({
          success: false,
          message: "Application not found.",
          data: null,
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "Application retrieved successfully.",
        data: application,
      });
    } catch (error) {
      next(error);
    }
  },
);

// Admin: approve or reject a pending application.
applicationRouter.patch(
  "/:id",
  ...adminAccess,
  async (req: Request, res: Response, next: NextFunction) => {
    const idValidation = idSchema.safeParse(req.params.id);

    if (!idValidation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid application ID.",
        data: null,
      });
      return;
    }

    const bodyValidation = reviewApplicationSchema.safeParse(req.body);

    if (!bodyValidation.success) {
      res.status(400).json({
        success: false,
        message: "Invalid application review details.",
        errors: bodyValidation.error.flatten().fieldErrors,
      });
      return;
    }

    try {
      const application = await reviewApplication(
        idValidation.data,
        bodyValidation.data,
      );

      res.status(200).json({
        success: true,
        message: `Application ${application.status.toLowerCase()} successfully.`,
        data: application,
      });
    } catch (error) {
      sendError(error, res, next);
    }
  },
);

export default applicationRouter;
