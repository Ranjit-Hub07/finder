import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ✅ GET: Fetch job by ID
export async function GET(request, { params }) {
  try {
    const jobId = parseInt(params?.id, 10);
    if (!jobId || isNaN(jobId)) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    const result = await pool.query("SELECT * FROM jobs WHERE id = $1", [jobId]);
    if (result.rows.length === 0) {
      return NextResponse.json({ message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error("Database error (GET):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// ✅ PUT: Update job by ID
export async function PUT(request, { params }) {
  try {
    const jobId = parseInt(params?.id, 10);
    if (!jobId || isNaN(jobId)) {
      return NextResponse.json({ message: "Invalid job ID" }, { status: 400 });
    }

    const data = await request.json();

    // Destructure fields and ensure numeric conversion for DB
    const {
      job_title,
      job_type,
      indus_id,
      role_id,
      job_minsalary,
      job_maxsalary,
      job_company,
      salary_period,
      job_cityid,
      job_minexp,
      job_maxexp,
      area,
      educ_id,
      job_desc,
      job_reqemail,
      job_reqmob,
    } = data;

    const values = [
      job_title ?? null,
      job_type ?? null,
      indus_id ? Number(indus_id) : null,
      role_id ? Number(role_id) : null,
      job_minsalary ? Number(job_minsalary) : 0,
      job_maxsalary ? Number(job_maxsalary) : 0,
      job_company ?? null,
      salary_period ?? null,
      job_cityid ?? null,
      job_minexp ? Number(job_minexp) : 0,
      job_maxexp ? Number(job_maxexp) : 0,
      area ?? null,
      educ_id ? Number(educ_id) : null,
      job_desc ?? null,
      job_reqemail ?? null,
      job_reqmob ?? null,
      jobId,
    ];

    const updateQuery = `
      UPDATE jobs SET
        job_title=$1,
        job_type=$2,
        indus_id=$3,
        role_id=$4,
        job_minsalary=$5,
        job_maxsalary=$6,
        job_company=$7,
        salary_period=$8,
        job_cityid=$9,
        job_minexp=$10,
        job_maxexp=$11,
        area=$12,
        educ_id=$13,
        job_desc=$14,
        job_reqemail=$15,
        job_reqmob=$16,
        updated_at=NOW()
      WHERE id=$17
      RETURNING *;
    `;

    const result = await pool.query(updateQuery, values);

    if (result.rowCount === 0) {
      return NextResponse.json({ message: "Job not found or not updated" }, { status: 404 });
    }

    return NextResponse.json({ message: "Job updated successfully", job: result.rows[0] });
  } catch (error) {
    console.error("Error updating job post (PUT):", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
