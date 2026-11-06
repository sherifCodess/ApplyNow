import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/prisma.js";
import { registrationSchema } from "../../src/modules/auth/registration-schema.js";
import { registerStudent } from "../../src/modules/auth/registration.js";
import { verifyEmailVerificationToken } from "../../src/modules/auth/email-verification.js";

const createdUserIds: string[] = [];

const validInput = {
  email: `registration-${randomUUID()}@example.test`,
  password: "ApplyNow@8",
};

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { id: { in: createdUserIds } },
  });

  await prisma.$disconnect();
});

describe("registration validation", () => {
  it("normalizes email addresses", () => {
    const result = registrationSchema.parse({
      email: "  STUDENT@Example.Test ",
      password: "ApplyNow@8",
    });

    expect(result.email).toBe("student@example.test");
  });

  it("rejects passwords shorter than 8 characters", () => {
    expect(
      registrationSchema.safeParse({
        email: "student@example.test",
        password: "Ab@1234",
      }).success,
    ).toBe(false);
  });

  it("rejects passwords longer than 15 characters", () => {
    expect(
      registrationSchema.safeParse({
        email: "student@example.test",
        password: "ApplyNow@1234567",
      }).success,
    ).toBe(false);
  });

  it("requires a number and a special character", () => {
    expect(
      registrationSchema.safeParse({
        email: "student@example.test",
        password: "ApplyNowPassword",
      }).success,
    ).toBe(false);

    expect(
      registrationSchema.safeParse({
        email: "student@example.test",
        password: "ApplyNow123",
      }).success,
    ).toBe(false);
  });
});

describe("student registration", () => {
  it("creates an unverified student and stores only the token hash", async () => {
    const input = {
      email: `  ${validInput.email.toUpperCase()}  `,
      password: validInput.password,
    };

    const parsedInput = registrationSchema.parse(input);
    const result = await registerStudent(parsedInput);

    expect(result.status).toBe("accepted");
    expect(result.verificationToken).toBeTruthy();

    const user = await prisma.user.findUnique({
      where: { emailNormalized: validInput.email },
      include: { emailVerificationToken: true },
    });

    expect(user).not.toBeNull();

    if (!user) {
      throw new Error("Expected registered user to exist.");
    }

    createdUserIds.push(user.id);

    expect(user.email).toBe(validInput.email);
    expect(user.role).toBe("STUDENT");
    expect(user.emailVerifiedAt).toBeNull();
    expect(user.passwordHash).not.toBe(input.password);
    expect(user.emailVerificationToken?.tokenHash).not.toBe(
      result.verificationToken,
    );

    await expect(
      verifyEmailVerificationToken(result.verificationToken!),
    ).resolves.toBe(true);
  });

  it("returns the same accepted status for a duplicate email", async () => {
    const firstInput = registrationSchema.parse(validInput);
    const firstResult = await registerStudent(firstInput);

    const user = await prisma.user.findUnique({
      where: { emailNormalized: validInput.email },
      select: { id: true },
    });

    expect(user).not.toBeNull();

    if (!user) {
      throw new Error("Expected registered user to exist.");
    }

    createdUserIds.push(user.id);

    const duplicateResult = await registerStudent(
      registrationSchema.parse({
        email: validInput.email.toUpperCase(),
        password: validInput.password,
      }),
    );

    expect(firstResult.status).toBe(duplicateResult.status);
    expect(duplicateResult.verificationToken).toBeNull();

    const count = await prisma.user.count({
      where: { emailNormalized: validInput.email },
    });

    expect(count).toBe(1);
  });
});
