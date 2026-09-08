import { NextResponse } from "next/server";
import pool from "@/lib/db"; // adjust path if needed

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      location = [],
      experience = [],
      salary = [],
      education = [], // will contain IDs
      industry = [],  // will contain IDs
      jobRole = [],   // will contain IDs
      jobType = [],   // still text
      keyword = "",
    } = body;

    let conditions = [`j.is_active = true`, `j.is_delete = false`];
    let params = [];
    let idx = 1;

    // ✅ Location filter
    if (location.length) {
      conditions.push(`j.job_cityid = ANY($${idx++})`);
      params.push(location);
    }

    // ✅ Experience filter
    if (experience.length) {
      const exp = experience[0].split("-");
      if (exp.length === 2) {
        const minExp = parseInt(exp[0]);
        const maxExp = exp[1] === "5+" ? 100 : parseInt(exp[1]);
        conditions.push(`j.job_minexp >= $${idx} AND j.job_maxexp <= $${idx + 1}`);
        params.push(minExp, maxExp);
        idx += 2;
      }
    }

    // ✅ Salary filter
    if (salary.length) {
      const salConds = salary.map((range) => {
        const [min, max] = range.replace(" INR", "").split("-").map(Number);
        return `(j.job_minsalary >= ${min} AND j.job_maxsalary <= ${max})`;
      });
      conditions.push(`(${salConds.join(" OR ")})`);
    }

    // ✅ Education filter (IDs from du_job_education)
    if (education.length) {
      conditions.push(`j.educ_id = ANY($${idx++})`);
      params.push(education.map((id) => parseInt(id)));
    }

    // ✅ Industry filter (IDs from du_job_industry)
    if (industry.length) {
      conditions.push(`j.indus_id = ANY($${idx++})`);
      params.push(industry.map((id) => parseInt(id)));
    }

    // ✅ Job Role filter (IDs from du_job_role)
    if (jobRole.length) {
      conditions.push(`j.role_id = ANY($${idx++})`);
      params.push(jobRole.map((id) => parseInt(id)));
    }

    // ✅ Job Type filter (text)
    if (jobType.length) {
      conditions.push(`LOWER(j.job_type) = ANY($${idx++})`);
      params.push(jobType.map((j) => j.toLowerCase()));
    }

    // ✅ Keyword search in job_title
    if (keyword.trim() !== "") {
      conditions.push(`LOWER(j.job_title) LIKE $${idx++}`);
      params.push(`%${keyword.toLowerCase()}%`);
    }

    const whereClause = `WHERE ${conditions.join(" AND ")}`;
    const query = `
      SELECT 
        j.*,
        i.indus_name,
        r.role_name,
        e.educ_name
      FROM jobs j
      LEFT JOIN du_job_industry i ON j.indus_id = i.indus_id
      LEFT JOIN du_job_role r ON j.role_id = r.role_id
      LEFT JOIN du_job_education e ON j.educ_id = e.educ_id
      ${whereClause}
      ORDER BY j.created_at DESC
    `;

    console.log("▶️ Query:", query);
    console.log("📦 Params:", params);

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (err) {
    console.error("❌ API Error in filter-job:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
