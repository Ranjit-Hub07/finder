import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { sendContactAutoReply } from "@/lib/email";

// ✅ Your reCAPTCHA secret key (from Google admin console)
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(req) {
  try {
    const { name, subject, email, phone, message, recaptchaToken } = await req.json();

    if (!name || !subject || !email || !phone || !message || !recaptchaToken) {
      return NextResponse.json({ success: false, error: "Missing fields" }, { status: 400 });
    }

    // ✅ Step 1: Verify reCAPTCHA token with Google
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
    const verifyBody = `secret=${RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`;

    const captchaRes = await fetch(verifyUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: verifyBody,
    });

    const captchaData = await captchaRes.json();

    if (!captchaData.success) {
      return NextResponse.json(
        { success: false, error: "Captcha verification failed" },
        { status: 400 }
      );
    }

    // ✅ Step 2: Send email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: `Contact Form - ${subject}`,
      html: `
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br/>${message}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    // ✅ Step 3: Auto-reply confirmation to the user
    try {
      await sendContactAutoReply({
        to: email,
        name,
        subject,
      });
    } catch (autoReplyErr) {
      console.error("Auto-reply to sender failed:", autoReplyErr);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
