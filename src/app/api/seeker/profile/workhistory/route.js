import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET;

// ✅ ASYNC SAFE TOKEN READER (FIXED)
async function getSeekerIdFromToken() {
  const cookieStore = await cookies(); // ✅ MUST be awaited
  const token = cookieStore.get("seeker_token")?.value;

  if (!token) throw new Error("Seeker token not found");

  const decoded = jwt.verify(token, JWT_SECRET);
  const seekerId = decoded.seeker_id;

  if (!seekerId) throw new Error("Invalid token payload");

  return seekerId;
}

// ===================================
// ✅ GET: Fetch work history (FINAL FIXED)
// ===================================
export async function GET() {
  try {
    const seekerId = await getSeekerIdFromToken(); // ✅ await added

    const result = await pool.query(
      `SELECT 
        experience,
        current_working,
        designation_experience
       FROM seekers 
       WHERE id = $1`,
      [seekerId]
    );

    const row = result.rows[0];

    if (!row) {
      return NextResponse.json({
        experience: "No",
        current_working: "",
        designation_experience: "",
      });
    }

    // ✅ YOUR RULE:
    // "No" or "0" or 0 → No
    // ANY other value → Yes
    let normalizedExperience = "No";

    if (
      row.experience !== null &&
      row.experience !== undefined &&
      row.experience !== "No" &&
      row.experience !== "0" &&
      row.experience !== 0
    ) {
      normalizedExperience = "Yes";
    }

    return NextResponse.json({
      experience: normalizedExperience,
      current_working: row.current_working || "",
      designation_experience: row.designation_experience || "",
    });
  } catch (error) {
    console.error("GET work history error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// ===================================
// ✅ PUT: Update experience + work details (FIXED)
// ===================================
export async function PUT(req) {
  try {
    const seekerId = await getSeekerIdFromToken(); // ✅ await added
    const { hasExperience, company, designation } = await req.json();

    // ❌ If NO experience → store No and clear fields
    if (!hasExperience) {
      await pool.query(
        `UPDATE seekers 
         SET experience = 'No', current_working = NULL, designation_experience = NULL 
         WHERE id = $1`,
        [seekerId]
      );

      return NextResponse.json({ message: "Experience updated to No" });
    }

    // ✅ If YES → require company & designation
    if (!company || !designation) {
      return NextResponse.json(
        { error: "Company and Designation required" },
        { status: 400 }
      );
    }

    await pool.query(
      `UPDATE seekers 
       SET experience = 'Yes', current_working = $1, designation_experience = $2 
       WHERE id = $3`,
      [company, designation, seekerId]
    );

    return NextResponse.json({ message: "Experience updated successfully" });
  } catch (error) {
    console.error("PUT work history error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
