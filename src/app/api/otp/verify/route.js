import pool from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, phone, otp, user_type, purpose } = await req.json();

    if (!otp || !user_type || !purpose || (!email && !phone)) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const emailLower = email ? String(email).trim().toLowerCase() : null;
    const phoneStr = phone ? String(phone).trim() : null;
    const otpStr = String(otp).trim();

    const result = await pool.query(
      `SELECT id, otp, expires_at, is_used
       FROM otps
       WHERE otp = $1
         AND user_type = $2
         AND purpose = $3
         AND is_used = false
         AND (email = $4 OR phone = $5)
       ORDER BY created_at DESC
       LIMIT 1`,
      [otpStr, user_type, purpose, emailLower, phoneStr]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    const record = result.rows[0];

    if (new Date(record.expires_at) < new Date()) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // ✅ Mark OTP as used (verified)
    await pool.query(`UPDATE otps SET is_used = true WHERE id = $1`, [record.id]);

    return NextResponse.json({ message: "OTP verified successfully" }, { status: 200 });
  } catch (error) {
    console.error("OTP Verify Error:", error);
    return NextResponse.json({ message: "OTP verification failed" }, { status: 500 });
  }
}
