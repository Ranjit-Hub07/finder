import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import bcrypt from "bcrypt";

const SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  try {
    const { currentPassword, newPassword } = await req.json();

    const cookieStore = cookies();
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, SECRET);
    const email = decoded.email;

    const result = await pool.query(
      "SELECT password FROM recruiters WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Recruiter not found" }, { status: 404 });
    }

    const dbHashedPassword = result.rows[0].password;

    // ✅ Compare with bcrypt
    const isMatch = await bcrypt.compare(currentPassword, dbHashedPassword);
    if (!isMatch) {
      return NextResponse.json({ message: "Current password is incorrect" }, { status: 400 });
    }

    // ✅ Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // ✅ Update the password
    await pool.query(
      "UPDATE recruiters SET password = $1 WHERE email = $2",
      [hashedNewPassword, email]
    );

    return NextResponse.json({ message: "Password changed successfully" });

  } catch (error) {
    console.error("Password change error:", error);
    return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
  }
}
