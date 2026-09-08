import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();

    const {
      location = [],
      experience = [],
      salary = [],
      education = [],
      industry = [],
      jobRole = [],
      jobType = [],
    } = body;

    let query = `SELECT * FROM jobs WHERE is_active = true AND is_delete = false`;
    const params = [];
    let index = 1;

    // Location (city name, stored in job_cityid)
    if (location.length > 0) {
      query += ` AND job_cityid = ANY($${index++})`;
      params.push(location);
    }

    // Experience: job_minexp >= min AND job_maxexp <= max
    if (experience.length > 0) {
      const clauses = [];
      for (const range of experience) {
        const [min, max] = range.split("-").map(Number);
        clauses.push(`(job_minexp >= $${index} AND job_maxexp <= $${index + 1})`);
        params.push(min, max);
        index += 2;
      }
      query += ` AND (${clauses.join(" OR ")})`;
    }

    // Salary: job_minsalary >= min AND job_maxsalary <= max
    if (salary.length > 0) {
      const clauses = [];
      for (const range of salary) {
        const [minStr, maxStr] = range.split("-");
        const min = Number(minStr.replace(/[^\d]/g, ""));
        const max = Number(maxStr.replace(/[^\d]/g, ""));
        clauses.push(`(job_minsalary >= $${index} AND job_maxsalary <= $${index + 1})`);
        params.push(min, max);
        index += 2;
      }
      query += ` AND (${clauses.join(" OR ")})`;
    }

    // Education
    if (education.length > 0) {
      query += ` AND job_mineducation = ANY($${index++})`;
      params.push(education);
    }

    // Industry (can be indus_id or name depending on your schema)
    if (industry.length > 0) {
      query += ` AND indus_id = ANY($${index++})`;
      params.push(industry);
    }

    // Job Role
    if (jobRole.length > 0) {
      query += ` AND job_role = ANY($${index++})`;
      params.push(jobRole);
    }

    // Job Type
    if (jobType.length > 0) {
      query += ` AND job_type = ANY($${index++})`;
      params.push(jobType);
    }

    query += ` ORDER BY created_at DESC`;

    // Logging (optional)
    console.log("🧾 SQL Query:", query);
    console.log("📦 Params:", params);

    const { rows } = await pool.query(query, params);
    return NextResponse.json({ success: true, jobs: rows });
  } catch (err) {
    console.error("❌ Filter API Error:", err);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
