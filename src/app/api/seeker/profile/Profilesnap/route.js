import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

const SECRET = process.env.JWT_SECRET;

// 🔹 Helper: Get seeker ID from JWT cookie (✅ FIXED)
async function getSeekerIdFromToken() {
  const cookieStore = await cookies(); // ✅ no await needed
  const token = cookieStore.get("seeker_token")?.value;

  if (!token) throw new Error("Token missing");

  const decoded = jwt.verify(token, SECRET);

  // ✅ THIS WAS THE BUG
  return decoded?.seeker_id;
}

// 🔹 JSON response helper
function jsonResponse(data, status = 200) {
  return NextResponse.json(data, { status });
}

// ========================================================
// ✅ GET — Fetch seeker profile (FIXED)
// ========================================================
export async function GET() {
  try {
    const seekerId = await getSeekerIdFromToken();

    if (!seekerId) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const { rows } = await pool.query(
      `SELECT 
          id,
          current_salary,
          expected_salary,
          CASE 
            WHEN experience IS NULL OR TRIM(experience) = '' THEN 'No'
            ELSE experience
          END AS experience,
          location,
          nationality,
          job_role AS role_id,
          notice_period,
          job_type,
          qualification AS qualification_id,
          photo,
          resume
       FROM seekers
       WHERE id = $1`,
      [seekerId]
    );

    if (!rows.length) {
      return jsonResponse({ error: "Profile not found" }, 404);
    }

    return jsonResponse(rows[0]);
  } catch (err) {
    console.error("GET profile error:", err);
    return jsonResponse({ error: err.message || "Internal Server Error" }, 500);
  }
}

// ========================================================
// ✅ PUT — Update existing profile (SAFE)
// ========================================================
export async function PUT(req) {
  try {
    const seekerId = await getSeekerIdFromToken();
    const formData = await req.formData();

    if (!seekerId) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }

    const hasExperience = formData.get("hasExperience") === "yes";

    const fields = {
      expected_salary: formData.get("expected_salary"),
      location: formData.get("location"),
      nationality: formData.get("nationality"),
      job_role: formData.get("job_role"),
      notice_period: formData.get("notice_period"),
      job_type: formData.get("job_type"),
      qualification: formData.get("qualification"),
    };

    if (hasExperience) {
      fields.current_salary = formData.get("current_salary");
      fields.experience = formData.get("experience") || "Yes";
    } else {
      fields.current_salary = null;
      fields.experience = "No";
    }

    const uploads = {};
    const profileImage = formData.get("photo");
    const resumeFile = formData.get("resume");

    const imageDir = path.join(process.cwd(), "public", "image", "seekers", "Photos");
    const resumeDir = path.join(process.cwd(), "public", "uploads", "resumes");

    await mkdir(imageDir, { recursive: true });
    await mkdir(resumeDir, { recursive: true });

    if (profileImage && profileImage.size > 0) {
      const imagePath = path.join(imageDir, profileImage.name);
      await writeFile(imagePath, Buffer.from(await profileImage.arrayBuffer()));
      uploads.photo = `/image/seekers/Photos/${profileImage.name}`;
    }

    if (resumeFile && resumeFile.size > 0) {
      const resumePath = path.join(resumeDir, resumeFile.name);
      await writeFile(resumePath, Buffer.from(await resumeFile.arrayBuffer()));
      uploads.resume = `/uploads/resumes/${resumeFile.name}`;
    }

    const updateFields = { ...fields, ...uploads };
    const keys = Object.keys(updateFields);
    const values = Object.values(updateFields);

    if (!keys.length) {
      return jsonResponse({ error: "No fields to update" }, 400);
    }

    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

    const { rows } = await pool.query(
      `UPDATE seekers 
       SET ${setClause} 
       WHERE id = $${keys.length + 1}
       RETURNING photo`,
      [...values, seekerId]
    );

    return jsonResponse({
      message: "Profile updated successfully",
      photo: rows[0]?.photo || null,
    });
  } catch (err) {
    console.error("PUT profile error:", err);
    return jsonResponse({ error: err.message || "Update failed" }, 500);
  }
}
