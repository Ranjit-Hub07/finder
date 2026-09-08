import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

// Helper to extract recruiter ID safely
function getRecruiterId(decoded) {
  return decoded?.recruiter_id ?? decoded?.id ?? decoded?.user_id ?? null;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // 🔹 Filters
    const jobId = searchParams.get("jobId");
    const role = searchParams.get("role");
    const status = searchParams.get("status");
    const location = searchParams.get("location"); // ✅ NEW

    // 🔐 Auth
    const cookieStore = await cookies(); // ✅ MUST await
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const recruiterId = getRecruiterId(decoded);

    if (!recruiterId) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    // 🔹 Base query
    let query = `
      SELECT 
        ja.id AS apply_id,
        s.id AS seeker_id,
        s.name,
        s.email,
        s.phone AS contact,
        s.location,
        j.id AS "jobId",
        j.job_title AS job,
        ja.status,
        ja.job_apply_date,
        TO_CHAR(ja.created_at, 'YYYY-MM-DD') AS date,
        COALESCE(edu.educ_name, s.qualification) AS education,
        r.role_name
      FROM job_apply ja
      JOIN jobs j ON ja.job_id = j.id
      JOIN seekers s ON ja.user_id = s.id
      LEFT JOIN du_job_role r ON j.role_id = r.role_id
      LEFT JOIN du_job_education edu
        ON edu.educ_id::text = s.qualification
      WHERE COALESCE(ja.is_delete, false) = false
        AND COALESCE(ja.is_active, true) = true
        AND j.user_id = $1
    `;

    const params = [recruiterId];

    // 🔹 Job ID filter
    if (jobId && !Number.isNaN(Number(jobId))) {
      query += ` AND ja.job_id = $${params.length + 1}`;
      params.push(Number(jobId));
    }

    // 🔹 Role filter
    if (role) {
      query += ` AND r.role_name = $${params.length + 1}`;
      params.push(role);
    }

    // 🔹 Status filter
    if (status) {
      query += ` AND ja.status = $${params.length + 1}`;
      params.push(status);
    }

    // 🔹 Location filter (NEW)
    if (location) {
      query += ` AND s.location ILIKE $${params.length + 1}`;
      params.push(`%${location}%`);
    }

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("❌ Candidates API Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch candidates" },
      { status: 500 }
    );
  }
}
