import { describe, expect, it } from "vitest";
import {
  hashPassword,
  verifyPassword,
} from "../../src/modules/auth/password.js";

describe("password hashing", () => {
  it("hashes a password without storing the original value", async () => {
    const password = "ApplyNow-Unit-Test-Password-123!";
    const hash = await hashPassword(password);

    expect(hash).not.toBe(password);
    expect(hash).toContain("$argon2id$");
  });

  it("verifies the correct password", async () => {
    const password = "ApplyNow-Unit-Test-Password-123!";
    const hash = await hashPassword(password);

    await expect(verifyPassword(password, hash)).resolves.toBe(true);
  });

  it("rejects an incorrect password", async () => {
    const hash = await hashPassword("ApplyNow-Unit-Test-Password-123!");

    await expect(verifyPassword("incorrect-password", hash)).resolves.toBe(
      false,
    );
  });

  it("produces a different hash for the same password each time", async () => {
    const password = "ApplyNow-Unit-Test-Password-123!";

    const firstHash = await hashPassword(password);
    const secondHash = await hashPassword(password);

    expect(firstHash).not.toBe(secondHash);
    await expect(verifyPassword(password, firstHash)).resolves.toBe(true);
    await expect(verifyPassword(password, secondHash)).resolves.toBe(true);
  });
});
