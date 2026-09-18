// app/api/jobs/latest/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sql = `
      SELECT
        j.*,
        i.indus_name,
        r.role_name,
        e.educ_name
      FROM jobs j
      LEFT JOIN du_job_industry i ON j.indus_id = i.indus_id
      LEFT JOIN du_job_role r ON j.role_id = r.role_id
      LEFT JOIN du_job_education e ON j.educ_id = e.educ_id
      WHERE (j.is_delete IS NULL OR j.is_delete = false) AND (j.is_active IS NULL OR j.is_active = true)
      ORDER BY COALESCE(j.updated_at, j.created_at) DESC, j.id DESC
      LIMIT 10;
    `;
    const { rows } = await pool.query(sql);

    return NextResponse.json(
      { success: true, jobs: rows || [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("latest jobs error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch jobs", jobs: [] }, { status: 500 });
  }
}
