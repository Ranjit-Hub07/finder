// app/api/jobs/latest/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  try {
    const sql = `
      SELECT
        id,
        job_title,
        job_company,
        job_cityid,
        job_minsalary,
        job_maxsalary,
        salary_period,
        job_minexp,
        job_maxexp,
        job_desc,
        created_at,
        updated_at
      FROM public.jobs
      WHERE is_delete = false AND is_active = true
      ORDER BY COALESCE(updated_at, created_at) DESC, id DESC
      LIMIT 6;
    `;
    const { rows } = await pool.query(sql);

    return NextResponse.json(
      { success: true, jobs: rows },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err) {
    console.error("latest jobs error:", err);
    return NextResponse.json({ success: false, error: "Failed to fetch jobs" }, { status: 500 });
  }
}
