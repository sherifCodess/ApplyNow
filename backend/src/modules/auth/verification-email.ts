import { SendByte } from "@sendbyte/node";
import nodemailer from "nodemailer";
import { env } from "../../config/env.js";

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
    if (!env.GMAIL_USER || !env.GMAIL_APP_PASSWORD) {
      throw new Error("Gmail SMTP is not configured.");
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: env.GMAIL_USER,
        pass: env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
      },
    });

    await transporter.sendMail({
      from: env.EMAIL_FROM || env.GMAIL_USER,
      to: recipient,
      subject,
      text,
      html,
    });

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
