import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET(request, { params }) {
  const { id } = params; // ✅ Correct destructure

  try {
    const query = `
      SELECT 
        j.*,
        ind.indus_name AS industry_name,
        role.role_name AS job_role_name,
        edu.educ_name AS education_name
      FROM jobs j
      LEFT JOIN du_job_industry ind ON j.indus_id = ind.indus_id
      LEFT JOIN du_job_role role ON j.role_id = role.role_id
      LEFT JOIN du_job_education edu ON j.educ_id = edu.educ_id
      WHERE j.id = $1
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0], { status: 200 });

  } catch (error) {
    console.error("DATABASE ERROR (Job GET):", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
