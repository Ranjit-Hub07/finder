import pool from "@/lib/db"; // PostgreSQL connection
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });
    }

    // 1. Check if user exists
    const user = await pool.query("SELECT id FROM recruiters WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return new Response(JSON.stringify({ message: "User not found" }), { status: 404 });
    }

    // 2. Generate token and expiry
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // 3. Store token and expiry in DB
    await pool.query(
      "UPDATE recruiters SET reset_token = $1, token_expires = $2 WHERE email = $3",
      [token, expires, email]
    );

    // 4. Construct reset link
    const baseUrl = process.env.RESET_BASE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/recruiter/reset/${token}`;

    // 5. Send the email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // App password, not your real password
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🔑 Reset Your Password",
      html: `
        <p>You requested a password reset.</p>
        <p>Click the link below to reset your password. This link is valid for 1 hour:</p>
        <a href="${resetLink}">${resetLink}</a>
        <br /><br />
        <p>If you did not request this, you can safely ignore this email.</p>
      `,
    });

    return new Response(JSON.stringify({ message: "Reset link sent to your email" }), { status: 200 });
  } catch (err) {
    console.error("Error sending reset email:", err);
    return new Response(JSON.stringify({ message: "Internal server error" }), { status: 500 });
  }
}
