import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import pool from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET;

// Helper to authenticate seeker and verify existence in DB
async function getSeekerId() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("seeker_token")?.value;
    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET);
    const candidateId = decoded.seeker_id || decoded.seekerId || decoded.id;
    if (!candidateId) return null;

    const numericId = parseInt(candidateId, 10);
    if (!numericId || isNaN(numericId)) return null;

    // Verify seeker actually exists in database
    const userRes = await pool.query(
      "SELECT id FROM seekers WHERE id = $1 LIMIT 1",
      [numericId]
    );

    if (userRes.rows.length === 0) return null;

    return userRes.rows[0].id;
  } catch (err) {
    return null;
  }
}

// GET: Check if job is saved or fetch all saved jobs
export async function GET(req) {
  try {
    const seekerId = await getSeekerId();
    if (!seekerId) {
      return NextResponse.json(
        { isSaved: false, savedJobIds: [], message: "Not authenticated" },
        { status: 200 }
      );
    }

    const { searchParams } = new URL(req.url);
    const rawJobId = searchParams.get("job_id");

    // Single job check
    if (rawJobId) {
      const numericJobId = parseInt(rawJobId, 10);
      if (!numericJobId || isNaN(numericJobId)) {
        return NextResponse.json({ isSaved: false });
      }

      const res = await pool.query(
        "SELECT 1 FROM saved_jobs WHERE seeker_id = $1 AND job_id = $2 LIMIT 1",
        [seekerId, numericJobId]
      );
      return NextResponse.json({
        isSaved: res.rows.length > 0,
      });
    }

    // All saved jobs list
    const res = await pool.query(
      `SELECT 
         s.id AS saved_id,
         s.created_at AS saved_at,
         j.*,
         i.indus_name,
         r.role_name,
         e.educ_name
       FROM saved_jobs s
       JOIN jobs j ON s.job_id = j.id
       LEFT JOIN du_job_industry i ON j.indus_id = i.indus_id
       LEFT JOIN du_job_role r ON j.role_id = r.role_id
       LEFT JOIN du_job_education e ON j.educ_id = e.educ_id
       WHERE s.seeker_id = $1 AND (j.is_delete IS NULL OR j.is_delete = false)
       ORDER BY s.created_at DESC`,
      [seekerId]
    );

    return NextResponse.json({
      success: true,
      savedJobs: res.rows,
      savedJobIds: res.rows.map((r) => r.id),
    });
  } catch (err) {
    console.error("GET /api/seeker/saved-jobs error:", err);
    return NextResponse.json(
      { success: false, error: err.message, isSaved: false, savedJobIds: [] },
      { status: 200 }
    );
  }
}

// POST: Toggle or Save/Unsave a job
export async function POST(req) {
  try {
    const seekerId = await getSeekerId();
    if (!seekerId) {
      return NextResponse.json(
        {
          success: false,
          requiresLogin: true,
          message: "Please log in as a job seeker to save jobs.",
        },
        { status: 401 }
      );
    }

    let body = {};
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    const { job_id, action = "toggle" } = body;

    const numericJobId = parseInt(job_id, 10);
    if (!numericJobId || isNaN(numericJobId)) {
      return NextResponse.json(
        { success: false, message: "Valid job_id is required" },
        { status: 400 }
      );
    }

    // Verify job exists
    const jobCheck = await pool.query("SELECT id FROM jobs WHERE id = $1 LIMIT 1", [numericJobId]);
    if (jobCheck.rows.length === 0) {
      return NextResponse.json(
        { success: false, message: "Job does not exist" },
        { status: 404 }
      );
    }

    // Check existing
    const existing = await pool.query(
      "SELECT id FROM saved_jobs WHERE seeker_id = $1 AND job_id = $2 LIMIT 1",
      [seekerId, numericJobId]
    );

    if (action === "unsave" || (action === "toggle" && existing.rows.length > 0)) {
      await pool.query(
        "DELETE FROM saved_jobs WHERE seeker_id = $1 AND job_id = $2",
        [seekerId, numericJobId]
      );
      return NextResponse.json({
        success: true,
        isSaved: false,
        message: "Job removed from saved jobs",
      });
    }

    // Save
    await pool.query(
      `INSERT INTO saved_jobs (seeker_id, job_id, created_at)
       VALUES ($1, $2, NOW())
       ON CONFLICT (seeker_id, job_id) DO NOTHING`,
      [seekerId, numericJobId]
    );

    return NextResponse.json({
      success: true,
      isSaved: true,
      message: "Job saved successfully!",
    });
  } catch (err) {
    console.error("POST /api/seeker/saved-jobs error:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
