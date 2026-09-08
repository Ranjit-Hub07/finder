import { NextResponse } from "next/server";
import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

// ============================
// ✅ GET BASIC PROFILE
// ============================
export async function GET() {
  try {
    const cookieStore = await cookies(); // ✅ NO await
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.seeker_id; // ✅ FIXED

    if (!seekerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const result = await pool.query(
      `SELECT dob, gender, caste, disability_details 
       FROM seekers 
       WHERE id = $1`,
      [seekerId]
    );

    if (!result.rows.length) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ============================
// ✅ UPDATE BASIC PROFILE
// ============================
export async function PUT(req) {
  try {
    const cookieStore = await cookies(); // ✅ NO await
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const seekerId = decoded.seeker_id; // ✅ FIXED

    if (!seekerId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { gender, dob, disability, community } = body;

    await pool.query(
      `UPDATE seekers 
       SET gender = $1, dob = $2, disability_details = $3, caste = $4 
       WHERE id = $5`,
      [gender, dob, disability, community, seekerId]
    );

    return NextResponse.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("PUT error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
