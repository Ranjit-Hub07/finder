import { NextResponse } from "next/server";
import pool from "@/lib/db";

// GET: Fetch candidate details
export async function GET(req, context) {
  // ✅ params must be awaited
  const { jobId, seekerId } = await context.params;

  const jobID = Number(jobId);
  const seekerID = Number(seekerId);

  if (!jobID || !seekerID) {
    return NextResponse.json(
      { error: "Invalid jobId or seekerId" },
      { status: 400 }
    );
  }

  try {
    const query = `
      SELECT 
        s.id,
        s.name,
        s.email,
        s.phone AS contact,
        s.address AS location,
        s.job_type,
        q.educ_name AS education_level,
        jr.role_name AS job_role,
        s.experience,
        s.expected_salary AS salary,
        s.languages,
        s.resume,
        s.photo,
        s.working,
        s.designation,
        s.designation_experience,
        s.current_salary,
        s.dob,
        s.gender,
        s.passport,
        s.project_name,
        s.nationality,
        s.caste,
        ja.status,
        COALESCE(
          json_agg(json_build_object('id', sk.id, 'name', sk.name))
          FILTER (WHERE sk.id IS NOT NULL),
          '[]'
        ) AS skills
      FROM seekers s
      JOIN job_apply ja ON ja.user_id = s.id
      LEFT JOIN du_job_education q ON s.qualification::int = q.educ_id
      LEFT JOIN du_job_role jr ON s.job_role::int = jr.role_id
      LEFT JOIN LATERAL unnest(COALESCE(s.job_skill_ids, '{}')) AS skill_id ON TRUE
      LEFT JOIN skills sk ON sk.id = skill_id
      WHERE s.id = $1 AND ja.job_id = $2
      GROUP BY s.id, ja.status, q.educ_name, jr.role_name
      LIMIT 1
    `;

    const { rows } = await pool.query(query, [seekerID, jobID]);

    if (!rows.length) {
      return NextResponse.json(
        { error: "Candidate not found for this job" },
        { status: 404 }
      );
    }

    const c = rows[0];

    return NextResponse.json({
      id: c.id,
      name: c.name,
      email: c.email,
      contact: c.contact,
      location: c.location,
      jobType: c.job_type,
      educationLevel: c.education_level || "Not Mentioned",
      jobRole: c.job_role || "Not Mentioned",
      experience: c.experience,
      salary: c.salary,
      language: c.languages ? c.languages.split(",").map(l => l.trim()) : [],
      resume: c.resume,
      photo: c.photo,
      working: c.working,
      designation: c.designation,
      designationExperience: c.designation_experience,
      currentSalary: c.current_salary,
      dob: c.dob,
      gender: c.gender,
      passport: c.passport,
      skills: c.skills,
      projects: c.project_name
        ? c.project_name.split(",").map(p => p.trim())
        : [],
      nationality: c.nationality,
      caste: c.caste,
      status: c.status || "Pending",
      about: `Hi, I am ${c.name}. I am looking for ${c.job_role || "a role"} job.`,
    });
  } catch (err) {
    console.error("❌ Error fetching candidate:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
