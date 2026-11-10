import { randomUUID } from "node:crypto";
import { afterAll, describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/prisma.js";
import {
  issueEmailVerificationToken,
  verifyEmailVerificationToken,
} from "../../src/modules/auth/email-verification.js";

const createdUserIds: string[] = [];

const createTestUser = async (): Promise<string> => {
  const id = randomUUID();
  const uniqueEmail = `verification-${id}@example.test`;

  await prisma.user.create({
    data: {
      id,
      email: uniqueEmail,
      emailNormalized: uniqueEmail,
      passwordHash: "test-only-password-hash",
    },
  });

  createdUserIds.push(id);
  return id;
};

afterAll(async () => {
  await prisma.user.deleteMany({
    where: { id: { in: createdUserIds } },
  });

  await prisma.$disconnect();
});

describe("email verification tokens", () => {
  it("stores only the token hash and verifies the email once", async () => {
    const userId = await createTestUser();
    const { token } = await issueEmailVerificationToken(userId);

    const storedToken = await prisma.emailVerificationToken.findUnique({
      where: { userId },
    });

    expect(storedToken).not.toBeNull();
    expect(storedToken?.tokenHash).not.toBe(token);

    await expect(verifyEmailVerificationToken(token)).resolves.toBe(true);
    await expect(verifyEmailVerificationToken(token)).resolves.toBe(false);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(user?.emailVerifiedAt).not.toBeNull();
  });

  it("rejects an expired token", async () => {
    const userId = await createTestUser();
    const { token } = await issueEmailVerificationToken(userId);

    await prisma.emailVerificationToken.update({
      where: { userId },
      data: { expiresAt: new Date(Date.now() - 1000) },
    });

    await expect(verifyEmailVerificationToken(token)).resolves.toBe(false);

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    expect(user?.emailVerifiedAt).toBeNull();
  });

  it("rejects malformed tokens", async () => {
    await expect(verifyEmailVerificationToken("invalid")).resolves.toBe(false);
  });

  it("replaces a previously issued token", async () => {
    const userId = await createTestUser();
    const first = await issueEmailVerificationToken(userId);
    const second = await issueEmailVerificationToken(userId);

    await expect(verifyEmailVerificationToken(first.token)).resolves.toBe(
      false,
    );
    await expect(verifyEmailVerificationToken(second.token)).resolves.toBe(
      true,
    );
  });
});
