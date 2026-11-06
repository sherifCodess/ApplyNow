import { prisma } from "../../lib/prisma.js";
import { verifyPassword } from "./password.js";
import { createSession } from "./session.js";
import type { LoginInput } from "./login-schema.js";

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password.");
    this.name = "InvalidCredentialsError";
  }
}

export const loginStudent = async (input: LoginInput) => {
  const email = input.email.trim().toLowerCase();

  const user = await prisma.user.findUnique({
    where: {
      emailNormalized: email,
    },
    select: {
      id: true,
      passwordHash: true,
      emailVerifiedAt: true,
    },
  });

  if (!user) {
    throw new InvalidCredentialsError();
  }

  const passwordIsValid = await verifyPassword(
    input.password,
    user.passwordHash,
  );

  if (!passwordIsValid || !user.emailVerifiedAt) {
    throw new InvalidCredentialsError();
  }

  const session = await createSession(user.id);

  return {
    session,
  };
};
