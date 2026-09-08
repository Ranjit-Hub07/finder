import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ Get all job roles OR filter by industry
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const indus_id = searchParams.get("indus_id");

    let result;
    if (indus_id) {
      // Roles for a specific industry
      result = await pool.query(
        `SELECT role_id, role_name, role_desc, is_active
         FROM du_job_role
         WHERE indus_id = $1 AND is_active = true
         ORDER BY role_name ASC`,
        [indus_id]
      );
    } else {
      // All roles
      result = await pool.query(
        `SELECT jr.role_id, jr.role_name, jr.role_desc, jr.is_active,
                ji.indus_id, ji.indus_name
         FROM du_job_role jr
         LEFT JOIN du_job_industry ji ON jr.indus_id = ji.indus_id
         ORDER BY jr.role_id ASC`
      );
    }

    return NextResponse.json(result.rows, { status: 200 });
  } catch (error) {
    console.error("Error fetching job roles:", error);
    return NextResponse.json({ error: "Failed to fetch job roles" }, { status: 500 });
  }
}
