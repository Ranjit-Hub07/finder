import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      job_title,
      job_type,
      job_industry,
      job_role,
      salary_period,
      location,
      min_exp,
      max_exp,
      job_description,
      // Add additional fields from your DB here as needed
    } = body;

    const query = `
      INSERT INTO jobs (
        job_title, job_type, job_industry, job_role,
        salary_period, job_cityid, job_minexp, job_maxexp,
        job_desc, created_at, updated_at
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9, NOW(), NOW())
      RETURNING id;
    `;

    const values = [
      job_title,
      job_type,
      job_industry,
      job_role,
      salary_period,
      location,       // city ID or name
      min_exp,
      max_exp,
      job_description,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ success: true, id: result.rows[0].id });
  } catch (error) {
    console.error("Upload job error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
