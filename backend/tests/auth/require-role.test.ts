// @vitest-environment node

import type { Request, Response, NextFunction } from "express";
import { describe, expect, it, vi } from "vitest";
import { requireRole } from "../../src/modules/auth/require-role.js";

const createMocks = (role?: "STUDENT" | "ADMISSIONS_ADMIN" | "SUPER_ADMIN") => {
  const req = {
    authenticatedUser: role
      ? {
          id: "test-user-id",
          email: "test@example.test",
          role,
          sessionId: "test-session-id",
        }
      : undefined,
  } as unknown as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  return { req, res, next };
};

describe("requireRole", () => {
  it("returns 401 when the request is not authenticated", () => {
    const { req, res, next } = createMocks();

    requireRole("ADMISSIONS_ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Authentication required.",
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 403 when the authenticated user lacks the required role", () => {
    const { req, res, next } = createMocks("STUDENT");

    requireRole("ADMISSIONS_ADMIN")(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "You do not have permission to perform this action.",
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when the user has an allowed role", () => {
    const { req, res, next } = createMocks("ADMISSIONS_ADMIN");

    requireRole("ADMISSIONS_ADMIN", "SUPER_ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("allows SUPER_ADMIN when only SUPER_ADMIN is required", () => {
    const { req, res, next } = createMocks("SUPER_ADMIN");

    requireRole("SUPER_ADMIN")(req, res, next);

    expect(next).toHaveBeenCalledOnce();
  });
});
