// @vitest-environment node

import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import { registerStudent } from "../../src/modules/auth/registration.js";
import { createSession } from "../../src/modules/auth/session.js";

const createdUserIds: string[] = [];

const createTestSession = async () => {
  const email = `session-${randomUUID()}@example.test`;

  await registerStudent({
    email,
    password: "ApplyNow@8",
  });

  const user = await prisma.user.findUnique({
    where: { emailNormalized: email },
    select: { id: true, email: true },
  });

  if (!user) {
    throw new Error("Expected registered user to exist.");
  }

  createdUserIds.push(user.id);

  const session = await createSession(user.id);

  return { user, session };
};

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { id: { in: createdUserIds } },
  });

  await prisma.$disconnect();
});

describe("session authentication middleware", () => {
  it("revokes the current session and clears the cookie on logout", async () => {
    const { session } = await createTestSession();
    const cookie = `applynow.sid=${session.token}`;

    const logoutResponse = await request(app)
      .post("/api/v1/auth/logout")
      .set("Cookie", cookie);

    expect(logoutResponse.status).toBe(200);
    expect(logoutResponse.body.message).toBe("Logout successful.");

    expect(String(logoutResponse.headers["set-cookie"])).toContain(
      "applynow.sid=;",
    );

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", cookie);

    expect(meResponse.status).toBe(401);
    expect(meResponse.body.message).toBe("Authentication required.");
  });
  it("rejects requests without a session cookie", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
  });

  it("accepts a valid session and returns the authenticated user", async () => {
    const { user, session } = await createTestSession();

    const beforeRequest = await prisma.session.findUnique({
      where: {
        tokenHash: (await import("node:crypto"))
          .createHash("sha256")
          .update(session.token)
          .digest("hex"),
      },
      select: { lastActivityAt: true },
    });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", `applynow.sid=${session.token}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Authenticated user retrieved.",
      data: {
        id: user.id,
        email: user.email,
        role: "STUDENT",
      },
    });

    const updatedSession = await prisma.session.findUnique({
      where: {
        tokenHash: (await import("node:crypto"))
          .createHash("sha256")
          .update(session.token)
          .digest("hex"),
      },
      select: { lastActivityAt: true },
    });

    expect(updatedSession).not.toBeNull();
    expect(updatedSession!.lastActivityAt.getTime()).toBeGreaterThanOrEqual(
      beforeRequest!.lastActivityAt.getTime(),
    );
  });

  it("rejects an expired session", async () => {
    const { session } = await createTestSession();

    const tokenHash = (await import("node:crypto"))
      .createHash("sha256")
      .update(session.token)
      .digest("hex");

    await prisma.session.update({
      where: { tokenHash },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", `applynow.sid=${session.token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
  });

  it("rejects a revoked session", async () => {
    const { session } = await createTestSession();

    const tokenHash = (await import("node:crypto"))
      .createHash("sha256")
      .update(session.token)
      .digest("hex");

    await prisma.session.update({
      where: { tokenHash },
      data: { revokedAt: new Date() },
    });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", `applynow.sid=${session.token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Authentication required.");
  });
});
