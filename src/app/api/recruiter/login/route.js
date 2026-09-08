import pool from "@/lib/db"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { email: identifier, password } = await req.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Email/Phone and password are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, full_name, email, phone, password, company_logo
       FROM recruiters
       WHERE email = $1 OR phone = $1
       LIMIT 1`,
      [identifier.trim()]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "User not found" }, { status: 401 });
    }

    const user = result.rows[0];

    // Check temporary password
    const isTempPassword = await bcrypt.compare("TempPass123!", user.password);
    if (isTempPassword) {
      return NextResponse.json(
        { message: "Please complete registration first" },
        { status: 401 }
      );
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: "Wrong password" }, { status: 401 });
    }

    // ✅ Include full_name and email in JWT
    const token = jwt.sign(
      {
        recruiter_id: user.id,
        role: "recruiter",
        full_name: user.full_name,
        email: user.email,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        user: {
          recruiter_id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          logo: user.company_logo || null,
        },
      },
      { status: 200 }
    );

    response.cookies.set("recruiter_token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return response;
  } catch (error) {
    console.error("Recruiter login error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
