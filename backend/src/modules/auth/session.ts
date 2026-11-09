import { createHash, randomBytes, randomUUID } from "node:crypto";
import { prisma } from "../../lib/prisma.js";

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const SESSION_TOKEN_BYTES = 32;

const hashSessionToken = (token: string): string => {
  return createHash("sha256").update(token).digest("hex");
};

export const createSession = async (userId: string) => {
  const token = randomBytes(SESSION_TOKEN_BYTES).toString("hex");
  const tokenHash = hashSessionToken(token);
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await prisma.session.create({
    data: {
      id: randomUUID(),
      tokenHash,
      userId,
      expiresAt,
      lastActivityAt: new Date(),
    },
  });

  return {
    token,
    expiresAt,
  };
};

export const revokeSession = async (sessionId: string): Promise<void> => {
  await prisma.session.updateMany({
    where: {
      id: sessionId,
      revokedAt: null,
    },
    data: {
      revokedAt: new Date(),
    },
  });
};
