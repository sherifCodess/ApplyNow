import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../../lib/prisma.js";

const TOKEN_BYTES = 32;
const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000;

const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

/**
 * Creates or replaces a user's email-verification token.
 */
export const issueEmailVerificationToken = async (
  userId: string,
): Promise<{ token: string; expiresAt: Date }> => {
  const token = randomBytes(TOKEN_BYTES).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);

  await prisma.emailVerificationToken.upsert({
    where: { userId },
    create: {
      userId,
      tokenHash,
      expiresAt,
    },
    update: {
      tokenHash,
      expiresAt,
      consumedAt: null,
    },
  });

  return { token, expiresAt };
};

/**
 * Verifies a token once, provided it has not expired.
 * Token consumption and email verification happen atomically.
 */
export const verifyEmailVerificationToken = async (
  token: string,
): Promise<boolean> => {
  if (!token || token.length !== TOKEN_BYTES * 2) {
    return false;
  }

  const tokenHash = hashToken(token);
  const now = new Date();

  return prisma.$transaction(async (transaction) => {
    const consumed = await transaction.emailVerificationToken.updateMany({
      where: {
        tokenHash,
        consumedAt: null,
        expiresAt: { gt: now },
      },
      data: {
        consumedAt: now,
      },
    });

    if (consumed.count !== 1) {
      return false;
    }

    await transaction.user.updateMany({
      where: {
        id: (
          await transaction.emailVerificationToken.findUniqueOrThrow({
            where: { tokenHash },
            select: { userId: true },
          })
        ).userId,
        emailVerifiedAt: null,
      },
      data: {
        emailVerifiedAt: now,
      },
    });

    return true;
  });
};
