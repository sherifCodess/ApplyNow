// @vitest-environment node

import { afterAll, describe, expect, it } from "vitest";
import { randomUUID } from "node:crypto";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";
import { registerStudent } from "../../src/modules/auth/registration.js";

const createdUserIds: string[] = [];

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { id: { in: createdUserIds } },
  });

  await prisma.$disconnect();
});

describe("POST /api/v1/auth/verify-email", () => {
  it("verifies an email address and rejects reuse of the token", async () => {
    const email = `verify-${randomUUID()}@example.test`;

    const registration = await registerStudent({
      email,
      password: "ApplyNow@8",
    });

    expect(registration.verificationToken).not.toBeNull();

    const user = await prisma.user.findUniqueOrThrow({
      where: { emailNormalized: email },
      select: { id: true, emailVerifiedAt: true },
    });

    createdUserIds.push(user.id);

    const response = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ token: registration.verificationToken });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);

    const verifiedUser = await prisma.user.findUniqueOrThrow({
      where: { id: user.id },
      select: { emailVerifiedAt: true },
    });

    expect(verifiedUser.emailVerifiedAt).not.toBeNull();

    const reusedResponse = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ token: registration.verificationToken });

    expect(reusedResponse.status).toBe(400);
    expect(reusedResponse.body.message).toBe(
      "Invalid or expired verification link.",
    );
  });

  it("rejects a malformed verification token", async () => {
    const response = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ token: "invalid-token" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
  });

  it("rejects an expired verification token", async () => {
    const email = `expired-${randomUUID()}@example.test`;

    const registration = await registerStudent({
      email,
      password: "ApplyNow@8",
    });

    const user = await prisma.user.findUniqueOrThrow({
      where: { emailNormalized: email },
      select: { id: true },
    });

    createdUserIds.push(user.id);

    await prisma.emailVerificationToken.update({
      where: { userId: user.id },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    const response = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({ token: registration.verificationToken });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Invalid or expired verification link.");
  });
});
