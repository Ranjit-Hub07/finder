import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

async function getSeekerId() {
  const cookieStore = await cookies();
  const token = cookieStore.get("seeker_token")?.value;
  if (!token) return null;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const candidateId = decoded.seeker_id || decoded.id || decoded.userId;
    if (!candidateId) return null;

    // Verify seeker exists in DB
    const check = await pool.query(
      `SELECT id FROM seekers WHERE id = $1 LIMIT 1`,
      [candidateId]
    );
    if (!check.rows.length) return null;

    return candidateId;
  } catch (err) {
    console.error("JWT verification error in applied-jobs:", err);
    return null;
  }
}

export async function GET() {
  try {
    const seekerId = await getSeekerId();
    if (!seekerId) {
      return NextResponse.json(
        { error: "Unauthorized", requiresLogin: true, applications: [] },
        { status: 401 }
      );
    }

    const query = `
      SELECT 
        ja.id AS application_id,
        ja.job_id,
        ja.job_apply_date,
        COALESCE(ja.status, 'Pending') AS application_status,
        ja.candidate_desc,
        ja.created_at AS applied_at,
        ja.updated_at AS status_updated_at,
        COALESCE(j.job_title, 'Job Closed / Removed') AS job_title,
        COALESCE(j.job_company, 'Company') AS job_company,
        j.job_cityid,
        j.job_minexp,
        j.job_maxexp,
        j.job_minsalary,
        j.job_maxsalary,
        j.salary_period,
        j.job_type,
        j.job_desc,
        ji.indus_name AS industry_name,
        jr.role_name AS role_name,
        je.educ_name AS education_name
      FROM job_apply ja
      LEFT JOIN jobs j ON ja.job_id = j.id
      LEFT JOIN du_job_industry ji ON j.indus_id = ji.indus_id
      LEFT JOIN du_job_role jr ON j.role_id = jr.role_id
      LEFT JOIN du_job_education je ON j.educ_id = je.educ_id
      WHERE ja.user_id = $1 AND (ja.is_delete IS NULL OR ja.is_delete = false)
      ORDER BY ja.job_apply_date DESC, ja.id DESC
    `;

    const result = await pool.query(query, [seekerId]);
    const applications = result.rows;

    // Compute status counts for the application tracker tabs
    const counts = {
      all: applications.length,
      pending: 0,
      reviewed: 0,
      interview: 0,
      offered: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      const s = (app.application_status || "Pending").toLowerCase();
      if (s === "pending") counts.pending++;
      else if (s === "reviewed" || s === "phone screened") counts.reviewed++;
      else if (s === "interviewed" || s.includes("interview")) counts.interview++;
      else if (s === "offer made" || s === "hired") counts.offered++;
      else if (s === "rejected") counts.rejected++;
      else counts.pending++;
    });

    return NextResponse.json(
      {
        success: true,
        applications,
        counts,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("GET /api/seeker/applied-jobs error:", err);
    return NextResponse.json(
      { error: "Internal Server Error", details: err.message },
      { status: 500 }
    );
  }
}
