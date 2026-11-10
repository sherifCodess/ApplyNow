import { createHash, randomBytes, randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma.js";
import { hashPassword } from "./password.js";
import type { RegistrationInput } from "./registration-schema.js";

const TOKEN_BYTES = 32;
const TOKEN_EXPIRATION_MS = 24 * 60 * 60 * 1000;

const hashToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

type RegistrationResult = {
  status: "accepted";
  verificationToken: string | null;
};

export const registerStudent = async (
  input: RegistrationInput,
): Promise<RegistrationResult> => {
  const email = input.email.trim().toLowerCase();
  const passwordHash = await hashPassword(input.password);

  const token = randomBytes(TOKEN_BYTES).toString("hex");
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);

  try {
    await prisma.$transaction(async (transaction) => {
      const user = await transaction.user.create({
        data: {
          id: randomUUID(),
          email,
          emailNormalized: email,
          passwordHash,
          role: "STUDENT",
          emailVerifiedAt: null,
        },
        select: {
          id: true,
        },
      });

      await transaction.emailVerificationToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt,
        },
      });
    });

    return {
      status: "accepted",
      verificationToken: token,
    };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      // Return the same public result for an existing email.
      return {
        status: "accepted",
        verificationToken: null,
      };
    }

    throw error;
  }
};
