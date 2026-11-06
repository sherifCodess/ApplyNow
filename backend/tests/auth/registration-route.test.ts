// @vitest-environment node

import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../src/app.js";
import { prisma } from "../../src/lib/prisma.js";

const createdUserIds: string[] = [];

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { id: { in: createdUserIds } },
  });

  await prisma.$disconnect();
});

describe("POST /api/v1/auth/register", () => {
  it("registers a student and does not expose the verification token", async () => {
    const email = `route-${randomUUID()}@example.test`;

    const response = await request(app).post("/api/v1/auth/register").send({
      email,
      password: "ApplyNow@8",
    });

    expect(response.status).toBe(202);
    expect(response.body).toEqual({
      success: true,
      message:
        "Registration accepted. Email verification delivery is not configured yet.",
      data: null,
    });

    const user = await prisma.user.findUnique({
      where: { emailNormalized: email },
      select: { id: true, role: true, emailVerifiedAt: true },
    });

    expect(user).not.toBeNull();

    if (user) {
      createdUserIds.push(user.id);
      expect(user.role).toBe("STUDENT");
      expect(user.emailVerifiedAt).toBeNull();
    }
  });

  it("rejects invalid registration details", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "not-an-email",
      password: "weak",
    });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Invalid registration details.");
  });

  it("returns the same response for a duplicate email", async () => {
    const email = `duplicate-${randomUUID()}@example.test`;

    const firstResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email,
        password: "ApplyNow@8",
      });

    const user = await prisma.user.findUnique({
      where: { emailNormalized: email },
      select: { id: true },
    });

    expect(user).not.toBeNull();

    if (user) {
      createdUserIds.push(user.id);
    }

    const duplicateResponse = await request(app)
      .post("/api/v1/auth/register")
      .send({
        email: email.toUpperCase(),
        password: "ApplyNow@8",
      });

    expect(duplicateResponse.status).toBe(firstResponse.status);
    expect(duplicateResponse.body).toEqual(firstResponse.body);
  });
});
