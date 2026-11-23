import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  fetch: vi.fn(),
}));

describe("Gmail API verification email delivery", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();

    vi.stubGlobal("fetch", mocks.fetch);

    mocks.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "test-access-token" }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: "test-message-id" }), {
          status: 200,
        }),
      );

    vi.stubEnv("EMAIL_PROVIDER", "gmail");
    vi.stubEnv("GMAIL_USER", "applynow.test@gmail.com");
    vi.stubEnv("GMAIL_CLIENT_ID", "test-client-id");
    vi.stubEnv("GMAIL_CLIENT_SECRET", "test-client-secret");
    vi.stubEnv("GMAIL_REFRESH_TOKEN", "test-refresh-token");
    vi.stubEnv("EMAIL_FROM", "");
    vi.stubEnv("APP_BASE_URL", "https://applynow.example");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("refreshes the OAuth token and sends the verification email through Gmail API", async () => {
    const { sendVerificationEmail } =
      await import("../../src/modules/auth/verification-email.js");

    const token = "a".repeat(64);

    await sendVerificationEmail("student@example.com", token);

    expect(mocks.fetch).toHaveBeenCalledTimes(2);

    expect(mocks.fetch).toHaveBeenNthCalledWith(
      1,
      "https://oauth2.googleapis.com/token",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }),
    );

    expect(mocks.fetch).toHaveBeenNthCalledWith(
      2,
      "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
      expect.objectContaining({
        method: "POST",
        headers: {
          Authorization: "Bearer test-access-token",
          "Content-Type": "application/json",
        },
      }),
    );

    const sendRequest = mocks.fetch.mock.calls[1]?.[1];
    const payload = JSON.parse(String(sendRequest?.body)) as {
      raw: string;
    };

    const decodedMessage = Buffer.from(
      payload.raw.replace(/-/g, "+").replace(/_/g, "/"),
      "base64",
    ).toString("utf8");

    expect(decodedMessage).toContain("From: applynow.test@gmail.com");
    expect(decodedMessage).toContain("To: student@example.com");
    expect(decodedMessage).toContain(
      "Subject: Verify your ApplyNow email address",
    );
    expect(decodedMessage).toContain("multipart/alternative");

    const encodedParts = [
      ...decodedMessage.matchAll(
        /Content-Transfer-Encoding: base64\r\n\r\n([\s\S]*?)\r\n--/g,
      ),
    ];

    const decodedParts = encodedParts.map((match) =>
      Buffer.from(match[1]!.replace(/\r\n/g, ""), "base64").toString("utf8"),
    );

    expect(decodedParts).toHaveLength(2);

    expect(decodedParts[0]).toContain(
      `https://applynow.example/verify-email?token=${token}`,
    );

    expect(decodedParts[1]).toContain(
      `https://applynow.example/verify-email?token=${token}`,
    );
  });

  it("propagates Gmail OAuth token failures", async () => {
    mocks.fetch.mockReset();
    mocks.fetch.mockResolvedValueOnce(
      new Response("Unauthorized", { status: 401 }),
    );

    const { sendVerificationEmail } =
      await import("../../src/modules/auth/verification-email.js");

    await expect(
      sendVerificationEmail("student@example.com", "a".repeat(64)),
    ).rejects.toThrow("Gmail OAuth token request failed (401).");

    expect(mocks.fetch).toHaveBeenCalledTimes(1);
  });

  it("propagates Gmail API delivery failures", async () => {
    mocks.fetch.mockReset();

    mocks.fetch
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: "test-access-token" }), {
          status: 200,
        }),
      )
      .mockResolvedValueOnce(new Response("Forbidden", { status: 403 }));

    const { sendVerificationEmail } =
      await import("../../src/modules/auth/verification-email.js");

    await expect(
      sendVerificationEmail("student@example.com", "a".repeat(64)),
    ).rejects.toThrow("Gmail API email send failed (403).");
  });
});
