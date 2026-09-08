import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";

const REQUIRED_FIELDS = [
  "current_salary",
  "expected_salary",
  "experience",
  "location",
  "nationality",
  "job_role",
  "notice_period",
  "job_type",
  "qualification",
  "photo",
  "resume",
  "dob",
  "gender",
  "caste",
  "disability_details",
  "languages",
  "job_skill_ids",
  "current_working",
  "designation_experience",
  "project_name",
];

export async function GET() {
  try {
    // ✅ cookies must be awaited (App Router rule)
    const cookieStore = await cookies();
    const token = cookieStore.get("seeker_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ FIX: you were using decoded.id (WRONG)
    const seekerId = decoded.seeker_id;

    if (!seekerId) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { rows } = await pool.query(
      `SELECT ${REQUIRED_FIELDS.join(", ")} FROM seekers WHERE id = $1`,
      [seekerId]
    );

    if (!rows.length) {
      return NextResponse.json({ error: "Seeker not found" }, { status: 404 });
    }

    const profile = rows[0];

    let completed = 0;
    const total = REQUIRED_FIELDS.length;
    const profileData = {};

    for (const field of REQUIRED_FIELDS) {
      const value = profile[field];

      // ✅ PROPER FILL CHECK (handles No, 0, empty, null)
      const isFilled =
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "No" &&
        value !== "0" &&
        (Array.isArray(value) ? value.length > 0 : true);

      if (isFilled) completed++;

      profileData[field] = value;
    }

    const completion = Math.round((completed / total) * 100);

    return NextResponse.json({
      completion,
      profileData,
    });
  } catch (error) {
    console.error("Profile completion error:", error.message);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
