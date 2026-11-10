import type { Request, Response, NextFunction } from "express";

type UserRole = "STUDENT" | "ADMISSIONS_ADMIN" | "SUPER_ADMIN";

export const requireRole = (...allowedRoles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = req.authenticatedUser;

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
        data: null,
      });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        message: "You do not have permission to perform this action.",
        data: null,
      });
      return;
    }

    next();
  };
};
