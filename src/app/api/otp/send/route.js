import pool from "@/lib/db";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email, phone, user_type, purpose } = await req.json();

    // ✅ Validation
    if (!email && !phone) {
      return NextResponse.json({ message: "Email or phone required" }, { status: 400 });
    }
    if (!["recruiter", "seeker"].includes(user_type)) {
      return NextResponse.json({ message: "Invalid user type" }, { status: 400 });
    }
    if (!purpose) {
      return NextResponse.json({ message: "Purpose required" }, { status: 400 });
    }

    const emailLower = email ? String(email).trim().toLowerCase() : null;
    const phoneStr = phone ? String(phone).trim() : null;

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // ✅ IMPORTANT: Remove old OTPs for the same user + purpose (avoid multiple rows issue)
    await pool.query(
      `DELETE FROM otps
       WHERE user_type=$1 AND purpose=$2
         AND (email=$3 OR phone=$4)`,
      [user_type, purpose, emailLower, phoneStr]
    );

    // ✅ Save new OTP
    await pool.query(
      `INSERT INTO otps (email, phone, otp, user_type, purpose, expires_at, is_used)
       VALUES ($1, $2, $3, $4, $5, $6, false)`,
      [emailLower, phoneStr, otp, user_type, purpose, expiresAt]
    );

    // ✅ Send OTP email if email exists
    if (emailLower) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: Number(process.env.EMAIL_PORT),
        secure: Number(process.env.EMAIL_PORT) === 465,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: emailLower,
        subject: "Your OTP Code",
        text: `Your OTP code is ${otp}. It will expire in 5 minutes.`,
      });
    }

    return NextResponse.json({ message: "OTP sent successfully" }, { status: 200 });
  } catch (error) {
    console.error("OTP Send Error:", error);
    return NextResponse.json({ message: "Failed to send OTP" }, { status: 500 });
  }
}
