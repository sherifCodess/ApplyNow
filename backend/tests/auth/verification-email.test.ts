import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  createTransport: vi.fn(),
  sendMail: vi.fn(),
}));

vi.mock("nodemailer", () => ({
  default: {
    createTransport: mocks.createTransport,
  },
}));

describe("Gmail verification email delivery", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    mocks.sendMail.mockResolvedValue({ messageId: "test-message-id" });
    mocks.createTransport.mockReturnValue({
      sendMail: mocks.sendMail,
    });

    vi.stubEnv("EMAIL_PROVIDER", "gmail");
    vi.stubEnv("GMAIL_USER", "applynow.test@gmail.com");
    vi.stubEnv("GMAIL_APP_PASSWORD", "test-app-password");
    vi.stubEnv("EMAIL_FROM", "");
    vi.stubEnv("APP_BASE_URL", "https://applynow.example");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sends the verification email through Gmail SMTP", async () => {
    const { sendVerificationEmail } = await import(
      "../../src/modules/auth/verification-email.js"
    );

    const token = "a".repeat(64);

    await sendVerificationEmail(
      "student@example.com",
      token,
    );

    expect(mocks.createTransport).toHaveBeenCalledWith({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: "applynow.test@gmail.com",
        pass: "test-app-password",
      },
    });

    expect(mocks.sendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        from: "applynow.test@gmail.com",
        to: "student@example.com",
        subject: "Verify your ApplyNow email address",
        text: expect.stringContaining(
          `https://applynow.example/verify-email?token=${token}`,
        ),
        html: expect.stringContaining(token),
      }),
    );
  });

  it("propagates SMTP delivery failures", async () => {
    mocks.sendMail.mockRejectedValueOnce(
      new Error("SMTP delivery failed"),
    );

    const { sendVerificationEmail } = await import(
      "../../src/modules/auth/verification-email.js"
    );

    await expect(
      sendVerificationEmail(
        "student@example.com",
        "a".repeat(64),
      ),
    ).rejects.toThrow("SMTP delivery failed");
  });
});
