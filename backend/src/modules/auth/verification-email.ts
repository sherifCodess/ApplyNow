import { randomUUID } from "node:crypto";
import { SendByte } from "@sendbyte/node";
import { env } from "../../config/env.js";

const encodeMimeBody = (value: string): string =>
  Buffer.from(value, "utf8")
    .toString("base64")
    .match(/.{1,76}/g)!
    .join("\r\n");

const encodeBase64Url = (value: string): string =>
  Buffer.from(value, "utf8")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");

const getGmailAccessToken = async (): Promise<string> => {
  if (
    !env.GMAIL_CLIENT_ID ||
    !env.GMAIL_CLIENT_SECRET ||
    !env.GMAIL_REFRESH_TOKEN
  ) {
    throw new Error("Gmail API credentials are not configured.");
  }

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: env.GMAIL_CLIENT_ID,
      client_secret: env.GMAIL_CLIENT_SECRET,
      refresh_token: env.GMAIL_REFRESH_TOKEN,
      grant_type: "refresh_token",
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Gmail OAuth token request failed (${response.status}).`,
    );
  }

  const data = (await response.json()) as {
    access_token?: string;
  };

  if (!data.access_token) {
    throw new Error("Gmail OAuth response did not contain an access token.");
  }

  return data.access_token;
};

const sendWithGmailApi = async (
  recipient: string,
  subject: string,
  text: string,
  html: string,
): Promise<void> => {
  const from = env.EMAIL_FROM || env.GMAIL_USER;

  if (!from || !env.GMAIL_USER) {
    throw new Error("Gmail sender configuration is incomplete.");
  }

  if (/[\r\n]/.test(recipient) || /[\r\n]/.test(from)) {
    throw new Error("Invalid email header value.");
  }

  const boundary = `applynow-${randomUUID()}`;

  const mimeMessage = [
    `From: ${from}`,
    `To: ${recipient}`,
    `Subject: ${subject}`,
    "MIME-Version: 1.0",
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    "",
    `--${boundary}`,
    'Content-Type: text/plain; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodeMimeBody(text),
    `--${boundary}`,
    'Content-Type: text/html; charset="UTF-8"',
    "Content-Transfer-Encoding: base64",
    "",
    encodeMimeBody(html),
    `--${boundary}--`,
    "",
  ].join("\r\n");

  const accessToken = await getGmailAccessToken();

  const response = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        raw: encodeBase64Url(mimeMessage),
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Gmail API email send failed (${response.status}).`);
  }
};

export const sendVerificationEmail = async (
  recipient: string,
  token: string,
): Promise<void> => {
  const verificationUrl = new URL("/verify-email", env.APP_BASE_URL);
  verificationUrl.searchParams.set("token", token);

  const url = verificationUrl.toString();

  const subject = "Verify your ApplyNow email address";

  const text = [
    "Thank you for registering with ApplyNow.",
    "",
    "Use the link below to verify your email address:",
    url,
    "",
    "This link expires in 24 hours.",
    "If you did not create this account, you can ignore this email.",
  ].join("\n");

  const html = `
    <h2>Verify your ApplyNow email address</h2>
    <p>Thank you for registering with ApplyNow.</p>
    <p>
      <a href="${url}">Verify your email address</a>
    </p>
    <p>This link expires in 24 hours.</p>
    <p>If you did not create this account, you can ignore this email.</p>
  `;

  if (env.EMAIL_PROVIDER === "gmail") {
    await sendWithGmailApi(recipient, subject, text, html);
    return;
  }

  if (!env.SENDBYTE_API_KEY || !env.EMAIL_FROM) {
    throw new Error("SendByte email delivery is not configured.");
  }

  const sendbyte = new SendByte(env.SENDBYTE_API_KEY);

  await sendbyte.emails.send({
    from: env.EMAIL_FROM,
    to: recipient,
    subject,
    text,
    html,
  });
};
