import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import type {
  CreateApplicationInput,
  ReviewApplicationInput,
} from "./application-schema.js";

export class PendingApplicationExistsError extends Error {
  constructor() {
    super("You already have a pending application.");
    this.name = "PendingApplicationExistsError";
  }
}

export class ApplicationNotFoundError extends Error {
  constructor() {
    super("Application not found.");
    this.name = "ApplicationNotFoundError";
  }
}

export class ApplicationAlreadyReviewedError extends Error {
  constructor() {
    super("This application has already been reviewed.");
    this.name = "ApplicationAlreadyReviewedError";
  }
}

const isUniqueConstraintError = (error: unknown): boolean => {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
};

export const createApplication = async (
  studentId: string,
  input: CreateApplicationInput,
) => {
  const existing = await prisma.application.findFirst({
    where: {
      studentId,
      status: "Pending",
    },
    select: { id: true },
  });

  if (existing) {
    throw new PendingApplicationExistsError();
  }

  try {
    return await prisma.application.create({
      data: {
        studentId,
        personal: input.personal as Prisma.InputJsonValue,
        academic: input.academic as Prisma.InputJsonValue,
        guardian: input.guardian as Prisma.InputJsonValue,
      },
    });
  } catch (error) {
    // The PostgreSQL partial unique index protects against concurrent requests.
    if (isUniqueConstraintError(error)) {
      throw new PendingApplicationExistsError();
    }

    throw error;
  }
};

export const getLatestStudentApplication = async (studentId: string) => {
  return prisma.application.findFirst({
    where: { studentId },
    orderBy: { submittedAt: "desc" },
  });
};

export const listApplications = async (
  status?: "Pending" | "Approved" | "Rejected",
) => {
  return prisma.application.findMany({
    ...(status ? { where: { status } } : {}),
    orderBy: { submittedAt: "desc" },
  });
};

export const getApplicationById = async (id: string) => {
  return prisma.application.findUnique({
    where: { id },
  });
};

export const reviewApplication = async (
  id: string,
  input: ReviewApplicationInput,
) => {
  const existing = await prisma.application.findUnique({
    where: { id },
    select: { id: true, status: true },
  });

  if (!existing) {
    throw new ApplicationNotFoundError();
  }

  // Only Pending applications can receive a decision.
  const result = await prisma.application.updateMany({
    where: {
      id,
      status: "Pending",
    },
    data: {
      status: input.status,
      reviewedAt: new Date(),
    },
  });

  if (result.count === 0) {
    throw new ApplicationAlreadyReviewedError();
  }

  return prisma.application.findUniqueOrThrow({
    where: { id },
  });
};
