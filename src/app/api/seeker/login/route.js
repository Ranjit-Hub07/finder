import pool from "@/lib/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req) {
  try {
    const { emailOrPhone, password } = await req.json();

    if (!emailOrPhone || !password) {
      return NextResponse.json(
        { message: "Email/Phone and password are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "SELECT * FROM seekers WHERE email = $1 OR phone = $1",
      [emailOrPhone.trim()]
    );

    // ❌ USER NOT FOUND
    if (result.rowCount === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 401 }
      );
    }

    const seeker = result.rows[0];

    // ❌ INCOMPLETE REGISTRATION (TEMP PASSWORD)
    const isTempPassword = await bcrypt.compare(
      "TempPass123!",
      seeker.password
    );

    if (isTempPassword) {
      return NextResponse.json(
        { message: "Please complete registration first" },
        { status: 401 }
      );
    }

    // ❌ WRONG PASSWORD
    const isMatch = await bcrypt.compare(password, seeker.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Wrong password" },
        { status: 401 }
      );
    }

    // ✅ JWT
    const token = jwt.sign(
      { seeker_id: seeker.id, role: "seeker" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        seeker: {
          id: seeker.id,
          name: seeker.name,
          email: seeker.email,
          phone: seeker.phone,
          photo: seeker.photo || null,
          location: seeker.location || null,
          role: "seeker",
        },
      },
      { status: 200 }
    );

    response.cookies.set("seeker_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;

  } catch (err) {
    console.error("Seeker login error:", err);
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
