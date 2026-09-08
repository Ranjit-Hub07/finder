import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      full_name,
      email,
      phone,
      password,
      company_name,
      current_designation,
      from_year,
      to_year,
      country,
      state,
      city,
      address,
      pincode,
      otp,
    } = body;

    // Required fields (you can adjust)
    if (!full_name || !email || !phone || !password || !company_name || !otp) {
      return NextResponse.json({ message: "Required fields missing" }, { status: 400 });
    }

    // Password validation
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password)) {
      return NextResponse.json({ message: "Weak password" }, { status: 400 });
    }

    const emailLower = String(email).trim().toLowerCase();
    const otpStr = String(otp).trim();

    // ✅ 1) Get latest OTP
    const otpRes = await pool.query(
      `SELECT id, otp, expires_at, is_used
       FROM otps
       WHERE email=$1 AND user_type='recruiter' AND purpose='register'
       ORDER BY created_at DESC
       LIMIT 1`,
      [emailLower]
    );

    if (otpRes.rowCount === 0) {
      return NextResponse.json({ message: "OTP not found" }, { status: 400 });
    }

    const row = otpRes.rows[0];

    // ✅ 2) Must match entered OTP
    if (String(row.otp) !== otpStr) {
      return NextResponse.json({ message: "Invalid OTP" }, { status: 400 });
    }

    // ✅ 3) Must be verified already
    if (!row.is_used) {
      return NextResponse.json({ message: "Please verify OTP first" }, { status: 400 });
    }

    // ✅ 4) Expiry check
    if (new Date() > row.expires_at) {
      return NextResponse.json({ message: "OTP expired" }, { status: 400 });
    }

    // ✅ Check if recruiter already exists
    const existing = await pool.query(`SELECT id FROM recruiters WHERE email=$1`, [emailLower]);
    if (existing.rowCount > 0) {
      return NextResponse.json({ message: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO recruiters (
        full_name, email, phone, password,
        company_name, current_designation,
        from_year, to_year,
        country, state, city,
        address, pincode
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)`,
      [
        full_name,
        emailLower,
        phone,
        hashedPassword,
        company_name,
        current_designation || null,
        from_year || null,
        to_year || null,
        country || null,
        state || null,
        city || null,
        address || null,
        pincode || null,
      ]
    );

    // ✅ Delete OTP after successful registration
    await pool.query(
      `DELETE FROM otps WHERE email=$1 AND user_type='recruiter' AND purpose='register'`,
      [emailLower]
    );

    return NextResponse.json({ message: "Recruiter registered successfully!" }, { status: 200 });
  } catch (err) {
    console.error("Recruiter Register Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
