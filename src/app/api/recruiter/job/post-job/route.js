import pool from "@/lib/db";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("recruiter_token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user_id = decoded.recruiter_id; // ✅ AUTO FROM JWT

    if (!user_id) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }

    const data = await request.json();

    const {
      job_title,
      job_type,
      job_industry,   
      job_role,       
      job_minsalary,
      job_maxsalary,
      salary_period,
      job_minexp,
      job_maxexp,
      job_company,
      job_cityid,     
      job_desc,
      job_reqemail = "",
      job_reqmob = "",
      job_mineducation,
      area,
      status = "open",
      is_active = true,
      is_verified = false,
      is_delete = false,
    } = data;

    const query = `
      INSERT INTO jobs (
        user_id, job_title, job_type, indus_id, role_id,
        job_minsalary, job_maxsalary, salary_period,
        job_minexp, job_maxexp, job_company, job_cityid,
        job_desc, job_reqemail, job_reqmob, educ_id,
        area, status, is_active, is_verified, is_delete
      ) VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8,
        $9, $10, $11, $12,
        $13, $14, $15, $16,
        $17, $18, $19, $20, $21
      ) RETURNING *;
    `;

    const values = [
      user_id,             // ✅ FIXED HERE
      job_title,
      job_type,
      job_industry,       
      job_role,           
      job_minsalary,
      job_maxsalary,
      salary_period,
      job_minexp,
      job_maxexp,
      job_company,
      job_cityid,
      job_desc,
      job_reqemail,
      job_reqmob,
      job_mineducation,   
      area,
      status.toLowerCase(),
      is_active,
      is_verified,
      is_delete,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json(
      { message: "Job posted successfully", job: result.rows[0] },
      { status: 201 }
    );

  } catch (error) {
    console.error("Post Job Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
