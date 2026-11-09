import { createHash } from "node:crypto";
import type { Request, Response, NextFunction } from "express";
import { prisma } from "../../lib/prisma.js";

const SESSION_COOKIE_NAME = "applynow.sid";

const hashSessionToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

type AuthenticatedUser = {
  id: string;
  email: string;
  role: "STUDENT" | "ADMISSIONS_ADMIN" | "SUPER_ADMIN";
  sessionId: string;
};

declare global {
  namespace Express {
    interface Request {
      authenticatedUser?: AuthenticatedUser;
    }
  }
}

const getSessionToken = (cookieHeader: string | undefined): string | null => {
  if (!cookieHeader) {
    return null;
  }

  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  const token = cookie.slice(SESSION_COOKIE_NAME.length + 1);

  return /^[a-f0-9]{64}$/.test(token) ? token : null;
};

export const requireAuthentication = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const token = getSessionToken(req.headers.cookie);

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
        data: null,
      });
      return;
    }

    const tokenHash = hashSessionToken(token);

    const session = await prisma.session.findUnique({
      where: { tokenHash },
      select: {
        id: true,
        expiresAt: true,
        revokedAt: true,
        user: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
    });

    if (
      !session ||
      session.revokedAt !== null ||
      session.expiresAt.getTime() <= Date.now()
    ) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
        data: null,
      });
      return;
    }

    await prisma.session.update({
      where: { id: session.id },
      data: { lastActivityAt: new Date() },
    });

    req.authenticatedUser = {
      ...session.user,
      sessionId: session.id,
    };

    next();
  } catch (error) {
    next(error);
  }
};
