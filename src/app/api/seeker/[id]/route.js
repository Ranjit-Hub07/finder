import pool from "@/lib/db";
import { NextResponse } from "next/server";

// ✅ App Router API for /api/jobs/[id]
export async function GET(req, { params }) {
  const { id } = params;

  try {
    // ✅ Validate ID
    if (!/^\d+$/.test(id)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    // ✅ Fetch job by ID with proper joins
    const jobRes = await pool.query(
      `SELECT 
         j.*, 
         i.indus_name, 
         r.role_name, 
         e.educ_name
       FROM jobs j
       LEFT JOIN du_job_industry i ON j.indus_id = i.indus_id
       LEFT JOIN du_job_role r ON j.role_id = r.role_id
       LEFT JOIN du_job_education e ON j.educ_id = e.educ_id
       WHERE j.id = $1`,
      [id]
    );

    if (jobRes.rows.length === 0) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const job = jobRes.rows[0];

    // ✅ Fetch similar jobs (same industry or role, exclude current job)
    const similarRes = await pool.query(
      `SELECT 
         j.id, 
         j.job_title, 
         j.job_minsalary, 
         j.salary_period, 
         j.created_at,
         r.role_name,
         i.indus_name
       FROM jobs j
       LEFT JOIN du_job_industry i ON j.indus_id = i.indus_id
       LEFT JOIN du_job_role r ON j.role_id = r.role_id
       WHERE j.is_active = true 
         AND j.is_delete = false 
         AND j.id != $1
         AND (j.indus_id = $2 OR j.role_id = $3)
       ORDER BY j.created_at DESC
       LIMIT 5`,
      [id, job.indus_id, job.role_id]
    );

    return NextResponse.json({
      success: true,
      job,
      similarJobs: similarRes.rows,
    });
  } catch (error) {
    console.error("❌ DB Error:", error.message);
    console.error("❌ Stack:", error.stack);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}
