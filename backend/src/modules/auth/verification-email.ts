import { SendByte } from "@sendbyte/node";
import { env } from "../../config/env.js";

export const sendVerificationEmail = async (
  recipient: string,
  token: string,
): Promise<void> => {
  if (!env.SENDBYTE_API_KEY || !env.EMAIL_FROM) {
    throw new Error("Email delivery is not configured.");
  }

  const sendbyte = new SendByte(env.SENDBYTE_API_KEY);

  const verificationUrl = new URL("/verify-email", env.APP_BASE_URL);
  verificationUrl.searchParams.set("token", token);

  const url = verificationUrl.toString();

  await sendbyte.emails.send({
    from: env.EMAIL_FROM,
    to: recipient,
    subject: "Verify your ApplyNow email address",
    text: [
      "Thank you for registering with ApplyNow.",
      "",
      "Use the link below to verify your email address:",
      url,
      "",
      "This link expires in 24 hours.",
      "If you did not create this account, you can ignore this email.",
    ].join("\n"),
    html: `
      <h2>Verify your ApplyNow email address</h2>
      <p>Thank you for registering with ApplyNow.</p>
      <p>
        <a href="${url}">Verify your email address</a>
      </p>
      <p>This link expires in 24 hours.</p>
      <p>If you did not create this account, you can ignore this email.</p>
    `,
  });
};
