// @vitest-environment node

import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import { registerStudent } from "../../src/modules/auth/registration.js";
import { verifyEmailVerificationToken } from "../../src/modules/auth/email-verification.js";

const createdUserIds: string[] = [];

const createStudent = async (verified: boolean) => {
  const email = `login-${randomUUID()}@example.test`;

  const result = await registerStudent({
    email,
    password: "ApplyNow@8",
  });

  if (!result.verificationToken) {
    throw new Error("Expected a verification token.");
  }

  const user = await prisma.user.findUnique({
    where: { emailNormalized: email },
    select: { id: true },
  });

  if (!user) {
    throw new Error("Expected registered user to exist.");
  }

  createdUserIds.push(user.id);

  if (verified) {
    const verificationResult = await verifyEmailVerificationToken(
      result.verificationToken,
    );

    expect(verificationResult).toBe(true);
  }

  return { email };
};

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { id: { in: createdUserIds } },
  });

  await prisma.$disconnect();
});

describe("POST /api/v1/auth/login", () => {
  it("logs in a verified student and sets a secure session cookie", async () => {
    const student = await createStudent(true);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: student.email,
      password: "ApplyNow@8",
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      message: "Login successful.",
      data: null,
    });

    const cookie = response.headers["set-cookie"];
    const sessionCookie = Array.isArray(cookie) ? cookie[0] : cookie;

    expect(sessionCookie).toBeDefined();
    expect(sessionCookie).toContain("applynow.sid=");
    expect(sessionCookie).toContain("HttpOnly");
    expect(sessionCookie).toContain("SameSite=Lax");
    expect(sessionCookie).not.toContain("Secure");

    const sessions = await prisma.session.findMany({
      where: {
        user: { emailNormalized: student.email },
      },
    });

    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.tokenHash).not.toBe(
      sessionCookie?.split(";")[0]?.split("=")[1],
    );
  });

  it("rejects incorrect credentials with a generic response", async () => {
    const student = await createStudent(true);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: student.email,
      password: "WrongPass@8",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  it("rejects an unverified student", async () => {
    const student = await createStudent(false);

    const response = await request(app).post("/api/v1/auth/login").send({
      email: student.email,
      password: "ApplyNow@8",
    });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid email or password.");
    expect(response.headers["set-cookie"]).toBeUndefined();
  });

  it("rejects malformed login input", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "not-an-email",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid login details.");
  });
});
