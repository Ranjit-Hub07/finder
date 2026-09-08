import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET() {
  try {
    const cookieStore = await cookies();

    const recruiterToken = cookieStore.get("recruiter_token")?.value;
    const seekerToken = cookieStore.get("seeker_token")?.value;

    const token = recruiterToken || seekerToken;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token found" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    let userId = null;
    let role = decoded.role;

    if (role === "recruiter") {
      userId = decoded.recruiter_id;
    } else if (role === "seeker") {
      userId = decoded.seeker_id;
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthorized: Invalid token payload" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    let user = null;

    if (role === "recruiter") {
      const result = await pool.query(
        "SELECT id, full_name, email, company_logo AS logo, phone FROM recruiters WHERE id = $1",
        [userId]
      );
      user = result.rows[0];
    }

    if (role === "seeker") {
      const result = await pool.query(
        "SELECT id, name, email, photo, phone, location FROM seekers WHERE id = $1",
        [userId]
      );
      user = result.rows[0];
    }

    if (!user) {
      return NextResponse.json(
        { message: "Unauthorized: User not found" },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    // ✅ VERY IMPORTANT: SEND ROLE BACK
    return NextResponse.json(
      {
        message: "Authenticated",
        user: {
          ...user,
          role, // ✅ THIS FIXES NAVBAR ROLE & MENU
        },
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Auth Check Error:", error.message);

    return NextResponse.json(
      { message: "Unauthorized: Invalid or expired token" },
      {
        status: 401,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}
